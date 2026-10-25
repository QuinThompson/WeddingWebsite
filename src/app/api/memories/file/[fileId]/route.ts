import { NextResponse } from "next/server";
import { getFromGoogleAppsScript, getGoogleAppsScriptUrl } from "@/lib/googleSheets";

export const runtime = "nodejs";

const FILE_ID_PATTERN = /^[a-zA-Z0-9_-]{10,}$/;

/**
 * Proxy guest memory images from Google Drive so the browser never hits
 * Drive hotlink restrictions (uc?export=view often fails in <img>).
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ fileId: string }> },
) {
  const { fileId: rawId } = await context.params;
  const fileId = decodeURIComponent(rawId || "").trim();

  if (!FILE_ID_PATTERN.test(fileId)) {
    return NextResponse.json({ error: "Invalid file id." }, { status: 400 });
  }

  const candidates = [
    `https://lh3.googleusercontent.com/d/${fileId}=s2000`,
    `https://drive.google.com/thumbnail?id=${fileId}&sz=w2000`,
    `https://drive.google.com/uc?export=download&id=${fileId}`,
  ];

  for (const url of candidates) {
    try {
      const upstream = await fetch(url, {
        redirect: "follow",
        headers: {
          // Some Drive endpoints are picky without a UA.
          "User-Agent": "Mozilla/5.0 (compatible; WeddingInvite/1.0)",
          Accept: "image/*,*/*",
        },
        cache: "force-cache",
      });

      if (!upstream.ok) continue;

      const contentType = upstream.headers.get("content-type") || "";
      if (!contentType.startsWith("image/")) continue;

      const bytes = await upstream.arrayBuffer();
      if (bytes.byteLength < 32) continue;

      return new NextResponse(bytes, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
        },
      });
    } catch (error) {
      console.error("[memories/file] fetch failed", url, error);
    }
  }

  const viaScript = await readMemoryFileFromScript(fileId);
  if (viaScript) return viaScript;

  return NextResponse.json(
    { error: "Could not load that memory image from Google Drive." },
    { status: 502 },
  );
}

/** Used when Google blocks public sharing on the Memories folder. */
async function readMemoryFileFromScript(fileId: string) {
  const webhookUrl = getGoogleAppsScriptUrl("memories");
  if (!webhookUrl) return null;

  const result = await getFromGoogleAppsScript<{
    ok?: boolean;
    mimeType?: string;
    base64?: string;
  }>(webhookUrl, { type: "memories-file", fileId });

  if (!result.ok || !result.data?.ok || !result.data.base64) return null;

  const bytes = Buffer.from(result.data.base64, "base64");
  if (bytes.byteLength < 32) return null;

  const contentType = result.data.mimeType?.startsWith("image/")
    ? result.data.mimeType
    : "image/jpeg";

  return new NextResponse(bytes, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
