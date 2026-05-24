"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

const METHODOLOGY = [
  { step: "01", title: "Listen & Decode", body: "Every project starts with silence. We read the brief twice, then ask the question behind the question. What does this piece need to feel like in ten years?" },
  { step: "02", title: "Research & Reference", body: "We build reference systems, not mood boards. The difference is intentionality — every reference has to earn its place with a specific reason." },
  { step: "03", title: "Constraint Architecture", body: "Before touching software, we define the rules: typographic system, color logic, motion vocabulary. Constraints are not limits — they are the grammar." },
  { step: "04", title: "Iterate in Public", body: "We show work early and often. Not polished concepts, but directions. The client is part of the process, not just the approval chain." },
  { step: "05", title: "Refine to Essence", body: "The final round is always about removal. What still doesn't need to be there? We cut until the piece has the minimum it needs to say everything." },
];

const INFLUENCES = [
  "Swiss International Typographic Style",
  "Wim Crouwel's Grid Systems",
  "Saul Bass Motion Titling",
  "Post-punk Sleeve Art (1979–1985)",
  "Japanese Minimalist Poster Tradition",
  "Neville Brody's Editorial Work",
  "Contemporary Motion Design Culture",
  "Underground Music Print",
];

export default function AboutClient() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  const methodRef = useRef(null);
  const isMethodInView = useInView(methodRef, { once: true, margin: "-80px" });

  const influenceRef = useRef(null);
  const isInfluenceInView = useInView(influenceRef, { once: true, margin: "-80px" });

  return (
    <div className="pt-20 md:pt-0">
      {/* ── Manifesto Hero ── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden editorial-grid">
        <div className="absolute inset-0 bg-gradient-radial from-white/[0.03] via-transparent to-transparent pointer-events-none" />

        {/* Large BG text */}
        <motion.div
          style={{ y: yText }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          aria-hidden
        >
          <span className="text-[18vw] font-display text-white/[0.025] leading-none tracking-tight">
            STUDIO
          </span>
        </motion.div>

        <div className="relative max-w-[1440px] mx-auto px-6 md:px-10 py-32">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-label text-platinum/30 mb-8"
          >
            About — Designs.Tech7
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-5xl"
          >
            <h1 className="text-display-hero text-platinum mb-8">
              We make<br />
              things that<br />
              <span className="text-acid italic">last.</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl"
          >
            <p className="text-base text-platinum/50 leading-relaxed">
              Designs.Tech7 is a graphic design studio specializing in poster design, motion graphics, key visuals, and campaign systems. We work at the intersection of print tradition and contemporary motion — where a poster can breathe.
            </p>
            <p className="text-base text-platinum/50 leading-relaxed">
              Founded on a belief that good design outlasts its medium. We don't make social content. We make visual objects with the weight of intent behind them.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Philosophy Strip ── */}
      <section className="border-y border-white/5 bg-white/[0.01] py-16">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10">
          <div className="flex overflow-x-auto gap-12 pb-2">
            {[
              { label: "Founded", value: "2020" },
              { label: "Projects Delivered", value: "200+" },
              { label: "Countries Served", value: "18" },
              { label: "Avg. Delivery", value: "14 days" },
              { label: "Revision Policy", value: "Always fair" },
            ].map((stat) => (
              <div key={stat.label} className="shrink-0 text-center">
                <p className="font-display text-3xl text-acid mb-1">{stat.value}</p>
                <p className="text-label text-platinum/30">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Methodology ── */}
      <section ref={methodRef} className="py-24 md:py-40 max-w-[1440px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <motion.p
              initial={{ opacity: 0 }}
              animate={isMethodInView ? { opacity: 1 } : {}}
              className="text-label text-platinum/30 mb-4"
            >
              How we work
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isMethodInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="text-display-lg text-platinum"
            >
              Design<br />
              <span className="italic text-acid">Methodology</span>
            </motion.h2>
          </div>

          <div className="md:col-span-7 md:col-start-6">
            {METHODOLOGY.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: 20 }}
                animate={isMethodInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.15 + i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="border-t border-white/5 py-8 grid grid-cols-12 gap-6"
              >
                <span className="col-span-1 text-label text-acid/50 mt-1">{item.step}</span>
                <div className="col-span-11">
                  <h3 className="text-lg font-display text-platinum mb-2">{item.title}</h3>
                  <p className="text-sm text-platinum/45 leading-relaxed">{item.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── References & Influences ── */}
      <section ref={influenceRef} className="py-24 md:py-32 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10">
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInfluenceInView ? { opacity: 1 } : {}}
            className="text-label text-platinum/30 mb-8"
          >
            References & Influences
          </motion.p>

          <div className="flex flex-wrap gap-3">
            {INFLUENCES.map((influence, i) => (
              <motion.span
                key={influence}
                initial={{ opacity: 0, y: 10 }}
                animate={isInfluenceInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className="text-sm border border-white/8 text-platinum/50 px-4 py-2 hover:border-acid/30 hover:text-acid/70 transition-all duration-200 cursor-default"
              >
                {influence}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 max-w-[1440px] mx-auto px-6 md:px-10 text-center">
        <h2 className="text-display-lg text-platinum mb-6">
          Ready to make<br />
          <span className="text-acid italic">something lasting?</span>
        </h2>
        <Link
          href="/commission"
          className="inline-flex items-center gap-3 bg-acid text-ink px-8 py-4 text-label font-mono uppercase hover:bg-acid/90 transition-all duration-300"
        >
          Start a Commission →
        </Link>
      </section>
    </div>
  );
}
