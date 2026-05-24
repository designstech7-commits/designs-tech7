import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = parseInt(searchParams.get("offset") || "0");

  const supabase = await createClient();

  let query = supabase
    .from("portfolio_items")
    .select("*, category:portfolio_categories(*)", { count: "exact" })
    .eq("is_published", true)
    .order("sort_order")
    .range(offset, offset + limit - 1);

  if (category) {
    query = query.eq("category.slug", category);
  }
  if (featured === "true") {
    query = query.eq("is_featured", true);
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, count, limit, offset });
}
