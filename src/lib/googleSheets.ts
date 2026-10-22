/**
 * Posts / gets JSON against a Google Apps Script web app.
 *
 * Apps Script accepts the POST at script.google.com, then 302s to a
 * googleusercontent "echo" URL that only allows GET — that GET returns the
 * doPost JSON result. Re-POSTing the redirect URL causes HTTP 405.
 */

type AppsScriptFail = { ok: false; status: number; body: string };
type AppsScriptOk<T> = { ok: true; data: T; raw: string };

const PLAIN_HEADERS = { "Content-Type": "text/plain;charset=utf-8" };

function parseJsonSafe(text: string): unknown {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

export async function postToGoogleAppsScript<T = unknown>(
  webhookUrl: string,
  payload: unknown,
): Promise<AppsScriptOk<T> | AppsScriptFail> {
  const body = JSON.stringify(payload);

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: PLAIN_HEADERS,
    body,
    redirect: "manual",
  });

  // Success without redirect (rare for /exec, but handle it)
  if (response.ok) {
    const text = await response.text();
    return { ok: true, data: parseJsonSafe(text) as T, raw: text };
  }

  // Normal Apps Script flow: 302 → GET Location for the JSON body
  if (response.status >= 300 && response.status < 400) {
    const location = response.headers.get("location");
    if (!location) {
      return { ok: false, status: response.status, body: "Missing redirect location" };
    }

    const follow = await fetch(location, {
      method: "GET",
      redirect: "follow",
      cache: "no-store",
    });
    const text = await follow.text();
    if (!follow.ok) {
      return { ok: false, status: follow.status, body: text.slice(0, 500) };
    }
    return { ok: true, data: parseJsonSafe(text) as T, raw: text };
  }

  const text = await response.text();
  return { ok: false, status: response.status, body: text.slice(0, 500) };
}

export async function getFromGoogleAppsScript<T = unknown>(
  webhookUrl: string,
  params: Record<string, string> = {},
): Promise<AppsScriptOk<T> | AppsScriptFail> {
  const url = new URL(webhookUrl);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    redirect: "follow",
    cache: "no-store",
  });

  const text = await response.text();
  if (!response.ok) {
    return { ok: false, status: response.status, body: text.slice(0, 500) };
  }

  return { ok: true, data: parseJsonSafe(text) as T, raw: text };
}

/** Prefer the unified script URL; fall back to legacy per-feature env vars. */
export function getGoogleAppsScriptUrl(kind?: "rsvp" | "registry" | "memories") {
  const unified = process.env.GOOGLE_APPS_SCRIPT_URL?.trim() || "";
  if (unified) return unified;

  if (kind === "rsvp") return process.env.GOOGLE_SHEETS_RSVP_URL?.trim() || "";
  if (kind === "registry") return process.env.GOOGLE_SHEETS_REGISTRY_URL?.trim() || "";
  if (kind === "memories") return process.env.GOOGLE_SHEETS_MEMORIES_URL?.trim() || "";

  return (
    process.env.GOOGLE_SHEETS_RSVP_URL?.trim() ||
    process.env.GOOGLE_SHEETS_REGISTRY_URL?.trim() ||
    process.env.GOOGLE_SHEETS_MEMORIES_URL?.trim() ||
    ""
  );
}

export function isGoogleConfigured(kind?: "rsvp" | "registry" | "memories") {
  return Boolean(getGoogleAppsScriptUrl(kind));
}

/** @deprecated use getGoogleAppsScriptUrl("rsvp") */
export function getRsvpSheetsWebhookUrl() {
  return getGoogleAppsScriptUrl("rsvp");
}

/** @deprecated use getGoogleAppsScriptUrl("registry") */
export function getRegistrySheetsWebhookUrl() {
  return getGoogleAppsScriptUrl("registry");
}

export function isRsvpSheetsConfigured() {
  return isGoogleConfigured("rsvp");
}
