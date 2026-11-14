-- About / Impact section: profile copy fields + editable stats cards.
-- Safe to re-run (IF NOT EXISTS / ADD COLUMN IF NOT EXISTS / seed guards).

ALTER TABLE profile
  ADD COLUMN IF NOT EXISTS about_tag TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS about_title_strong TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS about_title_muted TEXT NOT NULL DEFAULT '';

CREATE TABLE IF NOT EXISTS about_stats (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  value       TEXT NOT NULL,
  title       TEXT NOT NULL,
  detail      TEXT NOT NULL DEFAULT '',
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS about_stats_sort_idx
  ON about_stats (sort_order ASC);

CREATE INDEX IF NOT EXISTS about_stats_active_idx
  ON about_stats (is_active, sort_order)
  WHERE is_active = TRUE;

-- Backfill About copy on the existing profile row (only empty fields).
UPDATE profile
SET
  about_tag = CASE
    WHEN about_tag = '' THEN 'Better digital products.'
    ELSE about_tag
  END,
  about_title_strong = CASE
    WHEN about_title_strong = '' THEN E'My impact\nthrough'
    ELSE about_title_strong
  END,
  about_title_muted = CASE
    WHEN about_title_muted = '' THEN E'full-\nstack\nengineering'
    ELSE about_title_muted
  END,
  bio = CASE
    WHEN bio = '' THEN
      'Hi, I''m Subin, a senior full-stack engineer passionate about shipping AI-powered, scalable web applications that automate real workflows.'
    ELSE bio
  END,
  updated_at = NOW()
WHERE id IN (SELECT id FROM profile ORDER BY created_at ASC LIMIT 1);

-- Seed default stats once (idempotent by title).
INSERT INTO about_stats (value, title, detail, sort_order, is_active)
SELECT v.value, v.title, v.detail, v.sort_order, TRUE
FROM (
  VALUES
    (
      '3+',
      'Years Experience',
      'Designing and shipping scalable web apps with Angular, Node.js, and TypeScript for US-based clients.',
      0
    ),
    (
      '3',
      'AI Products Shipped',
      'Document Analyzer, AI Chatbot, and Resume Analyzer live in production — automating real business workflows.',
      1
    )
) AS v(value, title, detail, sort_order)
WHERE NOT EXISTS (
  SELECT 1 FROM about_stats s WHERE s.title = v.title
);
