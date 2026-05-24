import MainLayout from "@/components/layout/MainLayout";
import HeroSection from "@/components/home/HeroSection";
import MarqueeStrip from "@/components/home/MarqueeStrip";
import FeaturedCampaign from "@/components/home/FeaturedCampaign";
import StudioPhilosophy from "@/components/home/StudioPhilosophy";
import AnimatedGallery from "@/components/home/AnimatedGallery";
import ClientsStrip from "@/components/home/ClientsStrip";
import HomeCTA from "@/components/home/HomeCTA";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch featured portfolio items
  const { data: featuredItems } = await supabase
    .from("portfolio_items")
    .select("*, category:portfolio_categories(*)")
    .eq("is_featured", true)
    .eq("is_published", true)
    .order("sort_order")
    .limit(8);

  // Fetch testimonials
  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("sort_order")
    .limit(3);

  return (
    <MainLayout>
      {/* Fullscreen hero with video/motion poster */}
      <HeroSection />

      {/* Discipline marquee */}
      <MarqueeStrip />

      {/* Featured campaign showcase */}
      <FeaturedCampaign items={featuredItems || []} />

      {/* Studio philosophy */}
      <StudioPhilosophy />

      {/* Animated poster gallery grid */}
      <AnimatedGallery items={featuredItems || []} />

      {/* Client logos / collaborators */}
      <ClientsStrip />

      {/* CTA — commission portal */}
      <HomeCTA />
    </MainLayout>
  );
}
