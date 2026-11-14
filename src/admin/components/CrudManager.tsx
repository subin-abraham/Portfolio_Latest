import { useEffect, useState, type FormEvent } from "react";

export type FieldType = "text" | "textarea" | "number" | "checkbox" | "url";

export type FieldDef = {
  key: string;
  label: string;
  type?: FieldType;
  required?: boolean;
  slugFrom?: string;
};

type ApiResult = {
  ok: true;
  data: Record<string, unknown>;
} | {
  ok: false;
  error: string;
  status: number;
};

type ApiShape = {
  list: () => Promise<ApiResult>;
  create: (body: Record<string, unknown>) => Promise<ApiResult>;
  update: (id: string, body: Record<string, unknown>) => Promise<ApiResult>;
  remove: (id: string) => Promise<ApiResult>;
  listKey: string;
};

type Props<T extends { id: string }> = {
  title: string;
  lede: string;
  fields: FieldDef[];
  api: ApiShape;
  titleKey: keyof T & string;
  subtitleKey?: keyof T & string;
};

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function emptyValues(fields: FieldDef[]) {
  const out: Record<string, string | boolean> = {};
  for (const field of fields) {
    out[field.key] = field.type === "checkbox" ? true : field.type === "number" ? "0" : "";
  }
  return out;
}

function CrudManager<T extends { id: string }>({
  title,
  lede,
  fields,
  api,
  titleKey,
  subtitleKey,
}: Props<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyValues(fields));

  async function load() {
    setLoading(true);
    setError("");
    const res = await api.list();
    if (res.ok === false) {
      setError(res.error);
      setItems([]);
      setLoading(false);
      return;
    }
    const list = (res.data as Record<string, T[]>)[api.listKey] ?? [];
    setItems(list);
    setLoading(false);
  }

  useEffect(() => {
    void load();
    // Initial load only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startCreate() {
    setEditingId(null);
    setForm(emptyValues(fields));
    setError("");
  }

  function startEdit(item: T) {
    setEditingId(item.id);
    const next = emptyValues(fields);
    const record = item as unknown as Record<string, unknown>;
    for (const field of fields) {
      const value = record[field.key];
      if (field.type === "checkbox") {
        next[field.key] = Boolean(value);
      } else if (value == null) {
        next[field.key] = field.type === "number" ? "0" : "";
      } else {
        next[field.key] = String(value);
      }
    }
    setForm(next);
    setError("");
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const body: Record<string, unknown> = {};
    for (const field of fields) {
      const raw = form[field.key];
      if (field.type === "checkbox") {
        body[field.key] = Boolean(raw);
      } else if (field.type === "number") {
        body[field.key] = Number.parseInt(String(raw), 10) || 0;
      } else {
        const text = String(raw ?? "").trim();
        body[field.key] = text === "" ? (field.required ? text : null) : text;
        if (field.key === "slug" && !text && field.slugFrom) {
          body.slug = slugify(String(form[field.slugFrom] ?? ""));
        }
      }
    }

    const res = editingId
      ? await api.update(editingId, body)
      : await api.create(body);

    setSaving(false);
    if (res.ok === false) {
      setError(res.error);
      return;
    }
    startCreate();
    await load();
  }

  async function onDelete(id: string) {
    if (!window.confirm(`Delete this ${title.toLowerCase().replace(/s$/, "")}?`)) {
      return;
    }
    setError("");
    const res = await api.remove(id);
    if (res.ok === false) {
      setError(res.error);
      return;
    }
    if (editingId === id) startCreate();
    await load();
  }

  return (
    <div className="admin-tools">
      <div className="admin-tools-head">
        <div>
          <p className="admin-eyebrow">Content</p>
          <h2 className="admin-tools-title">{title}</h2>
          <p className="admin-tools-lede">{lede}</p>
        </div>
        {editingId ? (
          <button
            type="button"
            className="admin-submit admin-submit--ghost admin-submit--compact"
            onClick={startCreate}
          >
            New
          </button>
        ) : null}
      </div>

      <form className="admin-form admin-tools-form" onSubmit={onSubmit}>
        {fields.map((field) => {
          if (field.type === "checkbox") {
            return (
              <label key={field.key} className="admin-check">
                <input
                  type="checkbox"
                  checked={Boolean(form[field.key])}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      [field.key]: e.target.checked,
                    }))
                  }
                  disabled={saving}
                />
                {field.label}
              </label>
            );
          }

          if (field.type === "textarea") {
            return (
              <label key={field.key} className="admin-field">
                <span>{field.label}</span>
                <textarea
                  value={String(form[field.key] ?? "")}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, [field.key]: e.target.value }))
                  }
                  rows={4}
                  required={field.required}
                  disabled={saving}
                />
              </label>
            );
          }

          return (
            <label key={field.key} className="admin-field">
              <span>{field.label}</span>
              <input
                type={
                  field.type === "number"
                    ? "number"
                    : field.type === "url"
                      ? "url"
                      : "text"
                }
                value={String(form[field.key] ?? "")}
                onChange={(e) => {
                  const value = e.target.value;
                  setForm((prev) => {
                    const next = { ...prev, [field.key]: value };
                    const slugField = fields.find((f) => f.key === "slug");
                    if (
                      slugField?.slugFrom === field.key &&
                      !editingId &&
                      (!prev.slug ||
                        String(prev.slug) ===
                          slugify(String(prev[field.key] ?? "")))
                    ) {
                      next.slug = slugify(value);
                    }
                    return next;
                  });
                }}
                required={field.required}
                disabled={saving}
                min={field.type === "number" ? 0 : undefined}
              />
            </label>
          );
        })}

        {error ? <p className="admin-error">{error}</p> : null}

        <button className="admin-submit" type="submit" disabled={saving}>
          {saving ? "Saving…" : editingId ? "Update" : "Add"}
        </button>
      </form>

      <div className="admin-tools-list">
        {loading ? (
          <p className="admin-muted">Loading…</p>
        ) : items.length === 0 ? (
          <p className="admin-muted">No items yet.</p>
        ) : (
          <ul>
            {items.map((item) => (
              <li key={item.id} className="admin-tool-item admin-tool-item--text">
                <div className="admin-tool-meta">
                  <strong>{String(item[titleKey] ?? "")}</strong>
                  {subtitleKey ? (
                    <span>{String(item[subtitleKey] ?? "")}</span>
                  ) : null}
                </div>
                <div className="admin-tool-actions">
                  <button type="button" onClick={() => startEdit(item)}>
                    Edit
                  </button>
                  <button type="button" onClick={() => void onDelete(item.id)}>
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
}

export default CrudManager;
