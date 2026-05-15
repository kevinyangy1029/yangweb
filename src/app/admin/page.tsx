"use client";

import { useEffect, useState } from "react";
import { ToolItem, SECTIONS } from "@/lib/types";

const emptyItem: Omit<ToolItem, "id"> = {
  title: "",
  description: "",
  url: "",
  section: "projects",
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [items, setItems] = useState<ToolItem[]>([]);
  const [editing, setEditing] = useState<ToolItem | null>(null);
  const [form, setForm] = useState(emptyItem);
  const [error, setError] = useState("");

  const storedPw = () =>
    typeof window !== "undefined" ? localStorage.getItem("admin_pw") || "" : "";

  useEffect(() => {
    const pw = storedPw();
    if (pw) {
      setPassword(pw);
      tryAuth(pw);
    }
  }, []);

  async function tryAuth(pw: string) {
    const res = await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-password": pw },
      body: JSON.stringify({ title: "__auth_test__", description: "", url: "", section: "projects" }),
    });
    if (res.ok) {
      const created = await res.json() as { id: string };
      await fetch("/api/items", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "x-admin-password": pw },
        body: JSON.stringify({ id: created.id }),
      });
      setAuthed(true);
      localStorage.setItem("admin_pw", pw);
      loadItems();
    } else {
      setError("Wrong password");
      localStorage.removeItem("admin_pw");
    }
  }

  async function loadItems() {
    const res = await fetch("/api/items");
    setItems(await res.json() as ToolItem[]);
  }

  function headers() {
    return {
      "Content-Type": "application/json",
      "x-admin-password": password || storedPw(),
    };
  }

  async function handleSave() {
    if (!form.title || !form.url) return;
    if (editing) {
      await fetch("/api/items", {
        method: "PUT",
        headers: headers(),
        body: JSON.stringify({ id: editing.id, ...form }),
      });
    } else {
      await fetch("/api/items", {
        method: "POST",
        headers: headers(),
        body: JSON.stringify(form),
      });
    }
    setForm(emptyItem);
    setEditing(null);
    loadItems();
  }

  async function handleDelete(id: string) {
    await fetch("/api/items", {
      method: "DELETE",
      headers: headers(),
      body: JSON.stringify({ id }),
    });
    loadItems();
  }

  function startEdit(item: ToolItem) {
    setEditing(item);
    setForm({ title: item.title, description: item.description, url: item.url, section: item.section });
  }

  if (!authed) {
    return (
      <div className="max-w-md mx-auto px-6 py-20">
        <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(""); }}
          onKeyDown={(e) => e.key === "Enter" && tryAuth(password)}
          className="w-full px-4 py-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)]"
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <button
          onClick={() => tryAuth(password)}
          className="mt-4 w-full px-4 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-lg transition-colors"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Manage Items</h1>

      <div className="border border-[var(--card-border)] bg-[var(--card-bg)] rounded-lg p-4 mb-8">
        <h2 className="font-medium mb-4">{editing ? "Edit Item" : "Add Item"}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="px-3 py-2 bg-[var(--background)] border border-[var(--card-border)] rounded text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)]"
          />
          <input
            placeholder="URL"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            className="px-3 py-2 bg-[var(--background)] border border-[var(--card-border)] rounded text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)]"
          />
          <input
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="px-3 py-2 bg-[var(--background)] border border-[var(--card-border)] rounded text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] sm:col-span-2"
          />
          <select
            value={form.section}
            onChange={(e) => setForm({ ...form, section: e.target.value as ToolItem["section"] })}
            className="px-3 py-2 bg-[var(--background)] border border-[var(--card-border)] rounded text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]"
          >
            {SECTIONS.map((s) => (
              <option key={s.key} value={s.key}>{s.title}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded text-sm transition-colors"
            >
              {editing ? "Update" : "Add"}
            </button>
            {editing && (
              <button
                onClick={() => { setEditing(null); setForm(emptyItem); }}
                className="px-4 py-2 border border-[var(--card-border)] rounded text-sm hover:bg-[var(--card-bg)] transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {SECTIONS.map((section) => {
        const sectionItems = items.filter((i) => i.section === section.key);
        if (sectionItems.length === 0) return null;
        return (
          <div key={section.key} className="mb-6">
            <h3 className="text-sm font-medium text-[var(--muted)] mb-2">{section.title}</h3>
            <div className="space-y-2">
              {sectionItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border border-[var(--card-border)] bg-[var(--card-bg)] rounded-lg px-4 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{item.title}</p>
                    <p className="text-xs text-[var(--muted)] truncate">{item.url}</p>
                  </div>
                  <div className="flex gap-2 ml-4 shrink-0">
                    <button
                      onClick={() => startEdit(item)}
                      className="text-xs px-3 py-1 border border-[var(--card-border)] rounded hover:bg-[var(--card-border)] transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-xs px-3 py-1 border border-red-800 text-red-400 rounded hover:bg-red-900/30 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
