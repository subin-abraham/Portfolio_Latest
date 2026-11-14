import { and, eq, sql } from "drizzle-orm";
import type { Db } from "../../src/db/client";
import { mediaAssets } from "../../src/db/schema";

export const MEDIA_PROVIDER_HYGRAPH = "HYGRAPH";

export type MediaInput = {
  url: string;
  assetId?: string | null;
  altText?: string | null;
  mimeType?: string | null;
  fileName?: string | null;
};

function assetIdFromUrl(url: string): string {
  try {
    const path = new URL(url).pathname.replace(/\/+$/, "");
    const last = path.split("/").filter(Boolean).pop();
    if (last) return last.slice(0, 200);
  } catch {
    // fall through
  }
  return url.slice(0, 200);
}

function guessMime(url: string): string | null {
  const lower = url.toLowerCase();
  if (lower.includes(".svg")) return "image/svg+xml";
  if (lower.includes(".png")) return "image/png";
  if (lower.includes(".webp")) return "image/webp";
  if (lower.includes(".jpg") || lower.includes(".jpeg")) return "image/jpeg";
  if (lower.includes(".gif")) return "image/gif";
  return null;
}

/** Upsert a Hygraph (or future provider) asset and return its row id. */
export async function upsertHygraphMedia(db: Db, input: MediaInput) {
  const url = input.url.trim();
  if (!url) return null;

  const assetId = (input.assetId?.trim() || assetIdFromUrl(url)).slice(0, 200);
  const altText = (input.altText ?? "").trim();
  const mimeType = input.mimeType?.trim() || guessMime(url);
  const fileName = input.fileName?.trim() || null;

  const existing = await db.query.mediaAssets.findFirst({
    where: and(
      eq(mediaAssets.provider, MEDIA_PROVIDER_HYGRAPH),
      eq(mediaAssets.assetId, assetId)
    ),
  });

  if (existing) {
    const [row] = await db
      .update(mediaAssets)
      .set({
        url,
        altText,
        mimeType,
        ...(fileName ? { fileName } : {}),
        updatedAt: sql`now()`,
      })
      .where(eq(mediaAssets.id, existing.id))
      .returning();
    return row ?? existing;
  }

  const [row] = await db
    .insert(mediaAssets)
    .values({
      provider: MEDIA_PROVIDER_HYGRAPH,
      assetId,
      url,
      altText,
      mimeType,
      fileName,
    })
    .returning();

  return row ?? null;
}
