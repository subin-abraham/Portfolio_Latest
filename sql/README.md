# Neon SQL scripts

Run these against your Neon project before using the admin API.

## Quick setup (recommended)

1. Open [Neon Console](https://console.neon.tech) → your project → **SQL Editor**
2. Paste and run [`setup_neon.sql`](./setup_neon.sql)

## Step-by-step

If you prefer separate files, run in order:

1. `001_extensions.sql`
2. `002_admins.sql` (legacy — retained; auth is Neon Managed Better Auth)
3. `003_sessions.sql` (legacy — retained)
4. `004_rate_limits.sql`
5. `005_login_attempts.sql`
6. `006_media_assets.sql` (shared Hygraph / image library)
7. `007_tools.sql` (home tools — FK to `media_assets` only)

### Upgrades

- If an older deploy still has `hygraph_url` on `tools`, run `008_migrate_tools_hygraph_url.sql`
- For Phase A media columns (`file_name`, `updated_at`), run `009_media_assets_extend.sql`
- For Phase B portfolio CMS tables, run `010_portfolio_cms.sql`
- For About / Impact section fields + stats, run `012_about_section.sql`
- For Experience / Education tags + resume seed, run `013_experience_education_seed.sql`
- For Technical Expertise skills seed (from resume), run `014_skills_seed.sql`

## Auth (Phase A)

Admin identity uses **Neon Managed Better Auth** (`neon_auth` schema), not the legacy `admins` / `admin_sessions` tables.

1. Bootstrap the first admin via the UI (recommended):
   - Set `ENABLE_ADMIN_REGISTRATION=true` and `VITE_ENABLE_ADMIN_REGISTRATION=true`
   - Restart API + Vite, open `/admin/register`, create the account
   - Set both flags back to `false` and restart
2. Or create via CLI:
   ```bash
   neon neon-auth user create --email you@example.com --password '<secure>'
   ```
3. Disable Neon public sign-up (blocks direct Neon Auth `/sign-up` after bootstrap):
   ```bash
   neon neon-auth config email-password update --disable-sign-up
   ```
4. Trust production origins:
   ```bash
   neon neon-auth domain add https://your-domain.com
   ```

When `ENABLE_ADMIN_REGISTRATION` is false, `POST /api/auth/register` returns 404 and `/admin/register` redirects to login. Successful registration sets `neon_auth.user.role = admin`; admin APIs reject non-admin roles.

## Env

Copy `.env.example` → `.env` and set Neon + optional Hygraph upload credentials.

Optional Drizzle Kit (after `DATABASE_URL` is set):

```bash
npm run db:push
```

## Bind Hygraph tool logos → Neon

After uploading SVGs in Hygraph Assets (file names must match tool slugs, e.g. `react.svg` → `react`):

1. Set `HYGRAPH_ENDPOINT`, `HYGRAPH_MANAGEMENT_TOKEN`, and `HYGRAPH_ASSET_STAGE` (`DRAFT` if not published yet)
2. Generate SQL:
   ```bash
   npm run db:sync-tool-media
   ```
   Writes `sql/011_seed_tool_media.sql` (media upserts + `tools.media_asset_id` updates)
3. Or generate and apply in one step (needs `DATABASE_URL`):
   ```bash
   npm run db:sync-tool-media:apply
   ```
