import { NextResponse } from "next/server";
import {
  getGoogleAppsScriptUrl,
  isGoogleConfigured,
  postToGoogleAppsScript,
} from "@/lib/googleSheets";
import {
  extractDriveFileId,
  memoryImageSrc,
  type GuestMemory,
} from "@/lib/memories";

export const runtime = "nodejs";

/** Keep under typical serverless body limits after base64 (~12MB binary ≈ 16MB JSON). */
const MAX_BYTES = 12 * 1024 * 1024;

type AppsMemoriesResponse = {
  ok?: boolean;
  error?: string;
  memories?: Array<{
    id: string;
    src: string;
    alt: string;
    createdAt: string;
    fileId?: string;
  }>;
  memory?: GuestMemory & { fileId?: string };
};

function normalizeMemory(m: {
  id?: string;
  src?: string;
  alt?: string;
  createdAt?: string;
  fileId?: string;
}): GuestMemory | null {
  if (!m?.id) return null;

  const fileId =
    (m.fileId && String(m.fileId).trim()) ||
    extractDriveFileId(String(m.src ?? "")) ||
    null;

  // Prefer same-origin proxy so Drive hotlink blocks don't break <img>.
  const src = fileId ? memoryImageSrc(fileId) : String(m.src ?? "").trim();

  if (!src) return null;

  return {
    id: String(m.id),
    src,
    alt: String(m.alt || "Guest wedding memory"),
    createdAt: String(m.createdAt || ""),
    ...(fileId ? { fileId } : {}),
  };
}

function normalizeMemories(
  memories: AppsMemoriesResponse["memories"],
): GuestMemory[] {
  if (!Array.isArray(memories)) return [];
  return memories
    .map((m) => normalizeMemory(m))
    .filter((m): m is GuestMemory => Boolean(m));
}

export async function GET() {
  const webhookUrl = getGoogleAppsScriptUrl("memories");
  if (!webhookUrl) {
    return NextResponse.json({
      ok: true,
      stored: "local-only",
      googleConfigured: false,
      memories: [],
    });
  }

  const result = await postToGoogleAppsScript<AppsMemoriesResponse>(webhookUrl, {
    type: "memories-list",
  });

  if (!result.ok) {
    console.error("[memories] list failed", result.status, result.body);
    return NextResponse.json(
      { error: "Could not load memories from Google." },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    stored: "google-drive",
    googleConfigured: true,
    memories: normalizeMemories(result.data?.memories),
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
  const base64 = String(body.base64 ?? "");
  const mimeType = String(body.mimeType ?? "");
  const fileName = String(body.fileName ?? "memory.jpg");
  const alt = String(body.alt ?? "").trim() || fileName.replace(/\.[^.]+$/, "");

  if (!base64 || !mimeType.startsWith("image/")) {
    return NextResponse.json(
      { error: "Please upload an image file." },
      { status: 400 },
    );
  }

  const approxBytes = Math.floor((base64.length * 3) / 4);
  if (approxBytes > MAX_BYTES) {
    return NextResponse.json(
      { error: "Please choose an image under 12MB (after compression)." },
      { status: 400 },
    );
  }

  const webhookUrl = getGoogleAppsScriptUrl("memories");
  if (!webhookUrl) {
    return NextResponse.json({
      ok: true,
      stored: "local-only",
      googleConfigured: false,
    });
  }

  const id = `mem-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const createdAt = new Date().toISOString();

  const result = await postToGoogleAppsScript<AppsMemoriesResponse>(webhookUrl, {
    type: "memories-upload",
    id,
    base64,
    mimeType,
    fileName,
    alt,
    createdAt,
  });

  if (!result.ok) {
    console.error("[memories] upload failed", result.status, result.body);
    return NextResponse.json(
      { error: guestMemoryUploadError() },
      { status: 502 },
    );
  }

  if (result.data?.ok === false) {
    console.error("[memories] upload rejected", result.data.error);
    return NextResponse.json(
      { error: guestMemoryUploadError(result.data.error) },
      { status: 502 },
    );
  }

  const memories = normalizeMemories(result.data?.memories);
  const memory =
    normalizeMemory(result.data?.memory ?? { id, src: "", alt, createdAt }) ??
    memories.find((item) => item.id === id) ?? {
      id,
      src: "",
      alt,
      createdAt,
    };

  return NextResponse.json({
    ok: true,
    stored: "google-drive",
    memory,
    memories,
  });
}

function guestMemoryUploadError(raw?: string) {
  if (raw && /access denied|DriveApp/i.test(raw)) {
    return "We couldn’t save that photo from the site. Use the Google Drive link above instead.";
  }
  return "We couldn’t save that photo from the site. Use the Google Drive link above instead.";
}

export async function HEAD() {
  return NextResponse.json({ googleConfigured: isGoogleConfigured("memories") });
}
