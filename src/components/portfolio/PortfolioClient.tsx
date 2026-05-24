"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { PortfolioItem, PortfolioCategory } from "@/types";

const DEMO_ITEMS = [
  { id: "1", title: "NOCTURNE", slug: "nocturne", cover_image_url: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=700&q=80", category: { id: "album", name: "Album Artwork", slug: "album-artwork" }, client: "VOID Records", year: 2024, tags: ["motion", "print"], description: "Album campaign visual system", is_featured: true, is_published: true },
  { id: "2", title: "LIMINAL", slug: "liminal", cover_image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=700&q=80", category: { id: "title", name: "Title Sequences", slug: "title-sequences" }, client: "Meridian Films", year: 2024, tags: ["motion", "film"], description: "Cinematic title sequence", is_featured: true, is_published: true },
  { id: "3", title: "ARCH X", slug: "arch-x", cover_image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80", category: { id: "event", name: "Event Visuals", slug: "event-visuals" }, client: "ARCH Foundation", year: 2024, tags: ["poster", "event"], description: "Festival visual identity", is_featured: false, is_published: true },
  { id: "4", title: "VOID SIGNAL", slug: "void-signal", cover_image_url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=700&q=80", category: { id: "motion", name: "Motion Posters", slug: "motion-posters" }, client: "Internal", year: 2024, tags: ["motion"], description: "Motion poster experiment", is_featured: false, is_published: true },
  { id: "5", title: "MERIDIAN", slug: "meridian-kv", cover_image_url: "https://images.unsplash.com/photo-1493210977872-fdd8c4ff0fc6?w=700&q=80", category: { id: "kv", name: "Key Visuals", slug: "key-visuals" }, client: "Phase Films", year: 2023, tags: ["key-visual"], description: "Film key visual", is_featured: false, is_published: true },
  { id: "6", title: "PRISM", slug: "prism", cover_image_url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=700&q=80", category: { id: "poster", name: "Poster Design", slug: "poster-design" }, client: "Capsule", year: 2023, tags: ["print", "poster"], description: "Poster series", is_featured: false, is_published: true },
  { id: "7", title: "FREQUENCY", slug: "frequency", cover_image_url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=700&q=80", category: { id: "campaign", name: "Campaign Graphics", slug: "campaign-graphics" }, client: "Neon Records", year: 2023, tags: ["campaign", "motion"], description: "Digital campaign suite", is_featured: false, is_published: true },
  { id: "8", title: "ECHO", slug: "echo", cover_image_url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=700&q=80", category: { id: "motion2", name: "Motion Posters", slug: "motion-posters" }, client: "Internal", year: 2023, tags: ["motion"], description: "Motion typography experiment", is_featured: false, is_published: true },
  { id: "9", title: "SIGNAL/NOISE", slug: "signal-noise", cover_image_url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=700&q=80", category: { id: "album2", name: "Album Artwork", slug: "album-artwork" }, client: "Outline", year: 2023, tags: ["print"], description: "Double LP cover design", is_featured: false, is_published: true },
];

interface PortfolioClientProps {
  items: PortfolioItem[];
  categories: PortfolioCategory[];
}

export default function PortfolioClient({ items, categories }: PortfolioClientProps) {
  const [activeFilter, setActiveFilter] = useState("all");
  const displayItems = items.length > 0 ? items : (DEMO_ITEMS as unknown as PortfolioItem[]);

  const filtered = useMemo(() => {
    if (activeFilter === "all") return displayItems;
    return displayItems.filter((item) => {
      const cat = (item as PortfolioItem & { category?: { slug: string } }).category;
      return cat?.slug === activeFilter;
    });
  }, [activeFilter, displayItems]);

  const allCategories = categories.length > 0
    ? categories
    : [...new Set(DEMO_ITEMS.map((i) => i.category.slug))].map((slug) => {
        const item = DEMO_ITEMS.find((i) => i.category.slug === slug)!;
        return { id: slug, name: item.category.name, slug, description: null, sort_order: 0 };
      });

  return (
    <div className="pt-24 md:pt-28">
      {/* Header */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          <div className="md:col-span-7">
            <p className="text-label text-platinum/30 mb-4">Complete Archive</p>
            <h1 className="text-display-xl text-platinum">
              Portfolio<br />
              <span className="text-acid italic">& Work</span>
            </h1>
          </div>
          <div className="md:col-span-5 md:text-right">
            <p className="text-sm text-platinum/40 leading-relaxed">
              Poster design, motion graphics, key visuals, and campaign systems. Every project listed represents a distinct brief, solved with intention.
            </p>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="sticky top-16 md:top-20 z-30 border-y border-white/5 bg-ink/90 backdrop-blur-sm">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-4 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <FilterButton
            label="All"
            value="all"
            active={activeFilter === "all"}
            count={displayItems.length}
            onClick={() => setActiveFilter("all")}
          />
          {allCategories.map((cat) => {
            const count = displayItems.filter((item) => {
              const c = (item as PortfolioItem & { category?: { slug: string } }).category;
              return c?.slug === cat.slug;
            }).length;
            return (
              <FilterButton
                key={cat.id}
                label={cat.name}
                value={cat.slug}
                active={activeFilter === cat.slug}
                count={count}
                onClick={() => setActiveFilter(cat.slug)}
              />
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {filtered.map((item, i) => (
              <PortfolioCard key={item.id} item={item as PortfolioItem & { category?: { name: string } }} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="py-32 text-center">
            <p className="text-label text-platinum/30">No items in this category yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterButton({
  label, value, active, count, onClick
}: {
  label: string; value: string; active: boolean; count: number; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-label whitespace-nowrap transition-all duration-200 ${
        active
          ? "bg-acid text-ink"
          : "text-platinum/40 hover:text-platinum border border-white/5 hover:border-white/10"
      }`}
    >
      {label}
      <span className={`text-[9px] ${active ? "text-ink/60" : "text-platinum/25"}`}>{count}</span>
    </button>
  );
}

function PortfolioCard({
  item, index
}: {
  item: PortfolioItem & { category?: { name: string } };
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const isTall = index % 7 === 2 || index % 7 === 5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.4), ease: [0.16, 1, 0.3, 1] }}
      className={isTall ? "row-span-2" : ""}
    >
      <Link href={`/portfolio/${item.slug}`}>
        <div
          className="group relative overflow-hidden rounded-sm bg-ink-700 cursor-pointer"
          style={{ aspectRatio: isTall ? "3/5" : "4/3" }}
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
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full bg-ink-700 flex items-center justify-center">
              <span className="text-label text-platinum/20">{item.title}</span>
            </div>
          )}

          {/* Overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent transition-opacity duration-400"
            style={{ opacity: hovered ? 1 : 0 }}
          />

          {/* Info */}
          <div
            className="absolute inset-x-0 bottom-0 p-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ transform: hovered ? "translateY(0)" : "translateY(110%)" }}
          >
            {item.category && (
              <p className="text-label text-acid/80 mb-1">{item.category.name}</p>
            )}
            <p className="font-display text-lg text-platinum leading-tight">{item.title}</p>
            {item.client && (
              <p className="text-label text-platinum/40 mt-1">{item.client}</p>
            )}
          </div>

          {/* Top badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {item.is_featured && (
              <span className="text-label bg-acid text-ink px-2 py-0.5 rounded-full text-[9px]">
                Featured
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
