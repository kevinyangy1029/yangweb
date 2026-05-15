"use client";

import { useEffect, useState } from "react";
import { ToolItem, SECTIONS } from "@/lib/types";
import ToolCard from "@/components/ToolCard";

export default function Home() {
  const [items, setItems] = useState<ToolItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/items")
      .then((res) => res.json() as Promise<ToolItem[]>)
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 text-center text-[var(--muted)]">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <section className="mb-12">
        <h1 className="text-3xl font-bold mb-2">YangWeb</h1>
        <p className="text-[var(--muted)]">Personal hub & tool portal</p>
      </section>

      {SECTIONS.map((section) => {
        const sectionItems = items.filter((i) => i.section === section.key);
        if (sectionItems.length === 0) return null;
        return (
          <section key={section.key} className="mb-10">
            <h2 className="text-lg font-semibold mb-1">{section.title}</h2>
            <p className="text-sm text-[var(--muted)] mb-4">{section.subtitle}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {sectionItems.map((item) => (
                <ToolCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
