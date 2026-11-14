import { sql } from "drizzle-orm";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { getDb } from "../src/db/client";
import { env } from "./lib/env";
import { aboutStatsRoutes } from "./routes/about-stats";
import { authRoutes } from "./routes/auth";
import { blogsRoutes } from "./routes/blogs";
import { categoriesRoutes } from "./routes/categories";
import { educationRoutes } from "./routes/education";
import { experiencesRoutes } from "./routes/experiences";
import { mediaRoutes } from "./routes/media";
import { portfolioRoutes } from "./routes/portfolio";
import { profileRoutes } from "./routes/profile";
import { projectsRoutes } from "./routes/projects";
import { skillsRoutes } from "./routes/skills";
import { testimonialsRoutes } from "./routes/testimonials";
import { toolsRoutes } from "./routes/tools";

const app = new Hono();

app.use(
  "*",
  secureHeaders({
    xFrameOptions: "DENY",
    xContentTypeOptions: "nosniff",
    referrerPolicy: "no-referrer",
  })
);

app.use(
  "*",
  cors({
    origin: env.appOrigin,
    credentials: true,
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    maxAge: 600,
  })
);

app.get("/api/health", (c) =>
  c.json({
    ok: true,
    service: "portfolio-admin-api",
    env: env.nodeEnv,
    neon: {
      branch: env.neonBranch,
      branchId: env.neonBranchId,
      authBaseUrl: env.neonAuthBaseUrl,
    },
  })
);

/** Proves pooled Postgres connectivity end-to-end. */
app.get("/api/db/ping", async (c) => {
  try {
    const db = getDb();
    const rows = await db.execute(
      sql`select current_database() as database, current_user as db_user, now() as ts`
    );
    return c.json({
      ok: true,
      driver: "@neondatabase/serverless + drizzle-orm/neon-http",
      connection: "pooled DATABASE_URL",
      result: rows,
    });
  } catch (error) {
    console.error("[db/ping]", error);
    return c.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Database ping failed",
      },
      500
    );
  }
});

/** Optional JWKS reachability check for Neon Auth. */
app.get("/api/auth/jwks", async (c) => {
  try {
    const res = await fetch(env.neonAuthJwksUrl);
    if (!res.ok) {
      return c.json({ ok: false, status: res.status }, 502);
    }
    const body = (await res.json()) as { keys?: unknown[] };
    return c.json({
      ok: true,
      jwksUrl: env.neonAuthJwksUrl,
      keyCount: Array.isArray(body.keys) ? body.keys.length : 0,
    });
  } catch (error) {
    return c.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "JWKS fetch failed",
      },
      500
    );
  }
});

app.route("/api/auth", authRoutes);
app.route("/api/portfolio", portfolioRoutes);
app.route("/api/profile", profileRoutes);
app.route("/api/about-stats", aboutStatsRoutes);
app.route("/api/projects", projectsRoutes);
app.route("/api/skills", skillsRoutes);
app.route("/api/categories", categoriesRoutes);
app.route("/api/tools", toolsRoutes);
app.route("/api/experience", experiencesRoutes);
app.route("/api/education", educationRoutes);
app.route("/api/blogs", blogsRoutes);
app.route("/api/testimonials", testimonialsRoutes);
app.route("/api/media", mediaRoutes);

app.notFound((c) => c.json({ ok: false, error: "Not found" }, 404));

app.onError((err, c) => {
  console.error("[api]", err);
  return c.json({ ok: false, error: "Internal server error" }, 500);
});

export default app;
