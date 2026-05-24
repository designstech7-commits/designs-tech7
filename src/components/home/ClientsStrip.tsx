"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const CLIENTS = [
  "VOID Records", "Meridian Films", "ARCH Foundation", "Capsule Studio",
  "Neon Records", "Phase Films", "Outline Magazine", "Zenith Collective",
];

export function ClientsStrip() {
  return (
    <div className="border-y border-white/5 py-12 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 mb-8">
        <p className="text-label text-platinum/20 text-center">Trusted by</p>
      </div>
      <div className="flex">
        <div className="marquee-track animate-marquee-reverse">
          {[...CLIENTS, ...CLIENTS].map((client, i) => (
            <span key={i} className="marquee-item text-base font-display italic text-platinum/20 hover:text-platinum/40 transition-colors duration-200">
              {client}
            </span>
          ))}
        </div>
        <div className="marquee-track animate-marquee-reverse" aria-hidden>
          {[...CLIENTS, ...CLIENTS].map((client, i) => (
            <span key={i} className="marquee-item text-base font-display italic text-platinum/20">
              {client}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function HomeCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 md:py-40 max-w-[1440px] mx-auto px-6 md:px-10">
      <div className="relative overflow-hidden rounded-sm border border-white/5 p-12 md:p-20 bg-white/[0.02]">
        {/* BG pattern */}
        <div className="absolute inset-0 editorial-grid opacity-50" />

        {/* Decorative element */}
        <div className="absolute top-8 right-8 w-32 h-32 border border-acid/10 rounded-sm rotate-12" />
        <div className="absolute bottom-8 left-8 w-20 h-20 border border-acid/10 rotate-6" />

        <div className="relative">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="text-label text-platinum/30 mb-6"
          >
            Commission a Project
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.9 }}
            className="text-display-xl text-platinum mb-8 max-w-3xl"
          >
            Have a vision?<br />
            Let's build it<br />
            <span className="text-acid italic">together.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-base text-platinum/40 max-w-lg mb-10 leading-relaxed"
          >
            From a single poster to a full campaign visual system — start with a brief, and we'll take it from there.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-start gap-4"
          >
            <Link
              href="/commission"
              className="group inline-flex items-center gap-3 bg-acid text-ink px-8 py-4 text-label font-mono uppercase hover:bg-acid/90 transition-all duration-300"
            >
              Start a Commission
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </Link>
            <Link
              href="/commission#packages"
              className="inline-flex items-center gap-3 border border-white/10 text-platinum/60 px-8 py-4 text-label font-mono uppercase hover:border-white/20 hover:text-platinum transition-all duration-300"
            >
              View Packages
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function ClientsAndCTA() {
  return (
    <>
      <ClientsStrip />
      <HomeCTA />
    </>
  );
}
