import { parseEnv } from "@neon/env";
import config from "../../neon";

/**
 * Typed Neon env from neon.ts services (postgres + auth).
 * Server code should prefer this over raw process.env.
 */
export function getNeonEnv() {
  return parseEnv(config, [
    "DATABASE_URL",
    "DATABASE_URL_UNPOOLED",
    "NEON_AUTH_BASE_URL",
    "NEON_AUTH_JWKS_URL",
    "NEON_BRANCH",
    "NEON_BRANCH_ID",
  ]);
}
