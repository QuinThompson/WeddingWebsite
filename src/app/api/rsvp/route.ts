import { NextResponse } from "next/server";
import {
  getGoogleAppsScriptUrl,
  isGoogleConfigured,
  postToGoogleAppsScript,
} from "@/lib/googleSheets";
import { createRsvpRecord, normalizeRsvpPayload } from "@/lib/rsvp";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    sheetsConfigured: isGoogleConfigured("rsvp"),
  });
}

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const payload = normalizeRsvpPayload(json);
  if (!payload) {
    return NextResponse.json(
      { error: "Missing or invalid RSVP fields (invitation code, name, email, mobile, attending)." },
      { status: 400 },
    );
  }

  const record = createRsvpRecord(payload);
  const webhookUrl = getGoogleAppsScriptUrl("rsvp");

  if (!webhookUrl) {
    return NextResponse.json(
      { error: "RSVPs can’t be saved right now. Please try again later." },
      { status: 503 },
    );
  }

  const result = await postToGoogleAppsScript(webhookUrl, {
    type: "rsvp",
    ...record,
  });

  if (!result.ok) {
    console.error("[rsvp] Google Sheets write failed", result.status, result.body);
    return NextResponse.json(
      {
        error: "Could not save RSVP to Google Sheets. Please try again.",
        details: process.env.NODE_ENV === "development" ? result.body : undefined,
      },
      { status: 502 },
    );
  }

  const saved = result.data as { ok?: boolean; error?: string } | null;
  if (saved && saved.ok === false) {
    return NextResponse.json(
      { error: saved.error || "That invitation code was not found." },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    stored: "google-sheets",
    id: record.id,
  });
}
