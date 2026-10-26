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
  /** Person's name when we already have it from their RSVP or household. */
  name?: string;
  allowedAdults: number;
  allowedChildren: number;
  /**
   * Yes on the Guests sheet means one plus-one is included at no charge.
   * No still allows a plus-one, but that guest must be paid for.
   */
  plusOneAllowed: boolean;
};

/** Coconut Bay prices ages 12 and under as children. Older children stay listed as children. */
export const RESORT_CHILD_MAX_AGE = 12;

export function countChildrenByResortAge(children: { age: string }[]) {
  let below12 = 0;
  let above12 = 0;
  let unstated = 0;
  for (const child of children) {
    const age = Number(child.age);
    if (!String(child.age).trim() || Number.isNaN(age) || age < 0) {
      unstated += 1;
    } else if (age <= RESORT_CHILD_MAX_AGE) {
      below12 += 1;
    } else {
      above12 += 1;
    }
  }
  return { below12, above12, unstated, total: children.length };
}

export function plusOneCounts(allowance: InvitationAllowance, adultCount: number, childCount: number) {
  const extraAdults = Math.max(0, adultCount - allowance.allowedAdults);
  const extraChildren = Math.max(0, childCount - allowance.allowedChildren);
  const freeSlots = allowance.plusOneAllowed ? 1 : 0;
  const complimentaryAdults = Math.min(extraAdults, freeSlots);
  const complimentaryChildren = Math.min(extraChildren, freeSlots - complimentaryAdults);

  return {
    plusOneAdults: extraAdults,
    plusOneChildren: extraChildren,
    complimentaryAdults,
    complimentaryChildren,
    paidAdults: extraAdults - complimentaryAdults,
    paidChildren: extraChildren - complimentaryChildren,
  };
}

/** Label for an extra guest. The included plus-one is applied to the first extra adult, then the first extra child. */
export function plusOneTag(
  allowance: InvitationAllowance,
  kind: "adult" | "child",
  index: number,
  adultCount: number,
): "" | "included" | "paid" {
  if (kind === "adult") {
    const extraNumber = index + 2 - allowance.allowedAdults;
    if (extraNumber <= 0) return "";
    return allowance.plusOneAllowed && extraNumber === 1 ? "included" : "paid";
  }

  const extraNumber = index + 1 - allowance.allowedChildren;
  if (extraNumber <= 0) return "";
  const extraAdults = Math.max(0, adultCount - allowance.allowedAdults);
  const freeSlotLeft = allowance.plusOneAllowed && extraAdults === 0;
  return freeSlotLeft && extraNumber === 1 ? "included" : "paid";
}

/** Paid child plus-ones split by Coconut Bay's age rule. Ages over 12 use the adult rate. */
export function paidChildAgeBands(
  allowance: InvitationAllowance,
  adultCount: number,
  children: { age: string }[],
) {
  const extraAdults = Math.max(0, adultCount - allowance.allowedAdults);
  const freeSlotLeft = allowance.plusOneAllowed && extraAdults === 0;
  let below12 = 0;
  let above12 = 0;
  children.forEach((child, index) => {
    const extraNumber = index + 1 - allowance.allowedChildren;
    if (extraNumber <= 0) return;
    if (freeSlotLeft && extraNumber === 1) return;
    const age = Number(child.age);
    if (Number.isNaN(age)) return;
    if (age > RESORT_CHILD_MAX_AGE) above12 += 1;
    else below12 += 1;
  });
  return { below12, above12 };
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
  dietaryRestrictions: string;
  message: string;
  /** Additional adults (spouse, etc.) — not including the primary */
  adults: RsvpAdultGuest[];
  children: RsvpChildGuest[];
  /** Derived totals for sheets / CSV */
  guestCount: string;
  adultCount: string;
  /** Children ages 12 and under. */
  childCountBelow12: string;
  /** Children older than 12, including 18 and older. Coconut Bay prices these guests as adults. */
  childCountAbove12: string;
  /** All listed children, used for the invitation's child allowance. */
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
  return children
    .map((child) => {
      const age = Number(child.age);
      const band = age >= 18 ? ", 18 or older" : age > RESORT_CHILD_MAX_AGE ? ", over 12" : "";
      return `${child.name} (age ${child.age}${band})`;
    })
    .join("; ");
}

function formatGuestNamesSummary(
  primaryName: string,
  adults: RsvpAdultGuest[],
  children: RsvpChildGuest[],
) {
  const parts = [
    `${primaryName} (adult)`,
    ...adults.map((a) => `${a.name} (adult)`),
    ...children.map((child) => {
      const age = Number(child.age);
      const label = age >= 18 ? "child 18 or older" : age > RESORT_CHILD_MAX_AGE ? "child over 12" : "child";
      return `${child.name} (${label}, age ${child.age})`;
    }),
  ];
  return parts.join("; ");
}

export function buildRsvpPartyFields(input: {
  fullName: string;
  adults: RsvpAdultGuest[];
  children: RsvpChildGuest[];
}) {
  const adultTotal = 1 + input.adults.length;
  const bands = countChildrenByResortAge(input.children);
  return {
    guestCount: String(adultTotal + bands.total),
    adultCount: String(adultTotal),
    childCountBelow12: String(bands.below12),
    childCountAbove12: String(bands.above12),
    childCount: String(bands.total),
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
          childCountBelow12: "0",
          childCountAbove12: "0",
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
          {
            code: invitationCode,
            household: String(body.household ?? ""),
            allowedAdults,
            allowedChildren,
            plusOneAllowed:
              body.plusOneAllowed === true ||
              String(body.plusOneAllowed ?? "").toLowerCase() === "true" ||
              String(body.plusOneAllowed ?? "").toLowerCase() === "yes",
          },
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
    dietaryRestrictions:
      attending === "yes" ? String(body.dietaryRestrictions ?? "").trim() : "",
    message: String(body.message ?? "").trim(),
    adults,
    children,
    ...party,
  };
}
