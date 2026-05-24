"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

// Poster color palettes for the animated background
const POSTER_COLORS = [
  { bg: "#0a0a0a", accent: "#c8ff00", text: "#e8e6e1" },
  { bg: "#0d0510", accent: "#ff4400", text: "#f5e6ff" },
  { bg: "#050a08", accent: "#00ffa3", text: "#e6f5ef" },
  { bg: "#100508", accent: "#ff00aa", text: "#f5e6ef" },
];

const HEADLINE_WORDS = [
  "Motion.",
  "Rhythm.",
  "Weight.",
  "Signal.",
];

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [wordIndex, setWordIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

  // Cycling headline words
  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % HEADLINE_WORDS.length);
      setColorIndex((prev) => (prev + 1) % POSTER_COLORS.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const currentColor = POSTER_COLORS[colorIndex];

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[100dvh] overflow-hidden flex items-end"
    >
      {/* Background — animated gradient wash */}
      <motion.div
        className="absolute inset-0"
        animate={{ backgroundColor: currentColor.bg }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 editorial-grid opacity-100" />

      {/* Large abstract typographic element — BG */}
      <motion.div
        style={{ y, scale }}
        className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none"
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={wordIndex}
            initial={{ opacity: 0, y: 60, filter: "blur(30px)" }}
            animate={{ opacity: 0.06, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -40, filter: "blur(20px)" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute font-display text-[30vw] leading-none tracking-[-0.06em] text-white select-none"
            style={{ color: currentColor.accent }}
          >
            {HEADLINE_WORDS[wordIndex].replace(".", "")}
          </motion.span>
        </AnimatePresence>
      </motion.div>

      {/* Vertical rule decorations */}
      <div className="absolute left-10 top-0 bottom-0 w-[1px] bg-white/5 hidden md:block" />
      <div className="absolute right-10 top-0 bottom-0 w-[1px] bg-white/5 hidden md:block" />

      {/* Floating accent elements */}
      <motion.div
        className="absolute top-1/4 right-[10%] w-32 h-32 border border-white/10 rounded-sm"
        animate={{ rotate: [0, 15, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ borderColor: currentColor.accent + "30" }}
      />
      <motion.div
        className="absolute bottom-1/3 left-[8%] w-20 h-20 border border-white/10"
        animate={{ rotate: [0, -20, 0], y: [0, -15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        style={{ borderColor: currentColor.accent + "20" }}
      />

      {/* Corner label — top right */}
      <div className="absolute top-24 right-10 text-label text-white/20 text-right hidden md:block">
        <p>Studio</p>
        <p>Est. MMXXIV</p>
      </div>

      {/* Corner label — top left */}
      <div className="absolute top-24 left-10 text-label text-white/20 hidden md:block">
        <p>Poster Design</p>
        <p>Motion Graphics</p>
      </div>

      {/* Main hero content — bottom aligned */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-10 pb-16 md:pb-20"
      >
        {/* Studio identifier */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-label text-white/30 mb-6"
        >
          Designs.Tech7 — Visual Design Studio
        </motion.p>

        {/* Big headline */}
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="text-display-hero text-white leading-none"
          >
            Every Frame
            <br />
            <span className="flex items-baseline gap-4 md:gap-6">
              <span>Is a</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block italic"
                  style={{ color: currentColor.accent }}
                >
                  {HEADLINE_WORDS[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.h1>
        </div>

        {/* Sub row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row items-start md:items-end justify-between mt-8 gap-6"
        >
          <p className="text-sm text-white/40 max-w-sm leading-relaxed">
            A studio for designers who treat every poster as a manifesto, every animation as a score.
            We build visuals that carry weight.
          </p>

          <div className="flex items-center gap-6">
            <Link
              href="/portfolio"
              className="group flex items-center gap-3 text-sm font-mono tracking-wider uppercase transition-all duration-300"
              style={{ color: currentColor.accent }}
            >
              View Work
              <span className="inline-block w-8 h-[1px] group-hover:w-16 transition-all duration-500"
                style={{ background: currentColor.accent }} />
            </Link>
            <Link
              href="/commission"
              className="text-sm text-white/40 hover:text-white transition-colors duration-200 font-mono tracking-wider uppercase"
            >
              Commission
            </Link>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-label text-white/20">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-[1px] h-10 bg-white/20"
        />
      </motion.div>
    </section>
  );
}
