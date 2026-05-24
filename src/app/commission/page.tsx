import { Metadata } from "next";
import MainLayout from "@/components/layout/MainLayout";
import CommissionPageClient from "@/components/commission/CommissionPageClient";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Commission a Project",
  description: "Start a commission — poster design, motion posters, key visuals, campaign graphics, and more. Premium editorial commission portal.",
};

export default async function CommissionPage() {
  const supabase = await createClient();

  const { data: packages } = await supabase
    .from("packages")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  return (
    <MainLayout>
      <CommissionPageClient packages={packages || []} />
    </MainLayout>
  );
}
