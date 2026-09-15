import { NextRequest, NextResponse } from "next/server";
import { getDashboardUser } from "@/lib/dashboard/session";
import { createClient } from "@/lib/supabase/server";

function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => escape(row[h])).join(","));
  }
  return lines.join("\n");
}

export async function GET(req: NextRequest) {
  const user = await getDashboardUser();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const type = req.nextUrl.searchParams.get("type") ?? "orders";
  if (type !== "orders" && type !== "customers") {
    return NextResponse.json({ error: "type must be orders or customers" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data } = await supabase.from(type).select("*");
  const csv = toCsv(data ?? []);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${type}.csv"`,
    },
  });
}
