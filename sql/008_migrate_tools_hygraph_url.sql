-- Upgrade path: existing tools.hygraph_url → media_assets + tools.media_asset_id.
-- Safe to re-run. Skip on fresh installs that never had hygraph_url.

ALTER TABLE tools
  ADD COLUMN IF NOT EXISTS media_asset_id UUID;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'tools_media_asset_id_fkey'
  ) THEN
    ALTER TABLE tools
      ADD CONSTRAINT tools_media_asset_id_fkey
      FOREIGN KEY (media_asset_id)
      REFERENCES media_assets (id)
      ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS tools_media_asset_id_idx
  ON tools (media_asset_id);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'tools'
      AND column_name = 'hygraph_url'
  ) THEN
    INSERT INTO media_assets (provider, asset_id, url, alt_text, mime_type)
    SELECT
      'HYGRAPH',
      COALESCE(
        NULLIF(regexp_replace(t.hygraph_url, '^.*/', ''), ''),
        t.id::text
      ),
      btrim(t.hygraph_url),
      t.name,
      CASE
        WHEN t.hygraph_url ~* '\.svg(\?|$)' THEN 'image/svg+xml'
        WHEN t.hygraph_url ~* '\.png(\?|$)' THEN 'image/png'
        WHEN t.hygraph_url ~* '\.jpe?g(\?|$)' THEN 'image/jpeg'
        WHEN t.hygraph_url ~* '\.webp(\?|$)' THEN 'image/webp'
        ELSE NULL
      END
    FROM tools t
    WHERE t.hygraph_url IS NOT NULL
      AND btrim(t.hygraph_url) <> ''
      AND t.media_asset_id IS NULL
    ON CONFLICT (provider, asset_id) DO UPDATE
      SET url = EXCLUDED.url,
          alt_text = EXCLUDED.alt_text;

    UPDATE tools t
    SET media_asset_id = m.id
    FROM media_assets m
    WHERE t.hygraph_url IS NOT NULL
      AND btrim(t.hygraph_url) <> ''
      AND t.media_asset_id IS NULL
      AND m.provider = 'HYGRAPH'
      AND m.asset_id = COALESCE(
        NULLIF(regexp_replace(t.hygraph_url, '^.*/', ''), ''),
        t.id::text
      );

    ALTER TABLE tools DROP COLUMN hygraph_url;
  END IF;
END $$;
