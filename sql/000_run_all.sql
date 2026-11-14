-- Neon setup: run this entire file in the Neon SQL Editor once.
-- Order matters — extensions first, then tables.

\i 001_extensions.sql
\i 002_admins.sql
\i 003_sessions.sql
\i 004_rate_limits.sql
\i 005_login_attempts.sql
\i 006_media_assets.sql
\i 007_tools.sql

-- If upgrading a DB that still has tools.hygraph_url, also run:
-- \i 008_migrate_tools_hygraph_url.sql

-- Phase A media extensions (file_name, updated_at):
-- \i 009_media_assets_extend.sql

-- Phase B portfolio CMS:
-- \i 010_portfolio_cms.sql

-- About / Impact section fields + stats:
-- \i 012_about_section.sql

-- Experience / Education tags + resume seed:
-- \i 013_experience_education_seed.sql

-- Technical Expertise skills seed (from resume):
-- \i 014_skills_seed.sql

-- If your Neon SQL Editor does not support \i, paste and run files
-- 001 → 007 in order instead of this file.
