"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface KineticTextProps {
  text: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  className?: string;
  mode?: "slide-up" | "blur-in" | "stagger" | "typewriter";
  delay?: number;
  once?: boolean;
}

export default function KineticText({
  text,
  tag: Tag = "p",
  className = "",
  mode = "slide-up",
  delay = 0,
  once = true,
}: KineticTextProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-40px" });

  if (mode === "stagger") {
    const words = text.split(" ");
    return (
      <Tag ref={ref} className={`overflow-hidden ${className}`} aria-label={text}>
        <span className="flex flex-wrap gap-x-[0.25em]">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ y: "110%", opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{
                duration: 0.65,
                delay: delay + i * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="inline-block overflow-hidden"
            >
              <span className="inline-block">{word}</span>
            </motion.span>
          ))}
        </span>
      </Tag>
    );
  }

  const variants = {
    "slide-up": {
      hidden: { y: 40, opacity: 0 },
      visible: { y: 0, opacity: 1 },
    },
    "blur-in": {
      hidden: { filter: "blur(20px)", opacity: 0 },
      visible: { filter: "blur(0px)", opacity: 1 },
    },
    typewriter: {
      hidden: { width: "0%" },
      visible: { width: "100%" },
    },
  };

  return (
    <Tag ref={ref} className={className}>
      <motion.span
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={variants[mode as keyof typeof variants] || variants["slide-up"]}
        transition={{
          duration: mode === "blur-in" ? 1 : 0.7,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={mode === "typewriter" ? "inline-block overflow-hidden whitespace-nowrap" : "inline-block"}
      >
        {text}
      </motion.span>
    </Tag>
  );
}
