const KEYS = {
  opening: "wedding-opening-transition",
  fromDetail: "wedding-from-detail",
  dashboardScroll: "wedding-dashboard-scroll",
  rsvpNotice: "wedding-rsvp-notice",
  dashboardTop: "wedding-dashboard-top",
} as const;

export type RsvpNotice = "received" | "paid";

let cachedRsvpNotice: RsvpNotice | null | undefined;

export function markRsvpSubmitted(paidPlusOne: boolean) {
  const notice: RsvpNotice = paidPlusOne ? "paid" : "received";
  cachedRsvpNotice = notice;
  sessionStorage.setItem(KEYS.rsvpNotice, notice);
}

export function peekRsvpNotice(): RsvpNotice | null {
  if (cachedRsvpNotice !== undefined) return cachedRsvpNotice;
  const value = sessionStorage.getItem(KEYS.rsvpNotice);
  cachedRsvpNotice = value === "paid" || value === "received" ? value : null;
  return cachedRsvpNotice;
}

export function dismissRsvpNotice() {
  cachedRsvpNotice = null;
  sessionStorage.removeItem(KEYS.rsvpNotice);
}

export function markOpeningTransition() {
  sessionStorage.setItem(KEYS.opening, "1");
}

export function consumeOpeningTransition() {
  const value = sessionStorage.getItem(KEYS.opening) === "1";
  if (value) sessionStorage.removeItem(KEYS.opening);
  return value;
}

export function markFromDetail() {
  sessionStorage.setItem(KEYS.fromDetail, "1");
}

export function consumeFromDetail() {
  const value = sessionStorage.getItem(KEYS.fromDetail) === "1";
  if (value) sessionStorage.removeItem(KEYS.fromDetail);
  return value;
}

export function saveDashboardScroll() {
  sessionStorage.setItem(KEYS.dashboardScroll, String(window.scrollY));
}

export function restoreDashboardScroll() {
  const raw = sessionStorage.getItem(KEYS.dashboardScroll);
  sessionStorage.removeItem(KEYS.dashboardScroll);
  const y = raw ? Number(raw) : 0;
  if (!Number.isFinite(y)) return;
  window.requestAnimationFrame(() => {
    window.scrollTo(0, Math.max(0, y));
  });
}

export function clearDashboardScroll() {
  sessionStorage.removeItem(KEYS.dashboardScroll);
}

/** After RSVP, open the dashboard at the top instead of the saved scroll position. */
export function markDashboardTop() {
  clearDashboardScroll();
  sessionStorage.setItem(KEYS.dashboardTop, "1");
}

export function consumeDashboardTop() {
  const value = sessionStorage.getItem(KEYS.dashboardTop) === "1";
  if (value) sessionStorage.removeItem(KEYS.dashboardTop);
  return value;
}
