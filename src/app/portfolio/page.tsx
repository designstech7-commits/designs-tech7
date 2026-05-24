import { Metadata } from "next";
import MainLayout from "@/components/layout/MainLayout";
import PortfolioClient from "@/components/portfolio/PortfolioClient";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Poster design, motion posters, key visuals, campaign graphics, title sequences, album artwork, and event visuals.",
};

export default async function PortfolioPage() {
  const supabase = await createClient();

  const [{ data: items }, { data: categories }] = await Promise.all([
    supabase
      .from("portfolio_items")
      .select("*, category:portfolio_categories(*)")
      .eq("is_published", true)
      .order("sort_order"),
    supabase
      .from("portfolio_categories")
      .select("*")
      .order("sort_order"),
  ]);

  return (
    <MainLayout>
      <PortfolioClient items={items || []} categories={categories || []} />
    </MainLayout>
  );
}
