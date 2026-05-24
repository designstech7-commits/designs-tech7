"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { PortfolioItem } from "@/types";

// Fallback demo items when DB is empty
const DEMO_ITEMS = [
  {
    id: "1", title: "NOCTURNE — Album Campaign", slug: "nocturne-album",
    cover_image_url: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&q=90",
    description: "Full visual identity for a dark ambient album release.",
    category: { name: "Album Artwork", slug: "album-artwork" },
    client: "VOID Records", year: 2024, tags: ["motion", "campaign"],
  },
  {
    id: "2", title: "LIMINAL STATES — Film Teaser", slug: "liminal-states",
    cover_image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=90",
    description: "Cinematic title sequence and key visual system.",
    category: { name: "Title Sequences", slug: "title-sequences" },
    client: "Meridian Films", year: 2024, tags: ["motion", "film"],
  },
  {
    id: "3", title: "ARCH FESTIVAL X", slug: "arch-festival",
    cover_image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=90",
    description: "Ten-year anniversary visual system for Europe's leading architecture festival.",
    category: { name: "Event Visuals", slug: "event-visuals" },
    client: "ARCH Foundation", year: 2024, tags: ["poster", "event"],
  },
];

interface FeaturedCampaignProps {
  items: PortfolioItem[];
}

export default function FeaturedCampaign({ items }: FeaturedCampaignProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const displayItems = items.length > 0 ? items.slice(0, 3) : DEMO_ITEMS;

  return (
    <section ref={ref} className="py-24 md:py-40 max-w-[1440px] mx-auto px-6 md:px-10">
      {/* Section header */}
      <div className="flex items-end justify-between mb-16 md:mb-24">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-label text-platinum/30 mb-3"
          >
            Selected Work — 2023–2024
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-display-xl text-platinum"
          >
            Featured<br />
            <span className="text-acid italic">Campaigns</span>
          </motion.h2>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
        >
          <Link href="/portfolio" className="text-label text-platinum/30 hover:text-acid transition-colors duration-300 hidden md:block">
            View all work →
          </Link>
        </motion.div>
      </div>

      {/* Featured items */}
      <div className="space-y-0">
        {displayItems.map((item, i) => (
          <FeaturedItem key={item.id} item={item as PortfolioItem} index={i} />
        ))}
      </div>
    </section>
  );
}

function FeaturedItem({ item, index }: { item: PortfolioItem & { category?: { name: string; slug: string } }; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/portfolio/${item.slug}`} className="group block">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 border-t border-white/5 py-8 md:py-12 items-center hover:border-white/10 transition-colors duration-300">
          {/* Number */}
          <div className="md:col-span-1 hidden md:block">
            <span className="text-label text-platinum/20">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          {/* Image */}
          <div className="md:col-span-4 mb-6 md:mb-0">
            <div className="relative aspect-video overflow-hidden rounded-sm">
              {item.cover_image_url ? (
                <Image
                  src={item.cover_image_url}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              ) : (
                <div className="w-full h-full bg-ink-700 flex items-center justify-center">
                  <span className="text-label text-platinum/20">No Preview</span>
                </div>
              )}
              {/* Video play indicator */}
              {item.cover_video_url && (
                <div className="absolute top-3 right-3 glass rounded-full px-2 py-1">
                  <span className="text-[10px] font-mono text-acid tracking-widest">▶ MOTION</span>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="md:col-span-5 md:px-10">
            <div className="flex items-center gap-3 mb-3">
              {item.category && (
                <span className="text-label text-acid/70">{item.category.name}</span>
              )}
              {item.year && (
                <span className="text-label text-platinum/20">{item.year}</span>
              )}
            </div>
            <h3 className="text-display-md text-platinum group-hover:text-acid transition-colors duration-500 mb-4">
              {item.title}
            </h3>
            {item.description && (
              <p className="text-sm text-platinum/40 leading-relaxed max-w-sm">
                {item.description}
              </p>
            )}
            {item.client && (
              <p className="text-label text-platinum/25 mt-4">
                Client — {item.client}
              </p>
            )}
          </div>

          {/* Arrow */}
          <div className="md:col-span-2 flex md:justify-end">
            <span className="text-platinum/20 group-hover:text-acid group-hover:translate-x-2 transition-all duration-300 text-2xl">
              →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
