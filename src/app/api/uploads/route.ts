import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const commissionId = formData.get("commission_id") as string;
  const assetType = (formData.get("asset_type") as string) || "other";

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Validate file size (50MB max)
  if (file.size > 50 * 1024 * 1024) {
    return NextResponse.json({ error: "File exceeds 50MB limit" }, { status: 413 });
  }

  const timestamp = Date.now();
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = commissionId
    ? `${commissionId}/${assetType}/${timestamp}_${sanitizedName}`
    : `${user.id}/uploads/${timestamp}_${sanitizedName}`;

  const bucket = commissionId ? "commission-uploads" : "avatars";

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);

  // Record in uploaded_assets if commission-linked
  if (commissionId) {
    await supabase.from("uploaded_assets").insert({
      user_id: user.id,
      commission_id: commissionId,
      file_name: file.name,
      file_size: file.size,
      mime_type: file.type,
      storage_path: path,
      public_url: urlData.publicUrl,
      asset_type: assetType,
    });
  }

  return NextResponse.json({
    url: urlData.publicUrl,
    path,
    file_name: file.name,
    file_size: file.size,
  });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { path, bucket = "commission-uploads" } = await request.json();

  if (!path) {
    return NextResponse.json({ error: "path required" }, { status: 400 });
  }

  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
