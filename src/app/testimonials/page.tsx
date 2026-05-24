import { Metadata } from "next";
import MainLayout from "@/components/layout/MainLayout";
import TestimonialsClient from "@/components/layout/TestimonialsClient";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Client Testimonials",
  description: "What clients say about working with Designs.Tech7.",
};

export default async function TestimonialsPage() {
  const supabase = await createClient();
  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");

  return (
    <MainLayout>
      <TestimonialsClient testimonials={testimonials || []} />
    </MainLayout>
  );
}
