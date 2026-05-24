"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

const PHILOSOPHY_POINTS = [
  {
    number: "01",
    title: "The poster is a score",
    body: "Every visual element has a role to play. Hierarchy is not decoration — it is direction. We compose, we don't place.",
  },
  {
    number: "02",
    title: "Motion is not decoration",
    body: "Animation should carry meaning. A poster that moves must move with intention — pacing, timing, and breath built into every frame.",
  },
  {
    number: "03",
    title: "Restraint is a skill",
    body: "Knowing what to remove is as important as knowing what to add. We work until there is nothing left to take away.",
  },
];

export default function StudioPhilosophy() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white/[0.02] border-y border-white/5 py-24 md:py-40"
    >
      {/* Moving background text */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
        aria-hidden
      >
        <span className="text-[20vw] font-display text-white/[0.015] leading-none tracking-[-0.05em] whitespace-nowrap">
          PHILOSOPHY
        </span>
      </motion.div>

      <div className="relative max-w-[1440px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-0">
          {/* Left — manifesto */}
          <div className="md:col-span-5">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-label text-platinum/30 mb-6"
            >
              Studio Philosophy
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="text-display-xl text-platinum mb-8"
            >
              We Build<br />
              Visuals That<br />
              <span className="italic text-acid">Endure.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="text-base text-platinum/50 leading-relaxed max-w-sm"
            >
              In an era of disposable graphics, we obsess over timelessness. Every project starts with a question: what would this look like if it had to last 20 years?
            </motion.p>
          </div>

          {/* Right — points */}
          <div className="md:col-span-6 md:col-start-7 space-y-0">
            {PHILOSOPHY_POINTS.map((point, i) => (
              <motion.div
                key={point.number}
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="border-t border-white/5 py-8"
              >
                <div className="flex items-start gap-6">
                  <span className="text-label text-acid/50 mt-1 shrink-0">{point.number}</span>
                  <div>
                    <h3 className="text-xl font-display text-platinum mb-3">{point.title}</h3>
                    <p className="text-sm text-platinum/40 leading-relaxed">{point.body}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
