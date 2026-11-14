import { serve } from "@hono/node-server";
import app from "./app";
import { env } from "./lib/env";

const port = env.apiPort;
console.log(`Admin API listening on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
