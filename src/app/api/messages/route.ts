import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const commissionId = searchParams.get("commission_id");

  if (!commissionId) {
    return NextResponse.json({ error: "commission_id required" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify ownership
  const { data: commission } = await supabase
    .from("commission_requests")
    .select("id")
    .eq("id", commissionId)
    .eq("user_id", user.id)
    .single();

  if (!commission) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("messages")
    .select("*, sender:profiles(full_name, role)")
    .eq("commission_id", commissionId)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { commission_id, content } = await request.json();

  if (!commission_id || !content?.trim()) {
    return NextResponse.json({ error: "commission_id and content required" }, { status: 400 });
  }

  // Verify access
  const { data: commission } = await supabase
    .from("commission_requests")
    .select("id")
    .eq("id", commission_id)
    .eq("user_id", user.id)
    .single();

  if (!commission) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("messages")
    .insert({
      commission_id,
      sender_id: user.id,
      content: content.trim(),
    })
    .select("*, sender:profiles(full_name, role)")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
