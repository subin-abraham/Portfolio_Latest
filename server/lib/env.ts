import "dotenv/config";
import { parseEnv } from "@neon/env";
import config from "../../neon";

const neonEnv = parseEnv(config, [
  "DATABASE_URL",
  "DATABASE_URL_UNPOOLED",
  "NEON_AUTH_BASE_URL",
  "NEON_AUTH_JWKS_URL",
  "NEON_BRANCH",
  "NEON_BRANCH_ID",
]);

function optional(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value || undefined;
}

/** Opt-in flags only — missing / unknown values are false (secure default). */
function envFlag(name: string): boolean {
  const value = process.env[name]?.trim().toLowerCase();
  return value === "1" || value === "true" || value === "yes" || value === "on";
}

export const env = {
  databaseUrl: neonEnv.postgres.databaseUrl,
  databaseUrlUnpooled: neonEnv.postgres.databaseUrlUnpooled,
  neonAuthBaseUrl: neonEnv.auth.baseUrl,
  neonAuthJwksUrl: neonEnv.auth.jwksUrl,
  neonBranch: neonEnv.branch.name,
  neonBranchId: neonEnv.branch.id,
  nodeEnv: process.env.NODE_ENV ?? "development",
  appOrigin: process.env.APP_ORIGIN ?? "http://localhost:8080",
  apiPort: Number(process.env.API_PORT ?? 8787),
  rateLimitMax: Number(process.env.AUTH_RATE_LIMIT_MAX ?? 8),
  rateLimitWindowMs: Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS ?? 900_000),
  isProd: (process.env.NODE_ENV ?? "development") === "production",
  /**
   * Bootstrap-only. When false, POST /api/auth/register returns 404 and the
   * SPA must not mount /admin/register. Default false.
   */
  enableAdminRegistration: envFlag("ENABLE_ADMIN_REGISTRATION"),
  hygraphEndpoint: optional("HYGRAPH_ENDPOINT"),
  hygraphManagementToken: optional("HYGRAPH_MANAGEMENT_TOKEN"),
  hygraphAssetStage: optional("HYGRAPH_ASSET_STAGE") ?? "PUBLISHED",
};

export function requireHygraphConfig() {
  if (!env.hygraphEndpoint || !env.hygraphManagementToken) {
    throw new Error(
      "Hygraph upload requires HYGRAPH_ENDPOINT and HYGRAPH_MANAGEMENT_TOKEN"
    );
  }
  return {
    endpoint: env.hygraphEndpoint,
    token: env.hygraphManagementToken,
    stage: env.hygraphAssetStage,
  };
}
