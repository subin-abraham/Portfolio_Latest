import { useEffect, useState, type FormEvent } from "react";
import {
  createTool,
  deleteTool,
  fetchAdminTools,
  updateTool,
  uploadMedia,
  type ToolRecord,
} from "../lib/api";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const emptyForm = {
  name: "",
  slug: "",
  mediaUrl: "",
  mediaAssetId: "",
  mediaAssetIdRef: "" as string | null,
  mediaAltText: "",
  mediaMimeType: "",
  sortOrder: "0",
  isActive: true,
};

const ToolsManager = () => {
  const [tools, setTools] = useState<ToolRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  async function loadTools() {
    setLoading(true);
    setError("");
    const res = await fetchAdminTools();
    if (res.ok === false) {
      setError(res.error);
      setTools([]);
      setLoading(false);
      return;
    }
    setTools(res.data.tools);
    setLoading(false);
  }

  useEffect(() => {
    void loadTools();
  }, []);

  function startCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  }

  function startEdit(tool: ToolRecord) {
    setEditingId(tool.id);
    setForm({
      name: tool.name,
      slug: tool.slug,
      mediaUrl: tool.media?.url ?? "",
      mediaAssetId: tool.media?.assetId ?? "",
      mediaAssetIdRef: tool.mediaAssetId,
      mediaAltText: tool.media?.altText ?? "",
      mediaMimeType: tool.media?.mimeType ?? "",
      sortOrder: String(tool.sortOrder),
      isActive: tool.isActive,
    });
    setError("");
  }

  async function onFileSelected(file: File | null) {
    if (!file) return;
    setUploading(true);
    setError("");
    const res = await uploadMedia(file, form.mediaAltText || form.name);
    setUploading(false);
    if (res.ok === false) {
      setError(res.error);
      return;
    }
    const media = res.data.media;
    setForm((prev) => ({
      ...prev,
      mediaUrl: media.url,
      mediaAssetId: media.assetId,
      mediaAssetIdRef: media.id,
      mediaMimeType: media.mimeType ?? prev.mediaMimeType,
      mediaAltText: media.altText || prev.mediaAltText || prev.name,
    }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const mediaUrl = form.mediaUrl.trim();
    const hadMedia =
      editingId &&
      tools.find((t) => t.id === editingId)?.mediaAssetId != null;

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || slugify(form.name),
      sortOrder: Number.parseInt(form.sortOrder, 10) || 0,
      isActive: form.isActive,
      mediaUrl: form.mediaAssetIdRef ? null : mediaUrl || null,
      mediaAssetId: form.mediaAssetIdRef
        ? null
        : form.mediaAssetId.trim() || null,
      mediaAssetIdRef: form.mediaAssetIdRef || null,
      mediaAltText: form.mediaAltText.trim() || null,
      mediaMimeType: form.mediaMimeType.trim() || null,
      clearMedia: Boolean(editingId && hadMedia && !mediaUrl && !form.mediaAssetIdRef),
    };

    const res = editingId
      ? await updateTool(editingId, payload)
      : await createTool(payload);

    setSaving(false);

    if (res.ok === false) {
      setError(res.error);
      return;
    }

    startCreate();
    await loadTools();
  }

  async function onDelete(id: string) {
    if (!window.confirm("Delete this tool?")) return;
    setError("");
    const res = await deleteTool(id);
    if (res.ok === false) {
      setError(res.error);
      return;
    }
    if (editingId === id) startCreate();
    await loadTools();
  }

  const busy = saving || uploading;

  return (
    <div className="admin-tools">
      <div className="admin-tools-head">
        <div>
          <p className="admin-eyebrow">Home</p>
          <h2 className="admin-tools-title">Tools</h2>
          <p className="admin-tools-lede">
            Upload an icon through the server (Hygraph +{" "}
            <code>media_assets</code>), or paste an existing Hygraph public URL.
            Tokens never leave the server. Without media, the name still shows
            on the home strip.
          </p>
        </div>
        {editingId ? (
          <button
            type="button"
            className="admin-submit admin-submit--ghost admin-submit--compact"
            onClick={startCreate}
          >
            New tool
          </button>
        ) : null}
      </div>

      <form className="admin-form admin-tools-form" onSubmit={onSubmit}>
        <label className="admin-field">
          <span>Name</span>
          <input
            value={form.name}
            onChange={(e) => {
              const name = e.target.value;
              setForm((prev) => ({
                ...prev,
                name,
                slug:
                  !editingId && (!prev.slug || prev.slug === slugify(prev.name))
                    ? slugify(name)
                    : prev.slug,
                mediaAltText:
                  !prev.mediaAltText || prev.mediaAltText === prev.name
                    ? name
                    : prev.mediaAltText,
              }));
            }}
            required
            maxLength={120}
            disabled={busy}
          />
        </label>

        <label className="admin-field">
          <span>Slug</span>
          <input
            value={form.slug}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, slug: slugify(e.target.value) }))
            }
            required
            maxLength={80}
            disabled={busy}
          />
        </label>

        <label className="admin-field">
          <span>Upload icon</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
            disabled={busy}
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              e.target.value = "";
              void onFileSelected(file);
            }}
          />
          <em className="admin-hint">
            {uploading
              ? "Uploading to Hygraph…"
              : "PNG, JPEG, WebP, GIF, or SVG · max 5MB"}
          </em>
        </label>

        <label className="admin-field">
          <span>Hygraph URL (optional fallback)</span>
          <input
            type="url"
            value={form.mediaUrl}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                mediaUrl: e.target.value,
                mediaAssetIdRef: null,
              }))
            }
            placeholder="Or paste an existing https://….graphassets.com/… URL"
            disabled={busy}
          />
        </label>

        <label className="admin-field">
          <span>Hygraph asset ID</span>
          <input
            value={form.mediaAssetId}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, mediaAssetId: e.target.value }))
            }
            placeholder="Filled by upload, or optional for URL paste"
            disabled={busy}
          />
        </label>

        <label className="admin-field">
          <span>Alt text</span>
          <input
            value={form.mediaAltText}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, mediaAltText: e.target.value }))
            }
            maxLength={500}
            disabled={busy}
          />
        </label>

        <label className="admin-field">
          <span>MIME type</span>
          <input
            value={form.mediaMimeType}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, mediaMimeType: e.target.value }))
            }
            placeholder="image/svg+xml"
            disabled={busy}
          />
          <em className="admin-hint">
            Clear the URL and re-save to unlink media. Provider is always
            HYGRAPH in <code>media_assets</code>.
          </em>
        </label>

        <div className="admin-tools-row">
          <label className="admin-field">
            <span>Sort order</span>
            <input
              type="number"
              min={0}
              value={form.sortOrder}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, sortOrder: e.target.value }))
              }
              disabled={busy}
            />
          </label>

          <label className="admin-check">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, isActive: e.target.checked }))
              }
              disabled={busy}
            />
            Active
          </label>
        </div>

        {error ? <p className="admin-error">{error}</p> : null}

        <button className="admin-submit" type="submit" disabled={busy}>
          {saving
            ? "Saving…"
            : editingId
              ? "Update tool"
              : "Add tool"}
        </button>
      </form>

      <div className="admin-tools-list">
        {loading ? (
          <p className="admin-muted">Loading tools…</p>
        ) : tools.length === 0 ? (
          <p className="admin-muted">No tools yet.</p>
        ) : (
          <ul>
            {tools.map((tool) => (
              <li key={tool.id} className="admin-tool-item">
                <div className="admin-tool-preview">
                  {tool.media?.url ? (
                    <img
                      src={tool.media.url}
                      alt={tool.media.altText || tool.name}
                    />
                  ) : (
                    <span className="admin-tool-missing">No media</span>
                  )}
                </div>
                <div className="admin-tool-meta">
                  <strong>{tool.name}</strong>
                  <span>{tool.slug}</span>
                  <span>
                    order {tool.sortOrder}
                    {tool.isActive ? "" : " · inactive"}
                    {tool.media
                      ? ` · ${tool.media.provider}`
                      : " · name only"}
                  </span>
                </div>
                <div className="admin-tool-actions">
                  <button type="button" onClick={() => startEdit(tool)}>
                    Edit
                  </button>
                  <button type="button" onClick={() => void onDelete(tool.id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ToolsManager;
