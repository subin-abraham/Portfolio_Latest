-- Portfolio tools shown on the home strip.
-- Images via media_assets FK. No FKs to admin auth tables.

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
