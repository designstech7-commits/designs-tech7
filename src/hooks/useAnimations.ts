"use client";

import { useEffect, useRef } from "react";

/**
 * useSplitTextReveal — GSAP staggered character reveal
 * Attach the returned ref to a heading element.
 */
export function useSplitTextReveal(trigger: boolean = true) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!trigger || !ref.current) return;

    // Dynamic import to avoid SSR issues
    import("gsap").then(({ gsap }) => {
      const el = ref.current;
      if (!el) return;

      // Split text into chars
      const text = el.textContent || "";
      const chars = text.split("").map((char) => {
        const span = document.createElement("span");
        span.textContent = char === " " ? "\u00A0" : char;
        span.className = "split-char";
        span.style.display = "inline-block";
        return span;
      });

      el.textContent = "";
      chars.forEach((c) => el.appendChild(c));

      gsap.to(chars, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.02,
        ease: "power4.out",
        delay: 0.1,
      });
    });
  }, [trigger]);

  return ref;
}

/**
 * useScrollReveal — GSAP scroll-triggered fade/slide up
 */
export function useScrollReveal(options?: {
  y?: number;
  duration?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const { y = 30, duration = 0.8, delay = 0 } = options || {};

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger);

        gsap.fromTo(
          el,
          { y, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration,
            delay,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              once: true,
            },
          }
        );
      }
    );

    return () => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        ScrollTrigger.getAll().forEach((t) => t.kill());
      });
    };
  }, [y, duration, delay]);

  return ref;
}

/**
 * useMagneticEffect — magnetic hover on buttons/links
 */
export function useMagneticEffect(strength: number = 0.3) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    import("gsap").then(({ gsap }) => {
      const handleMouseMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * strength;
        const dy = (e.clientY - cy) * strength;

        gsap.to(el, {
          x: dx,
          y: dy,
          duration: 0.4,
          ease: "power2.out",
        });
      };

      const handleMouseLeave = () => {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: "elastic.out(1, 0.4)",
        });
      };

      el.addEventListener("mousemove", handleMouseMove);
      el.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        el.removeEventListener("mousemove", handleMouseMove);
        el.removeEventListener("mouseleave", handleMouseLeave);
      };
    });
  }, [strength]);

  return ref;
}

/**
 * useHorizontalScroll — scroll a container horizontally with wheel
 */
export function useHorizontalScroll() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return ref;
}

/**
 * useParallax — simple scroll parallax offset
 */
export function useParallax(speed: number = 0.5) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const offset = scrollY * speed;
      el.style.transform = `translateY(${offset}px)`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return ref;
}
