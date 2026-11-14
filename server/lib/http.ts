import type { Context } from "hono";
import type { ZodTypeAny } from "zod";

export async function readJsonBody(c: Context): Promise<
  { ok: true; body: unknown } | { ok: false; response: Response }
> {
  try {
    return { ok: true, body: await c.req.json() };
  } catch {
    return {
      ok: false,
      response: c.json({ ok: false, error: "Invalid request body." }, 400),
    };
  }
}

export function parseBody<T extends ZodTypeAny>(
  c: Context,
  schema: T,
  body: unknown
):
  | { ok: true; data: T["_output"] }
  | { ok: false; response: Response } {
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return {
      ok: false,
      response: c.json(
        {
          ok: false,
          error: parsed.error.issues[0]?.message || "Invalid data",
        },
        400
      ),
    };
  }
  return { ok: true, data: parsed.data };
}

export function uniqueOrFail(error: unknown, uniqueMessage: string, fallback: string) {
  return error instanceof Error && /unique/i.test(error.message)
    ? uniqueMessage
    : fallback;
}
