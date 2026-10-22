export type RsvpAdultGuest = {
  name: string;
  mealPreference: string;
  dietaryRestrictions: string;
};

export type RsvpChildGuest = {
  name: string;
  age: string;
  mealPreference: string;
  dietaryRestrictions: string;
};

export type RsvpPayload = {
  /** Contact / primary guest submitting the RSVP */
  fullName: string;
  email: string;
  mobile: string;
  attending: "yes" | "no";
  /** Primary guest meal (when attending) */
  mealPreference: string;
  dietaryRestrictions: string;
  hotelStatus: string;
  flightInfo: string;
  songRequest: string;
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

function formatAdultsDetail(primary: {
  fullName: string;
  mealPreference: string;
  dietaryRestrictions: string;
}, adults: RsvpAdultGuest[]) {
  const all = [
    {
      name: primary.fullName,
      mealPreference: primary.mealPreference,
      dietaryRestrictions: primary.dietaryRestrictions,
    },
    ...adults,
  ];
  return all
    .map((a) => {
      const bits = [a.name];
      if (a.mealPreference) bits.push(a.mealPreference);
      if (a.dietaryRestrictions) bits.push(`diet: ${a.dietaryRestrictions}`);
      return bits.join(" — ");
    })
    .join("; ");
}

function formatChildrenDetail(children: RsvpChildGuest[]) {
  if (children.length === 0) return "";
  return children
    .map((c) => {
      const bits = [`${c.name} (age ${c.age})`];
      if (c.mealPreference) bits.push(c.mealPreference);
      if (c.dietaryRestrictions) bits.push(`diet: ${c.dietaryRestrictions}`);
      return bits.join(" — ");
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
    ...children.map((c) => `${c.name} (child, age ${c.age})`),
  ];
  return parts.join("; ");
}

export function buildRsvpPartyFields(input: {
  fullName: string;
  mealPreference: string;
  dietaryRestrictions: string;
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
    adultsDetail: formatAdultsDetail(input, input.adults),
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
      return {
        name,
        mealPreference: String(row.mealPreference ?? "").trim(),
        dietaryRestrictions: String(row.dietaryRestrictions ?? "").trim(),
      };
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
      return {
        name,
        age,
        mealPreference: String(row.mealPreference ?? "").trim(),
        dietaryRestrictions: String(row.dietaryRestrictions ?? "").trim(),
      };
    })
    .filter((item): item is RsvpChildGuest => Boolean(item));
}

export function normalizeRsvpPayload(raw: unknown): RsvpPayload | null {
  if (!raw || typeof raw !== "object") return null;
  const body = raw as Record<string, unknown>;

  const fullName = String(body.fullName ?? "").trim();
  const email = String(body.email ?? "").trim();
  const mobile = String(body.mobile ?? "").trim();
  const attending = body.attending === "no" ? "no" : body.attending === "yes" ? "yes" : "";

  if (!fullName || !email || !mobile || !attending) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;

  const mealPreference = String(body.mealPreference ?? "").trim();
  const dietaryRestrictions = String(body.dietaryRestrictions ?? "").trim();
  const adults = attending === "yes" ? parseAdults(body.adults) : [];
  const children = attending === "yes" ? parseChildren(body.children) : [];

  if (attending === "yes" && !mealPreference) return null;

  const party =
    attending === "yes"
      ? buildRsvpPartyFields({
          fullName,
          mealPreference,
          dietaryRestrictions,
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

  return {
    fullName,
    email,
    mobile,
    attending,
    mealPreference: attending === "yes" ? mealPreference : "",
    dietaryRestrictions: attending === "yes" ? dietaryRestrictions : "",
    hotelStatus: attending === "yes" ? String(body.hotelStatus ?? "").trim() : "",
    flightInfo: attending === "yes" ? String(body.flightInfo ?? "").trim() : "",
    songRequest: attending === "yes" ? String(body.songRequest ?? "").trim() : "",
    message: String(body.message ?? "").trim(),
    adults,
    children,
    ...party,
  };
}
