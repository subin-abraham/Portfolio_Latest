import type { Db } from "../../src/db/client";
import { upsertHygraphMedia } from "./media";

type MediaFields = {
  mediaUrl?: string | null;
  mediaAssetId?: string | null;
  mediaAssetIdRef?: string | null;
  mediaAltText?: string | null;
  mediaMimeType?: string | null;
  clearMedia?: boolean;
  clearCover?: boolean;
  clearPortrait?: boolean;
  clearAvatar?: boolean;
};

/** Resolve media_assets UUID from upload ref, URL paste, or clear flags. */
export async function resolveMediaAssetId(
  db: Db,
  input: MediaFields,
  altFallback: string
): Promise<string | null | undefined> {
  if (input.clearMedia || input.clearCover || input.clearPortrait || input.clearAvatar) {
    return null;
  }
  if (input.mediaAssetIdRef) return input.mediaAssetIdRef;
  if (input.mediaUrl) {
    const media = await upsertHygraphMedia(db, {
      url: input.mediaUrl,
      assetId: input.mediaAssetId,
      altText: input.mediaAltText ?? altFallback,
      mimeType: input.mediaMimeType,
    });
    return media?.id ?? null;
  }
  return undefined;
}
