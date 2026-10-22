import { wedding } from "@/data/wedding";

/**
 * Client-side fallback store for RSVPs + gift registry.
 *
 * When GOOGLE_APPS_SCRIPT_URL is set, the live source of truth is Google
 * (Sheets for RSVP/registry, Drive for memories). These helpers remain as a
 * local backup / offline fallback.
 */

const RSVP_KEY = "wedding-rsvps-v1";
const REGISTRY_KEY = "wedding-registry-v1";

export type StoredRsvp = {
  id: string;
  submittedAt: string;
  fullName: string;
  email: string;
  mobile: string;
  attending: "yes" | "no";
  guestCount: string;
  guestNames: string;
  mealPreference: string;
  dietaryRestrictions: string;
  hotelStatus: string;
  flightInfo: string;
  songRequest: string;
  message: string;
  adultCount?: string;
  childCount?: string;
  adultsDetail?: string;
  childrenDetail?: string;
};

export type RegistryItem = {
  id: string;
  title: string;
  description: string;
  storeLabel: string;
  storeUrl: string;
  priceLabel: string;
  claimedBy: string | null;
  claimedAt: string | null;
  createdAt: string;
};

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function listRsvps(): StoredRsvp[] {
  return readJson<StoredRsvp[]>(RSVP_KEY, []);
}

export function saveRsvp(
  input: Omit<StoredRsvp, "id" | "submittedAt">,
): StoredRsvp {
  const entry: StoredRsvp = {
    ...input,
    id: `rsvp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    submittedAt: new Date().toISOString(),
  };
  const next = [entry, ...listRsvps()];
  writeJson(RSVP_KEY, next);
  return entry;
}

export function seedRegistryItems(): RegistryItem[] {
  return wedding.registry.items.map((item) => ({
    ...item,
    claimedBy: null,
    claimedAt: null,
    createdAt: wedding.date.iso,
  }));
}

export function listRegistryItems(): RegistryItem[] {
  const existing = readJson<RegistryItem[] | null>(REGISTRY_KEY, null);
  if (existing && existing.length > 0) return existing;
  const seeded = seedRegistryItems();
  if (typeof window !== "undefined") writeJson(REGISTRY_KEY, seeded);
  return seeded;
}

export function replaceRegistryItems(items: RegistryItem[]) {
  writeJson(REGISTRY_KEY, items);
}

export function addRegistryItem(input: {
  title: string;
  description: string;
  storeLabel: string;
  storeUrl: string;
  priceLabel: string;
}): RegistryItem {
  const item: RegistryItem = {
    id: `gift-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: input.title.trim(),
    description: input.description.trim(),
    storeLabel: input.storeLabel.trim() || "Store",
    storeUrl: input.storeUrl.trim(),
    priceLabel: input.priceLabel.trim(),
    claimedBy: null,
    claimedAt: null,
    createdAt: new Date().toISOString(),
  };
  const next = [item, ...listRegistryItems()];
  writeJson(REGISTRY_KEY, next);
  return item;
}

export function claimRegistryItem(id: string, guestName: string): RegistryItem | null {
  const name = guestName.trim();
  if (!name) return null;
  const items = listRegistryItems();
  const index = items.findIndex((item) => item.id === id);
  if (index < 0) return null;
  if (items[index].claimedBy) return items[index];

  const updated: RegistryItem = {
    ...items[index],
    claimedBy: name,
    claimedAt: new Date().toISOString(),
  };
  const next = [...items];
  next[index] = updated;
  writeJson(REGISTRY_KEY, next);
  return updated;
}

export function verifyCoupleAccess(code: string) {
  return code.trim() === wedding.coupleAccessCode;
}
