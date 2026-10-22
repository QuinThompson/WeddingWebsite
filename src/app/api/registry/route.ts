import { NextResponse } from "next/server";
import { wedding } from "@/data/wedding";
import {
  getGoogleAppsScriptUrl,
  isGoogleConfigured,
  postToGoogleAppsScript,
} from "@/lib/googleSheets";
import type { RegistryItem } from "@/lib/store";

export const runtime = "nodejs";

type AppsRegistryResponse = {
  ok?: boolean;
  error?: string;
  items?: RegistryItem[];
  seeded?: boolean;
};

function seedItems(): RegistryItem[] {
  return wedding.registry.items.map((item) => ({
    ...item,
    claimedBy: null,
    claimedAt: null,
    createdAt: wedding.date.iso,
  }));
}

function normalizeItems(items: RegistryItem[] | undefined): RegistryItem[] {
  if (!Array.isArray(items)) return [];
  return items.map((item) => ({
    id: String(item.id),
    title: String(item.title ?? ""),
    description: String(item.description ?? ""),
    storeLabel: String(item.storeLabel ?? ""),
    storeUrl: String(item.storeUrl ?? ""),
    priceLabel: String(item.priceLabel ?? ""),
    claimedBy: item.claimedBy ? String(item.claimedBy) : null,
    claimedAt: item.claimedAt ? String(item.claimedAt) : null,
    createdAt: String(item.createdAt ?? ""),
  }));
}

async function listOrSeed(webhookUrl: string) {
  const listed = await postToGoogleAppsScript<AppsRegistryResponse>(webhookUrl, {
    type: "registry-list",
  });
  if (!listed.ok) return listed;

  const items = normalizeItems(listed.data?.items);
  if (items.length > 0) {
    return { ok: true as const, items, seeded: false };
  }

  const seeded = await postToGoogleAppsScript<AppsRegistryResponse>(webhookUrl, {
    type: "registry-seed",
    items: seedItems(),
  });
  if (!seeded.ok) return seeded;

  return {
    ok: true as const,
    items: normalizeItems(seeded.data?.items),
    seeded: Boolean(seeded.data?.seeded),
  };
}

export async function GET() {
  const webhookUrl = getGoogleAppsScriptUrl("registry");
  if (!webhookUrl) {
    return NextResponse.json({
      ok: true,
      stored: "local-only",
      googleConfigured: false,
      items: seedItems(),
    });
  }

  const result = await listOrSeed(webhookUrl);
  if (!result.ok) {
    console.error("[registry] list failed", result.status, result.body);
    return NextResponse.json(
      { error: "Could not load registry from Google Sheets." },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    stored: "google-sheets",
    googleConfigured: true,
    items: result.items,
    seeded: result.seeded,
  });
}

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const body = json as Record<string, unknown>;
  const action = String(body.action ?? "");
  const webhookUrl = getGoogleAppsScriptUrl("registry");

  if (!webhookUrl) {
    return NextResponse.json({
      ok: true,
      stored: "local-only",
      googleConfigured: false,
      action,
    });
  }

  if (action === "claim") {
    const id = String(body.id ?? "").trim();
    const guestName = String(body.guestName ?? "").trim();
    if (!id || !guestName) {
      return NextResponse.json({ error: "id and guestName are required." }, { status: 400 });
    }

    const result = await postToGoogleAppsScript<AppsRegistryResponse>(webhookUrl, {
      type: "registry-claim",
      id,
      guestName,
      claimedAt: new Date().toISOString(),
    });

    if (!result.ok) {
      return NextResponse.json({ error: "Could not claim gift." }, { status: 502 });
    }
    if (result.data?.ok === false) {
      return NextResponse.json(
        {
          error: result.data.error || "Could not claim gift.",
          items: normalizeItems(result.data.items),
        },
        { status: 409 },
      );
    }

    return NextResponse.json({
      ok: true,
      stored: "google-sheets",
      items: normalizeItems(result.data?.items),
    });
  }

  if (action === "add") {
    const title = String(body.title ?? "").trim();
    const storeUrl = String(body.storeUrl ?? "").trim();
    if (!title || !storeUrl) {
      return NextResponse.json(
        { error: "title and storeUrl are required." },
        { status: 400 },
      );
    }

    const result = await postToGoogleAppsScript<AppsRegistryResponse>(webhookUrl, {
      type: "registry-add",
      id: `gift-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title,
      description: String(body.description ?? "").trim(),
      storeLabel: String(body.storeLabel ?? "Store").trim() || "Store",
      storeUrl,
      priceLabel: String(body.priceLabel ?? "").trim(),
      createdAt: new Date().toISOString(),
    });

    if (!result.ok || result.data?.ok === false) {
      return NextResponse.json({ error: "Could not add gift." }, { status: 502 });
    }

    return NextResponse.json({
      ok: true,
      stored: "google-sheets",
      items: normalizeItems(result.data?.items),
    });
  }

  return NextResponse.json({ error: "Unknown action." }, { status: 400 });
}

export async function HEAD() {
  return NextResponse.json({ googleConfigured: isGoogleConfigured("registry") });
}
