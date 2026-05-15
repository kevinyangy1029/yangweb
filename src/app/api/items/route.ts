import { NextRequest, NextResponse } from "next/server";
import { getItems, addItem, updateItem, deleteItem } from "@/lib/store";
import { ToolItem } from "@/lib/types";


const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function checkAuth(req: NextRequest): boolean {
  return req.headers.get("x-admin-password") === ADMIN_PASSWORD;
}

export async function GET() {
  const items = await getItems();
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return unauthorized();
  const body = (await req.json()) as ToolItem;
  body.id = Date.now().toString();
  await addItem(body);
  return NextResponse.json(body, { status: 201 });
}

export async function PUT(req: NextRequest) {
  if (!checkAuth(req)) return unauthorized();
  const body = (await req.json()) as ToolItem & { id: string };
  const { id, ...data } = body;
  if (!id || !(await updateItem(id, data))) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return unauthorized();
  const { id } = (await req.json()) as { id: string };
  if (!id || !(await deleteItem(id))) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
