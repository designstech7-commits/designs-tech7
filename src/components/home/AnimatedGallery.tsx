"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import type { PortfolioItem } from "@/types";

// Demo items for when DB is empty
const DEMO_GALLERY = [
  { id: "1", title: "FLUX", slug: "flux", cover_image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", category: { name: "Motion Posters" }, tags: ["motion"] },
  { id: "2", title: "NOCTURNE", slug: "nocturne", cover_image_url: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=600&q=80", category: { name: "Album Artwork" }, tags: ["print"] },
  { id: "3", title: "ARCH X", slug: "arch-x", cover_image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80", category: { name: "Event Visuals" }, tags: ["event"] },
  { id: "4", title: "VOID", slug: "void", cover_image_url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80", category: { name: "Title Sequences" }, tags: ["film"] },
  { id: "5", title: "SIGNAL", slug: "signal", cover_image_url: "https://images.unsplash.com/photo-1493210977872-fdd8c4ff0fc6?w=600&q=80", category: { name: "Campaign Graphics" }, tags: ["campaign"] },
  { id: "6", title: "MERIDIAN", slug: "meridian", cover_image_url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80", category: { name: "Key Visuals" }, tags: ["key-visual"] },
  { id: "7", title: "PRISM", slug: "prism", cover_image_url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80", category: { name: "Poster Design" }, tags: ["print"] },
  { id: "8", title: "ECHO", slug: "echo", cover_image_url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&q=80", category: { name: "Motion Posters" }, tags: ["motion"] },
];

interface AnimatedGalleryProps {
  items: PortfolioItem[];
}

export default function AnimatedGallery({ items }: AnimatedGalleryProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const displayItems = items.length >= 4 ? items : DEMO_GALLERY;

  return (
    <section ref={ref} className="py-24 md:py-40 max-w-[1440px] mx-auto px-6 md:px-10">
      {/* Header */}
      <div className="flex items-end justify-between mb-12 md:mb-16">
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="text-label text-platinum/30 mb-2"
          >
            Visual Archive
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-display-lg text-platinum"
          >
            The Work
          </motion.h2>
        </div>
        <Link href="/portfolio" className="text-label text-platinum/30 hover:text-acid transition-colors duration-300 hidden md:block">
          Full portfolio →
        </Link>
      </div>

      {/* Masonry grid */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
        {displayItems.slice(0, 8).map((item, i) => (
          <GalleryCard key={item.id} item={item as PortfolioItem & { category?: { name: string } }} index={i} isInView={isInView} />
        ))}
      </div>

      {/* Mobile view all */}
      <div className="mt-10 text-center md:hidden">
        <Link href="/portfolio" className="text-label text-acid hover:text-acid/70 transition-colors">
          View full portfolio →
        </Link>
      </div>
    </section>
  );
}

function GalleryCard({
  item,
  index,
  isInView,
}: {
  item: PortfolioItem & { category?: { name: string } };
  index: number;
  isInView: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  // Alternate tall/normal for masonry feel
  const isTall = index % 5 === 1 || index % 5 === 4;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className="break-inside-avoid mb-3"
    >
      <Link href={`/portfolio/${item.slug}`}>
        <div
          className="portfolio-card group relative overflow-hidden rounded-sm bg-ink-700"
          style={{ aspectRatio: isTall ? "3/4" : "4/3" }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {item.cover_image_url ? (
            <Image
              src={item.cover_image_url}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ transform: hovered ? "scale(1.08)" : "scale(1)" }}
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full bg-ink-700" />
          )}

          {/* Hover overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent transition-opacity duration-400"
            style={{ opacity: hovered ? 1 : 0 }}
          />

          {/* Card info */}
          <div
            className="absolute bottom-0 left-0 right-0 p-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ transform: hovered ? "translateY(0)" : "translateY(100%)" }}
          >
            <p className="text-label text-acid/80 mb-1">{item.category?.name}</p>
            <p className="text-sm font-display text-platinum">{item.title}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
