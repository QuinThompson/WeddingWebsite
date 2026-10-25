import { NextResponse } from "next/server";
import { getGoogleAppsScriptUrl, postToGoogleAppsScript } from "@/lib/googleSheets";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const body = json as {
    invitationCode?: unknown;
    name?: unknown;
    question?: unknown;
    whatsapp?: unknown;
  };
  const invitationCode = String(body.invitationCode ?? "").trim();
  const name = String(body.name ?? "").trim();
  const question = String(body.question ?? "").trim();
  const whatsapp = String(body.whatsapp ?? "").trim();

  if (!invitationCode) {
    return NextResponse.json({ error: "Enter your invitation code." }, { status: 400 });
  }
  if (!name) {
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  }
  if (!question) {
    return NextResponse.json({ error: "Please enter your question." }, { status: 400 });
  }
  if (!whatsapp || (whatsapp.match(/\d/g) || []).length < 7) {
    return NextResponse.json(
      { error: "Please enter the WhatsApp number you’d like us to use." },
      { status: 400 },
    );
  }
  if (question.length > 2000) {
    return NextResponse.json(
      { error: "Please keep your question under 2,000 characters." },
      { status: 400 },
    );
  }

  const webhookUrl = getGoogleAppsScriptUrl("rsvp");
  if (!webhookUrl) {
    return NextResponse.json(
      { error: "Questions can’t be sent right now. Please try again later." },
      { status: 503 },
    );
  }

  const result = await postToGoogleAppsScript(webhookUrl, {
    type: "question",
    invitationCode,
    name,
    question,
    whatsapp,
    submittedAt: new Date().toISOString(),
  });

  if (!result.ok) {
    console.error("[questions] Google Sheets write failed", result.status, result.body);
    return NextResponse.json(
      { error: "Could not send your question. Please try again." },
      { status: 502 },
    );
  }

  const saved = result.data as { ok?: boolean; error?: string } | null;
  if (saved && saved.ok === false) {
    const message = saved.error || "That invitation code was not found.";
    const notFound = /not found/i.test(message);
    return NextResponse.json({ error: message }, { status: notFound ? 404 : 400 });
  }

  return NextResponse.json({ ok: true });
}
