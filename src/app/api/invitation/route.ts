import { NextResponse } from "next/server";
import {
  getGoogleAppsScriptUrl,
  postToGoogleAppsScript,
} from "@/lib/googleSheets";
import type { InvitationAllowance } from "@/lib/rsvp";

export const runtime = "nodejs";

type LookupResponse = {
  ok?: boolean;
  error?: string;
  guest?: InvitationAllowance;
};

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const code = String((json as { code?: unknown })?.code ?? "").trim();
  if (!code) {
    return NextResponse.json(
      { error: "Enter your invitation code." },
      { status: 400 },
    );
  }

  const webhookUrl = getGoogleAppsScriptUrl("rsvp");
  if (!webhookUrl) {
    return NextResponse.json(
      { error: "Invitation codes can’t be checked right now. Please try again later." },
      { status: 503 },
    );
  }

  const result = await postToGoogleAppsScript<LookupResponse>(webhookUrl, {
    type: "guest-lookup",
    code,
  });

  if (!result.ok) {
    console.error("[invitation] lookup failed", result.status, result.body);
    return NextResponse.json(
      { error: "We couldn’t check that invitation code. Please try again." },
      { status: 502 },
    );
  }

  if (!result.data?.ok || !result.data.guest) {
    return NextResponse.json(
      { error: result.data?.error || "That invitation code was not found." },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true, guest: result.data.guest });
}
