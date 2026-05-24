import { Metadata } from "next";
import { notFound } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import CaseStudyClient from "@/components/portfolio/CaseStudyClient";
import { createClient } from "@/lib/supabase/server";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = await createClient();
  const { data: item } = await supabase
    .from("portfolio_items")
    .select("title, description")
    .eq("slug", params.slug)
    .single();

  if (!item) return { title: "Project Not Found" };
  return {
    title: item.title,
    description: item.description || undefined,
  };
}

const DEMO_PROJECT = {
  id: "demo-1",
  title: "NOCTURNE — Album Campaign",
  slug: "nocturne",
  category: { id: "album", name: "Album Artwork", slug: "album-artwork" },
  description: "Full visual identity system for a dark ambient album release.",
  full_description: `NOCTURNE was a commission for a solo artist releasing their debut ambient album under VOID Records. The brief asked for a visual system that could carry the weight of the record — slow, heavy, and cinematic — across all touchpoints from streaming platforms to physical vinyl artwork.\n\nWe started with the idea of erosion: what happens to surfaces when time, pressure, and atmosphere work on them. This became the conceptual anchor for every decision — typography that appears worn and revealed rather than designed, imagery that feels archival and incomplete, movement that breathes rather than animates.`,
  cover_image_url: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=1400&q=95",
  cover_video_url: null,
  gallery_urls: [
    "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=1200&q=90",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=90",
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=90",
    "https://images.unsplash.com/photo-1493210977872-fdd8c4ff0fc6?w=1200&q=90",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=90",
    "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1200&q=90",
  ],
  storyboard_urls: [],
  client: "VOID Records",
  year: 2024,
  tags: ["motion", "print", "album", "campaign"],
  tools_used: ["Adobe Photoshop", "After Effects", "Cinema 4D", "Illustrator"],
  color_palette: ["#0a0a0a", "#c8ff00", "#1a1a1a", "#e8e6e1"],
  brief_summary: "Create a complete visual system for a debut ambient album that feels archival, cinematic, and worn — capable of scaling from streaming artwork to 12\" vinyl.",
  design_process: "We began with texture exploration — scanning aged papers, concrete surfaces, and photographic negatives. These became the raw material for a visual language that felt earned rather than designed.",
  deliverables: [
    "12\" vinyl cover — front + back",
    "Digital streaming artwork (all sizes)",
    "Motion poster — 15s loop (MP4 + GIF)",
    "Animated social suite — 9x16 + 1x1",
    "Press kit imagery (6 pieces)",
    "Typography guidelines",
  ],
  behind_the_scenes: "The motion poster was built frame by frame in After Effects — no templates, no plugins. Each grain particle was placed intentionally. The total render time for the final output was 11 hours.",
  is_featured: true,
  is_published: true,
  aspect_ratio: "1:1",
  format: "print + digital",
  sort_order: 1,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  preview_gif_url: null,
  video_urls: [],
  category_id: "album",
};

export default async function PortfolioSlugPage({ params }: PageProps) {
  const supabase = await createClient();

  const { data: item } = await supabase
    .from("portfolio_items")
    .select("*, category:portfolio_categories(*)")
    .eq("slug", params.slug)
    .eq("is_published", true)
    .single();

  const projectItem = item || (params.slug === "nocturne" ? DEMO_PROJECT : null);
  if (!projectItem) notFound();

  return (
    <MainLayout>
      <CaseStudyClient item={projectItem} />
    </MainLayout>
  );
}
