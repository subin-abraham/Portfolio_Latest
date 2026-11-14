import { useEffect, useState, type FormEvent } from "react";
import {
  fetchAdminProfile,
  updateAdminProfile,
  uploadMedia,
  type ProfileRecord,
} from "../lib/api";

const ProfileManager = () => {
  const [profile, setProfile] = useState<ProfileRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    displayName: "",
    tagline: "",
    bio: "",
    servicesBlurb: "",
    aboutTag: "",
    aboutTitleStrong: "",
    aboutTitleMuted: "",
    email: "",
    location: "",
    githubUrl: "",
    linkedinUrl: "",
    twitterUrl: "",
    websiteUrl: "",
    mediaAssetIdRef: "" as string | null,
    mediaUrl: "",
  });

  async function load() {
    setLoading(true);
    setError("");
    const res = await fetchAdminProfile();
    if (res.ok === false) {
      setError(res.error);
      setLoading(false);
      return;
    }
    const p = res.data.profile;
    setProfile(p);
    setForm({
      displayName: p.displayName,
      tagline: p.tagline,
      bio: p.bio,
      servicesBlurb: p.servicesBlurb,
      aboutTag: p.aboutTag ?? "",
      aboutTitleStrong: p.aboutTitleStrong ?? "",
      aboutTitleMuted: p.aboutTitleMuted ?? "",
      email: p.email ?? "",
      location: p.location ?? "",
      githubUrl: p.githubUrl ?? "",
      linkedinUrl: p.linkedinUrl ?? "",
      twitterUrl: p.twitterUrl ?? "",
      websiteUrl: p.websiteUrl ?? "",
      mediaAssetIdRef: p.portraitMediaAssetId,
      mediaUrl: p.portrait?.url ?? "",
    });
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function onFileSelected(file: File | null) {
    if (!file) return;
    setUploading(true);
    setError("");
    const res = await uploadMedia(file, form.displayName || "Portrait");
    setUploading(false);
    if (res.ok === false) {
      setError(res.error);
      return;
    }
    setForm((prev) => ({
      ...prev,
      mediaAssetIdRef: res.data.media.id,
      mediaUrl: res.data.media.url,
    }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await updateAdminProfile({
      displayName: form.displayName.trim(),
      tagline: form.tagline.trim(),
      bio: form.bio.trim(),
      servicesBlurb: form.servicesBlurb.trim(),
      aboutTag: form.aboutTag.trim(),
      aboutTitleStrong: form.aboutTitleStrong.trim(),
      aboutTitleMuted: form.aboutTitleMuted.trim(),
      email: form.email.trim() || null,
      location: form.location.trim() || null,
      githubUrl: form.githubUrl.trim() || null,
      linkedinUrl: form.linkedinUrl.trim() || null,
      twitterUrl: form.twitterUrl.trim() || null,
      websiteUrl: form.websiteUrl.trim() || null,
      mediaAssetIdRef: form.mediaAssetIdRef || null,
      clearPortrait: !form.mediaAssetIdRef && !form.mediaUrl,
    });
    setSaving(false);
    if (res.ok === false) {
      setError(res.error);
      return;
    }
    setProfile(res.data.profile);
  }

  if (loading) {
    return <p className="admin-muted">Loading profile…</p>;
  }

  const busy = saving || uploading;

  return (
    <div className="admin-tools">
      <div className="admin-tools-head">
        <div>
          <p className="admin-eyebrow">Site</p>
          <h2 className="admin-tools-title">Profile</h2>
          <p className="admin-tools-lede">
            Hero, About section copy, services blurb, and portrait. Public
            homepage reads this from Neon.
          </p>
        </div>
      </div>

      <form className="admin-form admin-tools-form" onSubmit={onSubmit}>
        <label className="admin-field">
          <span>Display name</span>
          <input
            value={form.displayName}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, displayName: e.target.value }))
            }
            required
            disabled={busy}
          />
        </label>
        <label className="admin-field">
          <span>Tagline (hero)</span>
          <textarea
            value={form.tagline}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, tagline: e.target.value }))
            }
            rows={3}
            disabled={busy}
          />
        </label>

        <p className="admin-eyebrow" style={{ marginTop: "0.5rem" }}>
          About section
        </p>
        <label className="admin-field">
          <span>About tag</span>
          <input
            value={form.aboutTag}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, aboutTag: e.target.value }))
            }
            placeholder="Better digital products."
            disabled={busy}
          />
        </label>
        <label className="admin-field">
          <span>About title (strong / black)</span>
          <textarea
            value={form.aboutTitleStrong}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, aboutTitleStrong: e.target.value }))
            }
            rows={3}
            placeholder={"My impact\nthrough"}
            disabled={busy}
          />
          <em className="admin-hint">One line per visual row. Use Enter for line breaks.</em>
        </label>
        <label className="admin-field">
          <span>About title (muted / gray)</span>
          <textarea
            value={form.aboutTitleMuted}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, aboutTitleMuted: e.target.value }))
            }
            rows={3}
            placeholder={"full-\nstack\nengineering"}
            disabled={busy}
          />
        </label>
        <label className="admin-field">
          <span>Bio (About intro)</span>
          <textarea
            value={form.bio}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, bio: e.target.value }))
            }
            rows={5}
            disabled={busy}
          />
        </label>

        <label className="admin-field">
          <span>Services blurb</span>
          <textarea
            value={form.servicesBlurb}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, servicesBlurb: e.target.value }))
            }
            rows={4}
            disabled={busy}
          />
        </label>
        <label className="admin-field">
          <span>Email</span>
          <input
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, email: e.target.value }))
            }
            disabled={busy}
          />
        </label>
        <label className="admin-field">
          <span>Location</span>
          <input
            value={form.location}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, location: e.target.value }))
            }
            disabled={busy}
          />
        </label>
        <label className="admin-field">
          <span>GitHub URL</span>
          <input
            type="url"
            value={form.githubUrl}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, githubUrl: e.target.value }))
            }
            disabled={busy}
          />
        </label>
        <label className="admin-field">
          <span>LinkedIn URL</span>
          <input
            type="url"
            value={form.linkedinUrl}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, linkedinUrl: e.target.value }))
            }
            disabled={busy}
          />
        </label>
        <label className="admin-field">
          <span>Portrait upload</span>
          <input
            type="file"
            accept="image/*"
            disabled={busy}
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              e.target.value = "";
              void onFileSelected(file);
            }}
          />
          {form.mediaUrl || profile?.portrait?.url ? (
            <em className="admin-hint">
              Current: {form.mediaUrl || profile?.portrait?.url}
            </em>
          ) : (
            <em className="admin-hint">Falls back to static hero image if empty</em>
          )}
        </label>

        {error ? <p className="admin-error">{error}</p> : null}
        <button className="admin-submit" type="submit" disabled={busy}>
          {saving ? "Saving…" : "Save profile"}
        </button>
      </form>
    </div>
  );
};

export default ProfileManager;
