"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import type { PortfolioItem } from "@/types";

interface CaseStudyClientProps {
  item: PortfolioItem & { category?: { name: string; slug: string } };
}

export default function CaseStudyClient({ item }: CaseStudyClientProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const galleryUrls: string[] = Array.isArray(item.gallery_urls) ? item.gallery_urls : [];
  const deliverables: string[] = Array.isArray(item.deliverables) ? item.deliverables : [];
  const toolsUsed: string[] = Array.isArray(item.tools_used) ? item.tools_used : [];
  const colorPalette: string[] = Array.isArray(item.color_palette) ? item.color_palette : [];

  return (
    <article>
      {/* ── Hero ── */}
      <div ref={heroRef} className="relative h-[90vh] overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          {item.cover_image_url ? (
            <Image
              src={item.cover_image_url}
              alt={item.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          ) : (
            <div className="w-full h-full bg-ink-700" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-transparent to-ink" />
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute inset-0 flex flex-col justify-end max-w-[1440px] mx-auto px-6 md:px-10 pb-16 md:pb-20"
        >
          {item.category && (
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-label text-acid mb-3 block"
            >
              {item.category.name}
            </motion.span>
          )}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-display-xl text-platinum mb-4"
          >
            {item.title}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-6 text-label text-platinum/40"
          >
            {item.client && <span>Client — {item.client}</span>}
            {item.year && <span>Year — {item.year}</span>}
            {item.format && <span>Format — {item.format}</span>}
          </motion.div>
        </motion.div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-20 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20">

          {/* Left — descriptions */}
          <div className="md:col-span-7 space-y-16">
            {/* Overview */}
            {item.description && (
              <Section label="Overview">
                <p className="text-xl text-platinum/80 leading-relaxed font-display italic">
                  {item.description}
                </p>
              </Section>
            )}

            {/* Full description */}
            {item.full_description && (
              <Section label="The Work">
                <div className="space-y-4">
                  {item.full_description.split("\n\n").map((para, i) => (
                    <p key={i} className="text-base text-platinum/55 leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>
              </Section>
            )}

            {/* Brief summary */}
            {item.brief_summary && (
              <Section label="Client Brief">
                <blockquote className="border-l-2 border-acid pl-6">
                  <p className="text-base text-platinum/60 leading-relaxed italic">
                    "{item.brief_summary}"
                  </p>
                </blockquote>
              </Section>
            )}

            {/* Design Process */}
            {item.design_process && (
              <Section label="Design Process">
                <p className="text-base text-platinum/55 leading-relaxed">
                  {item.design_process}
                </p>
              </Section>
            )}

            {/* Behind the scenes */}
            {item.behind_the_scenes && (
              <Section label="Behind the Scenes">
                <p className="text-base text-platinum/55 leading-relaxed">
                  {item.behind_the_scenes}
                </p>
              </Section>
            )}
          </div>

          {/* Right — metadata */}
          <div className="md:col-span-4 md:col-start-9">
            <div className="sticky top-28 space-y-8">
              {/* Deliverables */}
              {deliverables.length > 0 && (
                <div className="glass p-6 rounded-sm space-y-4">
                  <p className="text-label text-platinum/30">Deliverables</p>
                  <ul className="space-y-2">
                    {deliverables.map((d, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-platinum/60">
                        <span className="text-acid mt-0.5 shrink-0">◆</span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tools */}
              {toolsUsed.length > 0 && (
                <div className="space-y-3">
                  <p className="text-label text-platinum/30">Tools Used</p>
                  <div className="flex flex-wrap gap-2">
                    {toolsUsed.map((tool) => (
                      <span
                        key={tool}
                        className="text-label border border-white/8 px-3 py-1.5 text-platinum/50"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {Array.isArray(item.tags) && item.tags.length > 0 && (
                <div className="space-y-3">
                  <p className="text-label text-platinum/30">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span key={tag} className="text-label text-acid/60 border border-acid/15 px-2 py-1">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Color palette */}
              {colorPalette.length > 0 && (
                <div className="space-y-3">
                  <p className="text-label text-platinum/30">Color Palette</p>
                  <div className="flex gap-2">
                    {colorPalette.map((color, i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-sm border border-white/10"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="pt-4 border-t border-white/5">
                <Link
                  href="/commission"
                  className="block text-center bg-acid text-ink py-3 text-label font-mono uppercase hover:bg-acid/90 transition-colors duration-200"
                >
                  Commission Similar Work →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── Gallery ── */}
        {galleryUrls.length > 0 && (
          <div className="mt-24 md:mt-32">
            <Section label="Project Gallery">
              <GalleryGrid images={galleryUrls} title={item.title} />
            </Section>
          </div>
        )}

        {/* ── Comparison slider if before/after available ── */}
        {galleryUrls.length >= 2 && (
          <div className="mt-24">
            <Section label="Concept Comparison">
              <ComparisonSlider
                before={galleryUrls[0]}
                after={galleryUrls[1]}
                alt={item.title}
              />
            </Section>
          </div>
        )}
      </div>

      {/* ── Back nav ── */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 pb-24 border-t border-white/5 pt-12">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-3 text-label text-platinum/40 hover:text-acid transition-colors duration-200"
        >
          ← Back to Portfolio
        </Link>
      </div>
    </article>
  );
}

// ── Section wrapper ──
function Section({ label, children }: { label: string; children: React.ReactNode }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <p className="text-label text-platinum/25 mb-4">{label}</p>
      {children}
    </motion.div>
  );
}

// ── Gallery Grid ──
function GalleryGrid({ images, title }: { images: string[]; title: string }) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((url, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            onClick={() => setLightbox(i)}
            className="relative aspect-video cursor-zoom-in overflow-hidden rounded-sm group"
          >
            <Image
              src={url}
              alt={`${title} — ${i + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-ink/95 flex items-center justify-center p-4 md:p-10"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 text-platinum/40 hover:text-platinum text-label"
            onClick={() => setLightbox(null)}
          >
            Close ✕
          </button>
          <div className="relative max-w-5xl w-full aspect-video">
            <Image
              src={images[lightbox]}
              alt={`${title} — ${lightbox + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
          <div className="absolute bottom-6 flex gap-4">
            {lightbox > 0 && (
              <button
                className="text-label text-platinum/50 hover:text-platinum"
                onClick={(e) => { e.stopPropagation(); setLightbox(lightbox - 1); }}
              >
                ← Prev
              </button>
            )}
            <span className="text-label text-platinum/25">
              {lightbox + 1} / {images.length}
            </span>
            {lightbox < images.length - 1 && (
              <button
                className="text-label text-platinum/50 hover:text-platinum"
                onClick={(e) => { e.stopPropagation(); setLightbox(lightbox + 1); }}
              >
                Next →
              </button>
            )}
          </div>
        </motion.div>
      )}
    </>
  );
}

// ── Comparison Slider ──
function ComparisonSlider({ before, after, alt }: { before: string; after: string; alt: string }) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updatePosition = (clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    setPosition(pct);
  };

  return (
    <div
      ref={containerRef}
      className="relative aspect-video overflow-hidden rounded-sm cursor-col-resize select-none"
      onMouseDown={() => { dragging.current = true; }}
      onMouseMove={(e) => { if (dragging.current) updatePosition(e.clientX); }}
      onMouseUp={() => { dragging.current = false; }}
      onMouseLeave={() => { dragging.current = false; }}
      onTouchMove={(e) => updatePosition(e.touches[0].clientX)}
    >
      {/* After (bottom layer) */}
      <Image src={after} alt={`${alt} — after`} fill className="object-cover" sizes="100vw" />

      {/* Before (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image src={before} alt={`${alt} — before`} fill className="object-cover" sizes="100vw" />
      </div>

      {/* Handle */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-acid z-10 pointer-events-none"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-acid border-2 border-ink flex items-center justify-center">
          <span className="text-ink text-xs font-mono">⇔</span>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-4 left-4 text-label text-white/60 bg-ink/60 px-2 py-1">Before</div>
      <div className="absolute bottom-4 right-4 text-label text-white/60 bg-ink/60 px-2 py-1">After</div>
    </div>
  );
}
