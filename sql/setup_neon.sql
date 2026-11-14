-- Paste this entire script into Neon Console → SQL Editor → Run.
-- Creates extensions + admin auth tables for the portfolio admin section.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS admins (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT NOT NULL,
  email_normalized TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  display_name  TEXT NOT NULL DEFAULT '',
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  failed_login_count INTEGER NOT NULL DEFAULT 0,
  locked_until  TIMESTAMPTZ,
  last_login_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS admins_email_normalized_idx
  ON admins (email_normalized);

CREATE TABLE IF NOT EXISTS admin_sessions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id      UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  token_hash    TEXT NOT NULL UNIQUE,
  user_agent    TEXT,
  ip_address    TEXT,
  expires_at    TIMESTAMPTZ NOT NULL,
  revoked_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS admin_sessions_admin_id_idx
  ON admin_sessions (admin_id);

CREATE INDEX IF NOT EXISTS admin_sessions_expires_at_idx
  ON admin_sessions (expires_at);

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

CREATE TABLE IF NOT EXISTS login_attempts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_attempted TEXT,
  ip_address    TEXT,
  user_agent    TEXT,
  success       BOOLEAN NOT NULL DEFAULT FALSE,
  failure_reason TEXT,
  honeypot_triggered BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS login_attempts_created_at_idx
  ON login_attempts (created_at DESC);

CREATE INDEX IF NOT EXISTS login_attempts_ip_idx
  ON login_attempts (ip_address);

-- Shared media (Hygraph). Content tables link here instead of storing URLs.
CREATE TABLE IF NOT EXISTS media_assets (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider    TEXT NOT NULL DEFAULT 'HYGRAPH',
  asset_id    TEXT NOT NULL,
  url         TEXT NOT NULL,
  alt_text    TEXT NOT NULL DEFAULT '',
  mime_type   TEXT,
  file_name   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (provider, asset_id)
);

CREATE INDEX IF NOT EXISTS media_assets_provider_idx
  ON media_assets (provider);

CREATE INDEX IF NOT EXISTS media_assets_created_at_idx
  ON media_assets (created_at DESC);

-- Tools (isolated from admin auth — FK only to media_assets)
CREATE TABLE IF NOT EXISTS tools (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  media_asset_id  UUID REFERENCES media_assets (id) ON DELETE SET NULL,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS tools_sort_order_idx
  ON tools (sort_order ASC, name ASC);

CREATE INDEX IF NOT EXISTS tools_active_idx
  ON tools (is_active, sort_order)
  WHERE is_active = TRUE;

CREATE INDEX IF NOT EXISTS tools_media_asset_id_idx
  ON tools (media_asset_id);

INSERT INTO tools (name, slug, sort_order) VALUES
  ('JavaScript', 'javascript', 10),
  ('TypeScript', 'typescript', 20),
  ('Python', 'python', 30),
  ('Java', 'java', 40),
  ('Angular', 'angular', 50),
  ('Next.js', 'nextjs', 60),
  ('React', 'react', 70),
  ('HTML5', 'html5', 80),
  ('CSS3', 'css3', 90),
  ('SASS', 'sass', 100),
  ('Tailwind CSS', 'tailwindcss', 110),
  ('Bootstrap', 'bootstrap', 120),
  ('Node.js', 'nodejs', 130),
  ('Express.js', 'express', 140),
  ('GraphQL', 'graphql', 150),
  ('Spring Boot', 'springboot', 160),
  ('PostgreSQL', 'postgresql', 170),
  ('MySQL', 'mysql', 180),
  ('MongoDB', 'mongodb', 190),
  ('AWS QuickSight', 'aws-quicksight', 200),
  ('GitHub', 'github', 210),
  ('Git', 'git', 220),
  ('OpenAI', 'openai', 230),
  ('Hygraph', 'hygraph', 240),
  ('JIRA', 'jira', 250),
  ('Cursor', 'cursor', 260)
ON CONFLICT (slug) DO NOTHING;
