import { wedding } from "@/data/wedding";

const STORAGE_KEY = "wedding-guest-memories-v1";

export type GuestMemory = {
  id: string;
  src: string;
  alt: string;
  createdAt: string;
  fileId?: string;
};

/** Public same-origin URL that proxies a Drive file through Next. */
export function memoryImageSrc(fileId: string) {
  return `/api/memories/file/${encodeURIComponent(fileId)}`;
}

/** Pull a Drive file id from common Drive/usercontent URLs. */
export function extractDriveFileId(value: string): string | null {
  const raw = value.trim();
  if (!raw) return null;

  const patterns = [
    /[?&]id=([a-zA-Z0-9_-]{10,})/,
    /\/d\/([a-zA-Z0-9_-]{10,})/,
    /\/file\/d\/([a-zA-Z0-9_-]{10,})/,
    /lh3\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]{10,})/,
  ];

  for (const pattern of patterns) {
    const match = raw.match(pattern);
    if (match?.[1]) return match[1];
  }

  if (/^[a-zA-Z0-9_-]{25,}$/.test(raw)) return raw;
  return null;
}

export function isMemoriesUnlocked(now = Date.now()) {
  if (wedding.memories.forceUnlock) return true;
  return now >= new Date(wedding.memories.unlockIso).getTime();
}

export function readGuestMemories(): GuestMemory[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as GuestMemory[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeGuestMemories(memories: GuestMemory[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));
}

export async function fetchGuestMemories(): Promise<{
  memories: GuestMemory[];
  stored: "google-drive" | "local-only";
}> {
  const response = await fetch("/api/memories", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Could not load guest memories.");
  }
  const data = (await response.json()) as {
    memories?: GuestMemory[];
    stored?: "google-drive" | "local-only";
  };

  if (data.stored === "google-drive") {
    return { memories: data.memories ?? [], stored: "google-drive" };
  }

  return { memories: readGuestMemories(), stored: "local-only" };
}

/**
 * Uploads to Google Drive via /api/memories when configured.
 * Falls back to localStorage (this browser only) otherwise.
 *
 * Guests can pick large camera photos (up to 40MB). We compress/resize
 * client-side before upload. Vercel rejects function bodies over 4.5MB
 * (FUNCTION_PAYLOAD_TOO_LARGE) before the route runs, and base64 adds
 * about a third, so the compressed file itself must stay near 3MB.
 */
export async function persistGuestMemory(file: File): Promise<{
  memory: GuestMemory;
  memories: GuestMemory[];
  stored: "google-drive" | "local-only";
}> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file.");
  }
  if (file.size > MAX_ORIGINAL_BYTES) {
    throw new Error("Please choose an image under 40MB.");
  }

  const prepared = await prepareImageForUpload(file);
  const base64 = prepared.dataUrl;

  const response = await fetch("/api/memories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      base64,
      mimeType: prepared.mimeType,
      fileName: prepared.fileName,
      alt: file.name.replace(/\.[^.]+$/, "") || "Guest wedding memory",
    }),
  });

  const data = (await response.json().catch(() => null)) as {
    error?: string;
    stored?: "google-drive" | "local-only";
    memory?: GuestMemory;
    memories?: GuestMemory[];
  } | null;

  if (response.status === 413) {
    throw new Error(
      "That photo is too large to upload. Please try a smaller image.",
    );
  }

  if (!response.ok) {
    throw new Error(data?.error || "Upload failed.");
  }

  if (data?.stored === "google-drive" && data.memories) {
    return {
      memory: data.memory!,
      memories: data.memories,
      stored: "google-drive",
    };
  }

  // Local fallback when Google is not configured
  const memory: GuestMemory = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    src: base64,
    alt: file.name.replace(/\.[^.]+$/, "") || "Guest wedding memory",
    createdAt: new Date().toISOString(),
  };
  const memories = [memory, ...readGuestMemories()];
  writeGuestMemories(memories);
  return { memory, memories, stored: "local-only" };
}

/** Original camera/library pick limit (before compression). */
const MAX_ORIGINAL_BYTES = 40 * 1024 * 1024;
/**
 * Max binary size after compression.
 * A 3MB file becomes ~4MB once it is a base64 data URL inside JSON, which
 * stays under Vercel's 4.5MB serverless request-body limit.
 */
const MAX_UPLOAD_BYTES = 3 * 1024 * 1024;
const MAX_DIMENSION = 4000;

async function prepareImageForUpload(file: File): Promise<{
  dataUrl: string;
  mimeType: string;
  fileName: string;
}> {
  // Small enough already — send as-is.
  if (file.size <= MAX_UPLOAD_BYTES && file.type !== "image/heic" && file.type !== "image/heif") {
    return {
      dataUrl: await readFileAsDataUrl(file),
      mimeType: file.type || "image/jpeg",
      fileName: file.name,
    };
  }

  const bitmap = await createImageBitmap(file);
  try {
    let width = bitmap.width;
    let height = bitmap.height;
    const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height));
    width = Math.max(1, Math.round(width * scale));
    height = Math.max(1, Math.round(height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not process that image.");
    ctx.drawImage(bitmap, 0, 0, width, height);

    let quality = 0.92;
    let blob: Blob | null = null;
    for (let attempt = 0; attempt < 10; attempt += 1) {
      blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((next) => resolve(next), "image/jpeg", quality),
      );
      if (!blob) break;
      if (blob.size <= MAX_UPLOAD_BYTES) break;
      // Shrink quality, then dimensions if still too large.
      if (quality > 0.55) {
        quality -= 0.08;
      } else {
        width = Math.max(800, Math.round(width * 0.85));
        height = Math.max(800, Math.round(height * 0.85));
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(bitmap, 0, 0, width, height);
        quality = 0.85;
      }
    }

    if (!blob || blob.size > MAX_UPLOAD_BYTES) {
      throw new Error(
        "That photo is still too large after compression. Please try a smaller image.",
      );
    }

    const baseName = file.name.replace(/\.[^.]+$/, "") || "memory";
    return {
      dataUrl: await readFileAsDataUrl(blob),
      mimeType: "image/jpeg",
      fileName: `${baseName}.jpg`,
    };
  } finally {
    bitmap.close();
  }
}

function readFileAsDataUrl(file: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Could not read that image."));
    };
    reader.onerror = () => reject(new Error("Could not read that image."));
    reader.readAsDataURL(file);
  });
}
