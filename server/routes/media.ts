import { Hono } from "hono";
import { getDb } from "../../src/db/client";
import { requireAuth, type AuthVariables } from "../lib/auth";
import { env } from "../lib/env";
import {
  isAllowedImageMime,
  MAX_UPLOAD_BYTES,
  uploadImageToHygraph,
} from "../lib/hygraph";
import { upsertHygraphMedia } from "../lib/media";
import { consumeRateLimit } from "../lib/rate-limit";
import { clientIp } from "../lib/request";

export const mediaRoutes = new Hono<{ Variables: AuthVariables }>();

mediaRoutes.use("*", requireAuth);

mediaRoutes.post("/upload", async (c) => {
  if (!env.hygraphEndpoint || !env.hygraphManagementToken) {
    return c.json(
      {
        ok: false,
        error:
          "Hygraph is not configured. Set HYGRAPH_ENDPOINT and HYGRAPH_MANAGEMENT_TOKEN.",
      },
      503
    );
  }

  const ip = clientIp(c);
  const limit = await consumeRateLimit(`media-upload:${ip}`);
  if (!limit.allowed) {
    c.header("Retry-After", String(limit.retryAfterSec));
    return c.json(
      { ok: false, error: "Too many uploads. Try again later." },
      429
    );
  }

  let form: FormData;
  try {
    form = await c.req.formData();
  } catch {
    return c.json({ ok: false, error: "Expected multipart form data." }, 400);
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return c.json({ ok: false, error: "Missing file field." }, 400);
  }

  const mimeType = (file.type || "").toLowerCase();
  if (!isAllowedImageMime(mimeType)) {
    return c.json(
      {
        ok: false,
        error: "Only PNG, JPEG, WebP, GIF, and SVG images are allowed.",
      },
      400
    );
  }

  if (file.size <= 0 || file.size > MAX_UPLOAD_BYTES) {
    return c.json({ ok: false, error: "File must be between 1 byte and 5MB." }, 400);
  }

  const altText = String(form.get("altText") ?? "").trim().slice(0, 500);
  const fileName = (file.name || "upload").slice(0, 200);
  const bytes = await file.arrayBuffer();

  try {
    const uploaded = await uploadImageToHygraph({
      fileName,
      mimeType,
      bytes,
    });

    const db = getDb();
    const media = await upsertHygraphMedia(db, {
      url: uploaded.url,
      assetId: uploaded.assetId,
      altText: altText || fileName,
      mimeType: uploaded.mimeType || mimeType,
      fileName: uploaded.fileName || fileName,
    });

    if (!media) {
      return c.json({ ok: false, error: "Failed to save media reference." }, 500);
    }

    return c.json(
      {
        ok: true,
        media: {
          id: media.id,
          provider: media.provider,
          assetId: media.assetId,
          url: media.url,
          altText: media.altText,
          mimeType: media.mimeType,
          fileName: media.fileName,
        },
      },
      201
    );
  } catch (error) {
    console.error("[media/upload]", error);
    return c.json(
      {
        ok: false,
        error:
          error instanceof Error && /Hygraph|image|File|Unsupported/i.test(error.message)
            ? error.message
            : "Upload failed",
      },
      502
    );
  }
});
