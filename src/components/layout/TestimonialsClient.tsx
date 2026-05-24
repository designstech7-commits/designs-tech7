"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import type { Testimonial } from "@/types";

const DEMO_TESTIMONIALS: Testimonial[] = [
  {
    id: "1", client_name: "Yuki Tanaka", client_role: "Creative Director", client_company: "Neon Records",
    client_avatar_url: null,
    content: "The motion poster they created for our album launch was unlike anything I had seen. The layering, the typography, the movement — every frame was intentional. It tripled our pre-save numbers.",
    rating: 5, project_type: "Album Artwork + Motion Poster", is_featured: true, is_published: true, sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "2", client_name: "Sofia Reinholt", client_role: "Brand Director", client_company: "ARCH Festival",
    client_avatar_url: null,
    content: "We needed something that could carry the weight of a 10-year anniversary. The visual system they built was monumental — cinematic, textured, alive. Our audience has never responded so emotionally.",
    rating: 5, project_type: "Event Visuals + Campaign", is_featured: true, is_published: true, sort_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "3", client_name: "Marcus Webb", client_role: "Producer", client_company: "VOID Films",
    client_avatar_url: null,
    content: "From brief to delivery, the process was immaculate. The title sequence elevated the entire project. We have extended the engagement for two more features.",
    rating: 5, project_type: "Title Sequence", is_featured: true, is_published: true, sort_order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: "4", client_name: "Amara Osei", client_role: "Marketing Lead", client_company: "Capsule Studio",
    client_avatar_url: null,
    content: "The campaign graphics were ready on time and on brand — but beyond that, they exceeded every creative brief we gave. The team genuinely cares about the work.",
    rating: 5, project_type: "Campaign Graphics", is_featured: false, is_published: true, sort_order: 4,
    created_at: new Date().toISOString(),
  },
  {
    id: "5", client_name: "Leo Hartmann", client_role: "Art Director", client_company: "Phase Films",
    client_avatar_url: null,
    content: "I have worked with many design studios over the years. None of them brought the same level of obsessive attention to craft. Every pixel, every frame — considered.",
    rating: 5, project_type: "Key Visual + Poster Series", is_featured: false, is_published: true, sort_order: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: "6", client_name: "Priya Menon", client_role: "Festival Director", client_company: "SIGNAL Music Festival",
    client_avatar_url: null,
    content: "Our festival has a reputation for strong visual identity. This collaboration strengthened it considerably. The animated social suite performed better than anything we had previously used.",
    rating: 5, project_type: "Event Visuals + Social Campaign", is_featured: false, is_published: true, sort_order: 6,
    created_at: new Date().toISOString(),
  },
];

interface TestimonialsClientProps {
  testimonials: Testimonial[];
}

export default function TestimonialsClient({ testimonials }: TestimonialsClientProps) {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });
  const display = testimonials.length > 0 ? testimonials : DEMO_TESTIMONIALS;

  const featured = display.filter((t) => t.is_featured);
  const rest = display.filter((t) => !t.is_featured);

  return (
    <div className="pt-24 md:pt-28">
      {/* Header */}
      <div ref={headerRef} className="max-w-[1440px] mx-auto px-6 md:px-10 py-16 md:py-24">
        <motion.p
          initial={{ opacity: 0 }}
          animate={isHeaderInView ? { opacity: 1 } : {}}
          className="text-label text-platinum/30 mb-4"
        >
          Client Voices
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-display-xl text-platinum max-w-2xl"
        >
          What clients<br />
          <span className="text-acid italic">say about</span><br />
          the work.
        </motion.h1>
      </div>

      {/* Featured testimonials — large */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((t, i) => (
            <TestimonialCard key={t.id} testimonial={t} index={i} large />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 mb-16">
        <div className="border-t border-white/5" />
      </div>

      {/* Rest — smaller grid */}
      {rest.length > 0 && (
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 mb-24">
          <p className="text-label text-platinum/25 mb-8">More Feedback</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rest.map((t, i) => (
              <TestimonialCard key={t.id} testimonial={t} index={i} large={false} />
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="border-t border-white/5 py-24 text-center">
        <p className="text-label text-platinum/30 mb-4">Ready to add your name here?</p>
        <h2 className="text-display-md text-platinum mb-8">
          Let's build something<br />
          <span className="text-acid italic">worth talking about.</span>
        </h2>
        <Link
          href="/commission"
          className="inline-flex items-center gap-3 bg-acid text-ink px-8 py-4 text-label font-mono uppercase hover:bg-acid/90 transition-all duration-300"
        >
          Start a Commission →
        </Link>
      </div>
    </div>
  );
}

function TestimonialCard({
  testimonial: t, index, large
}: {
  testimonial: Testimonial;
  index: number;
  large: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className={`glass rounded-sm p-6 md:p-8 flex flex-col justify-between gap-8 ${
        large ? "min-h-[280px]" : "min-h-[200px]"
      }`}
    >
      {/* Rating */}
      {t.rating && (
        <div className="flex gap-1">
          {Array.from({ length: t.rating }).map((_, i) => (
            <span key={i} className="text-acid text-xs">★</span>
          ))}
        </div>
      )}

      {/* Content */}
      <blockquote className={`font-display italic text-platinum/80 leading-relaxed ${large ? "text-lg" : "text-base"}`}>
        "{t.content}"
      </blockquote>

      {/* Attribution */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm text-platinum font-medium">{t.client_name}</p>
          <p className="text-label text-platinum/35">
            {t.client_role}{t.client_company ? ` — ${t.client_company}` : ""}
          </p>
        </div>
        {t.project_type && (
          <span className="text-label text-acid/50 text-right hidden md:block max-w-[120px] leading-tight">
            {t.project_type}
          </span>
        )}
      </div>
    </motion.div>
  );
}
