export type RsvpAdultGuest = {
  name: string;
};

export type RsvpChildGuest = {
  name: string;
  age: string;
};

export type InvitationAllowance = {
  code: string;
  household: string;
  allowedAdults: number;
  allowedChildren: number;
  /** Yes on the Guests sheet means this invitation may add paid plus-ones. */
  plusOneAllowed: boolean;
};

export function plusOneCounts(
  allowance: Pick<InvitationAllowance, "allowedAdults" | "allowedChildren">,
  adultCount: number,
  childCount: number,
) {
  return {
    plusOneAdults: Math.max(0, adultCount - allowance.allowedAdults),
    plusOneChildren: Math.max(0, childCount - allowance.allowedChildren),
  };
}

export type RsvpPayload = {
  /** Contact / primary guest submitting the RSVP */
  invitationCode: string;
  household: string;
  allowedAdults: string;
  allowedChildren: string;
  plusOneAdults: string;
  plusOneChildren: string;
  fullName: string;
  email: string;
  mobile: string;
  attending: "yes" | "no";
  hotelStatus: string;
  message: string;
  /** Additional adults (spouse, etc.) — not including the primary */
  adults: RsvpAdultGuest[];
  children: RsvpChildGuest[];
  /** Derived totals for sheets / CSV */
  guestCount: string;
  adultCount: string;
  childCount: string;
  /** Human-readable party summary */
  guestNames: string;
  adultsDetail: string;
  childrenDetail: string;
};

export type RsvpRecord = RsvpPayload & {
  id: string;
  submittedAt: string;
};

function formatAdultsDetail(primaryName: string, adults: RsvpAdultGuest[]) {
  return [primaryName, ...adults.map((adult) => adult.name)].join("; ");
}

function formatChildrenDetail(children: RsvpChildGuest[]) {
  if (children.length === 0) return "";
  return children.map((child) => `${child.name} (age ${child.age})`).join("; ");
}

function formatGuestNamesSummary(
  primaryName: string,
  adults: RsvpAdultGuest[],
  children: RsvpChildGuest[],
) {
  const parts = [
    `${primaryName} (adult)`,
    ...adults.map((a) => `${a.name} (adult)`),
    ...children.map((c) => `${c.name} (child, age ${c.age})`),
  ];
  return parts.join("; ");
}

export function buildRsvpPartyFields(input: {
  fullName: string;
  adults: RsvpAdultGuest[];
  children: RsvpChildGuest[];
}) {
  const adultTotal = 1 + input.adults.length;
  const childTotal = input.children.length;
  return {
    guestCount: String(adultTotal + childTotal),
    adultCount: String(adultTotal),
    childCount: String(childTotal),
    guestNames: formatGuestNamesSummary(input.fullName, input.adults, input.children),
    adultsDetail: formatAdultsDetail(input.fullName, input.adults),
    childrenDetail: formatChildrenDetail(input.children),
  };
}

export function createRsvpRecord(input: RsvpPayload): RsvpRecord {
  return {
    ...input,
    id: `rsvp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    submittedAt: new Date().toISOString(),
  };
}

function parseAdults(raw: unknown): RsvpAdultGuest[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      const name = String(row.name ?? "").trim();
      if (!name) return null;
      return { name };
    })
    .filter((item): item is RsvpAdultGuest => Boolean(item));
}

function parseChildren(raw: unknown): RsvpChildGuest[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      const name = String(row.name ?? "").trim();
      const age = String(row.age ?? "").trim();
      if (!name || !age) return null;
      return { name, age };
    })
    .filter((item): item is RsvpChildGuest => Boolean(item));
}

export function normalizeRsvpPayload(raw: unknown): RsvpPayload | null {
  if (!raw || typeof raw !== "object") return null;
  const body = raw as Record<string, unknown>;

  const invitationCode = String(body.invitationCode ?? "").trim();
  const fullName = String(body.fullName ?? "").trim();
  const email = String(body.email ?? "").trim();
  const mobile = String(body.mobile ?? "").trim();
  const attending = body.attending === "no" ? "no" : body.attending === "yes" ? "yes" : "";

  if (!invitationCode || !fullName || !email || !mobile || !attending) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;

  const adults = attending === "yes" ? parseAdults(body.adults) : [];
  const children = attending === "yes" ? parseChildren(body.children) : [];

  const party =
    attending === "yes"
      ? buildRsvpPartyFields({
          fullName,
          adults,
          children,
        })
      : {
          guestCount: "0",
          adultCount: "0",
          childCount: "0",
          guestNames: "",
          adultsDetail: "",
          childrenDetail: "",
        };

  const allowedAdults = Math.max(0, Number(body.allowedAdults) || 0);
  const allowedChildren = Math.max(0, Number(body.allowedChildren) || 0);
  const plusOnes =
    attending === "yes"
      ? plusOneCounts(
          { allowedAdults, allowedChildren },
          Number(party.adultCount) || 0,
          Number(party.childCount) || 0,
        )
      : { plusOneAdults: 0, plusOneChildren: 0 };

  return {
    invitationCode,
    household: String(body.household ?? "").trim(),
    allowedAdults: String(allowedAdults),
    allowedChildren: String(allowedChildren),
    plusOneAdults: String(plusOnes.plusOneAdults),
    plusOneChildren: String(plusOnes.plusOneChildren),
    fullName,
    email,
    mobile,
    attending,
    hotelStatus: attending === "yes" ? String(body.hotelStatus ?? "").trim() : "",
    message: String(body.message ?? "").trim(),
    adults,
    children,
    ...party,
  };
}
