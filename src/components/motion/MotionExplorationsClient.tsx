"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const EXPLORATIONS = [
  {
    id: "1", title: "TEMPORAL DRIFT", type: "Kinetic Typography",
    duration: "00:08", year: 2024, tags: ["type", "loop"],
    cover: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=700&q=85",
    description: "A study in letter-spacing and temporal displacement.",
  },
  {
    id: "2", title: "STATIC FIELD", type: "Visual Loop",
    duration: "00:12", year: 2024, tags: ["texture", "loop"],
    cover: "https://images.unsplash.com/photo-1493210977872-fdd8c4ff0fc6?w=700&q=85",
    description: "Grain, noise, and signal — exploring the space between intention and accident.",
  },
  {
    id: "3", title: "WEIGHT CLASS", type: "Motion Typography",
    duration: "00:06", year: 2024, tags: ["type", "weight"],
    cover: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=700&q=85",
    description: "Variable font weight as choreography.",
  },
  {
    id: "4", title: "APERTURE", type: "Campaign Study",
    duration: "00:20", year: 2024, tags: ["campaign", "loop"],
    cover: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=700&q=85",
    description: "A campaign exploration for a fictional optical brand.",
  },
  {
    id: "5", title: "MEMBRANE", type: "Visual Loop",
    duration: "00:10", year: 2023, tags: ["texture", "loop"],
    cover: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=700&q=85",
    description: "Organic surfaces and manufactured tension.",
  },
  {
    id: "6", title: "COUNTER FORM", type: "Kinetic Typography",
    duration: "00:09", year: 2023, tags: ["type", "negative-space"],
    cover: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=85",
    description: "The negative space of letterforms as compositional subject.",
  },
];

type FilterType = "all" | "type" | "loop" | "campaign" | "texture";

export default function MotionExplorationsClient() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filters: { value: FilterType; label: string }[] = [
    { value: "all", label: "All" },
    { value: "type", label: "Typography" },
    { value: "loop", label: "Loops" },
    { value: "campaign", label: "Campaign" },
    { value: "texture", label: "Texture" },
  ];

  const filtered = activeFilter === "all"
    ? EXPLORATIONS
    : EXPLORATIONS.filter((e) => e.tags.includes(activeFilter));

  return (
    <div className="pt-24 md:pt-28 min-h-screen">
      {/* Header */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 items-end gap-6">
          <div className="md:col-span-6">
            <p className="text-label text-platinum/30 mb-4">Experimental Archive</p>
            <h1 className="text-display-xl text-platinum">
              Motion<br />
              <span className="text-acid italic">Explorations</span>
            </h1>
          </div>
          <p className="md:col-span-5 md:col-start-8 text-sm text-platinum/40 leading-relaxed">
            A laboratory of kinetic experiments, typographic studies, and animated visual investigations. Not every idea becomes a commission. Some exist purely for the practice.
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="sticky top-16 md:top-20 z-20 border-y border-white/5 bg-ink/90 backdrop-blur-sm">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-4 flex gap-2 overflow-x-auto">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`px-4 py-2 rounded-full text-label whitespace-nowrap transition-all duration-200 ${
                activeFilter === f.value
                  ? "bg-acid text-ink"
                  : "text-platinum/40 border border-white/5 hover:text-platinum hover:border-white/10"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              layout
            >
              <div
                className="group cursor-pointer"
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Visual */}
                <div className="relative aspect-video overflow-hidden rounded-sm mb-4 bg-ink-700">
                  <Image
                    src={item.cover}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700"
                    style={{
                      transform: hoveredId === item.id ? "scale(1.06)" : "scale(1)",
                    }}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  {/* Duration badge */}
                  <div className="absolute bottom-3 right-3 glass px-2 py-1 rounded-full">
                    <span className="text-label text-platinum/70">{item.duration}</span>
                  </div>
                  {/* Play overlay */}
                  <div
                    className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
                    style={{ opacity: hoveredId === item.id ? 1 : 0 }}
                  >
                    <div className="w-14 h-14 rounded-full bg-acid/90 flex items-center justify-center">
                      <span className="text-ink text-xl ml-1">▶</span>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-label text-acid/70">{item.type}</span>
                      <span className="text-label text-platinum/20">{item.year}</span>
                    </div>
                    <h3 className="font-display text-xl text-platinum group-hover:text-acid transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-sm text-platinum/40 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex gap-2 mt-3">
                  {item.tags.map((tag) => (
                    <span key={tag} className="text-label text-platinum/25 border border-white/5 px-2 py-0.5">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
