import Link from "next/link";
import { ToolItem } from "@/lib/types";

const sectionIcons: Record<ToolItem["section"], string> = {
  projects: "↗",
  tools: "⚡",
  links: "🔗",
};

export default function ToolCard({ item }: { item: ToolItem }) {
  const isExternal = item.url.startsWith("http");
  const icon = sectionIcons[item.section];

  const content = (
    <div className="group border border-[var(--card-border)] bg-[var(--card-bg)] rounded-lg p-4 hover:border-[var(--accent)] transition-colors cursor-pointer">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors truncate">
            {item.title}
          </h3>
          <p className="text-sm text-[var(--muted)] mt-1 line-clamp-2">
            {item.description}
          </p>
        </div>
        <span className="text-lg shrink-0" aria-hidden>
          {icon}
        </span>
      </div>
    </div>
  );

  if (isExternal) {
    return (
      <a href={item.url} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return <Link href={item.url}>{content}</Link>;
}
