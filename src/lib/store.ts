import { ToolItem } from "./types";
import { seedData } from "./seed";

const KV_KEY = "items";

let memoryItems: ToolItem[] | null = null;

function getKV(): KVNamespace | null {
  try {
    const { getCloudflareContext } = require("@opennextjs/cloudflare");
    const ctx = getCloudflareContext();
    return ctx?.env?.YANGWEB_KV ?? null;
  } catch {
    return null;
  }
}

async function readItems(): Promise<ToolItem[]> {
  const kv = getKV();
  if (kv) {
    const data = await kv.get(KV_KEY, "json");
    if (!data) {
      await kv.put(KV_KEY, JSON.stringify(seedData));
      return seedData;
    }
    return data as ToolItem[];
  }
  if (!memoryItems) memoryItems = [...seedData];
  return memoryItems;
}

async function writeItems(items: ToolItem[]): Promise<void> {
  const kv = getKV();
  if (kv) {
    await kv.put(KV_KEY, JSON.stringify(items));
  } else {
    memoryItems = items;
  }
}

export async function getItems(): Promise<ToolItem[]> {
  return readItems();
}

export async function addItem(item: ToolItem): Promise<void> {
  const items = await readItems();
  items.push(item);
  await writeItems(items);
}

export async function updateItem(id: string, data: Partial<ToolItem>): Promise<boolean> {
  const items = await readItems();
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return false;
  items[index] = { ...items[index], ...data };
  await writeItems(items);
  return true;
}

export async function deleteItem(id: string): Promise<boolean> {
  const items = await readItems();
  const filtered = items.filter((item) => item.id !== id);
  if (filtered.length === items.length) return false;
  await writeItems(filtered);
  return true;
}
