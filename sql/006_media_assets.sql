-- Shared media library (Hygraph today).
-- Content tables (tools, future sections) store media_asset_id — not raw URLs.

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
