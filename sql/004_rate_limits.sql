-- Sliding-window style counters for auth endpoints (IP + route key).
-- Survives serverless cold starts better than in-memory maps.

CREATE TABLE IF NOT EXISTS auth_rate_limits (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_key    TEXT NOT NULL,
  hit_count     INTEGER NOT NULL DEFAULT 1,
  window_start  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (bucket_key)
);

CREATE INDEX IF NOT EXISTS auth_rate_limits_window_start_idx
  ON auth_rate_limits (window_start);

COMMENT ON TABLE auth_rate_limits IS 'DB-backed rate limiting for login/register APIs.';
