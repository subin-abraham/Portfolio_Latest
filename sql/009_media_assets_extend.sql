-- Phase A: extend media_assets with file_name + updated_at (non-destructive).
-- Safe to re-run.

ALTER TABLE media_assets
  ADD COLUMN IF NOT EXISTS file_name TEXT;

ALTER TABLE media_assets
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

UPDATE media_assets
SET updated_at = created_at
WHERE updated_at IS NULL;
