const KEYS = {
  opening: "wedding-opening-transition",
  fromDetail: "wedding-from-detail",
  dashboardScroll: "wedding-dashboard-scroll",
} as const;

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
