export interface ToolItem {
  id: string;
  title: string;
  description: string;
  url: string;
  section: "projects" | "tools" | "links";
  icon?: string;
}

export interface SectionConfig {
  key: ToolItem["section"];
  title: string;
  subtitle: string;
}

export const SECTIONS: SectionConfig[] = [
  { key: "projects", title: "My Projects", subtitle: "Open source projects on GitHub" },
  { key: "tools", title: "Online Tools", subtitle: "Built-in tools you can use right away" },
  { key: "links", title: "Useful Links", subtitle: "Curated external resources" },
];
