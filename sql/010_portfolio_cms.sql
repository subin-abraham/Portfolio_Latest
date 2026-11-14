-- Phase B: portfolio CMS tables (additive, non-destructive).
-- Safe to re-run with IF NOT EXISTS / ADD COLUMN IF NOT EXISTS.

CREATE TABLE IF NOT EXISTS profile (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name             TEXT NOT NULL DEFAULT 'Subin',
  tagline                  TEXT NOT NULL DEFAULT '',
  bio                      TEXT NOT NULL DEFAULT '',
  services_blurb           TEXT NOT NULL DEFAULT '',
  email                    TEXT,
  location                 TEXT,
  github_url               TEXT,
  linkedin_url             TEXT,
  twitter_url              TEXT,
  website_url              TEXT,
  portrait_media_asset_id  UUID REFERENCES media_assets (id) ON DELETE SET NULL,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS technology_categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS technology_categories_sort_idx
  ON technology_categories (sort_order ASC, name ASC);

ALTER TABLE tools
  ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES technology_categories (id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS tools_category_id_idx ON tools (category_id);

CREATE TABLE IF NOT EXISTS skills (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  category     TEXT NOT NULL DEFAULT '',
  proficiency  INTEGER NOT NULL DEFAULT 0,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS skills_sort_idx ON skills (sort_order ASC, name ASC);
CREATE INDEX IF NOT EXISTS skills_active_idx ON skills (is_active, sort_order) WHERE is_active = TRUE;

CREATE TABLE IF NOT EXISTS projects (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title                 TEXT NOT NULL,
  slug                  TEXT NOT NULL UNIQUE,
  summary               TEXT NOT NULL DEFAULT '',
  description           TEXT NOT NULL DEFAULT '',
  role                  TEXT NOT NULL DEFAULT '',
  tech_stack            TEXT NOT NULL DEFAULT '',
  project_url           TEXT,
  repo_url              TEXT,
  cover_media_asset_id  UUID REFERENCES media_assets (id) ON DELETE SET NULL,
  sort_order            INTEGER NOT NULL DEFAULT 0,
  is_published          BOOLEAN NOT NULL DEFAULT FALSE,
  featured              BOOLEAN NOT NULL DEFAULT FALSE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS projects_sort_idx ON projects (sort_order ASC, title ASC);
CREATE INDEX IF NOT EXISTS projects_published_idx
  ON projects (is_published, sort_order) WHERE is_published = TRUE;

CREATE TABLE IF NOT EXISTS project_images (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      UUID NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
  media_asset_id  UUID NOT NULL REFERENCES media_assets (id) ON DELETE CASCADE,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  caption         TEXT NOT NULL DEFAULT '',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS project_images_project_idx
  ON project_images (project_id, sort_order ASC);

CREATE TABLE IF NOT EXISTS experiences (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company     TEXT NOT NULL,
  role        TEXT NOT NULL,
  location    TEXT NOT NULL DEFAULT '',
  summary     TEXT NOT NULL DEFAULT '',
  start_date  TEXT NOT NULL DEFAULT '',
  end_date    TEXT,
  is_current  BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS experiences_sort_idx ON experiences (sort_order ASC);
CREATE INDEX IF NOT EXISTS experiences_active_idx
  ON experiences (is_active, sort_order) WHERE is_active = TRUE;

CREATE TABLE IF NOT EXISTS education (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution  TEXT NOT NULL,
  degree       TEXT NOT NULL,
  field        TEXT NOT NULL DEFAULT '',
  summary      TEXT NOT NULL DEFAULT '',
  start_date   TEXT NOT NULL DEFAULT '',
  end_date     TEXT,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS education_sort_idx ON education (sort_order ASC);
CREATE INDEX IF NOT EXISTS education_active_idx
  ON education (is_active, sort_order) WHERE is_active = TRUE;

CREATE TABLE IF NOT EXISTS blogs (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title                 TEXT NOT NULL,
  slug                  TEXT NOT NULL UNIQUE,
  excerpt               TEXT NOT NULL DEFAULT '',
  body                  TEXT NOT NULL DEFAULT '',
  cover_media_asset_id  UUID REFERENCES media_assets (id) ON DELETE SET NULL,
  published_at          TIMESTAMPTZ,
  is_published          BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order            INTEGER NOT NULL DEFAULT 0,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS blogs_sort_idx ON blogs (sort_order ASC, title ASC);
CREATE INDEX IF NOT EXISTS blogs_published_idx
  ON blogs (is_published, published_at DESC) WHERE is_published = TRUE;

CREATE TABLE IF NOT EXISTS testimonials (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote                  TEXT NOT NULL,
  author_name            TEXT NOT NULL,
  author_title           TEXT NOT NULL DEFAULT '',
  author_company         TEXT NOT NULL DEFAULT '',
  avatar_media_asset_id  UUID REFERENCES media_assets (id) ON DELETE SET NULL,
  sort_order             INTEGER NOT NULL DEFAULT 0,
  is_active              BOOLEAN NOT NULL DEFAULT TRUE,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS testimonials_sort_idx ON testimonials (sort_order ASC);
CREATE INDEX IF NOT EXISTS testimonials_active_idx
  ON testimonials (is_active, sort_order) WHERE is_active = TRUE;

-- Seed a default profile row if none exists (matches current hardcoded hero).
INSERT INTO profile (display_name, tagline, bio, services_blurb)
SELECT
  'Subin',
  'I design user-centered digital experiences that are simple smart and impactful',
  '',
  ''
WHERE NOT EXISTS (SELECT 1 FROM profile LIMIT 1);
