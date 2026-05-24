"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // Only enable on non-touch devices
    if ("ontouchstart" in window) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const onMouseMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
    };

    const onMouseEnterLink = (e: Event) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[data-cursor='pointer']")
      ) {
        dot.style.transform = "translate(-50%, -50%) scale(2.5)";
        dot.style.background = "#c8ff00";
        ring.style.transform = "translate(-50%, -50%) scale(1.8)";
        ring.style.borderColor = "rgba(200, 255, 0, 0.6)";
        ring.style.mixBlendMode = "normal";
      }
    };

    const onMouseLeaveLink = () => {
      dot.style.transform = "translate(-50%, -50%) scale(1)";
      dot.style.background = "#c8ff00";
      ring.style.transform = "translate(-50%, -50%) scale(1)";
      ring.style.borderColor = "rgba(200, 255, 0, 0.4)";
      ring.style.mixBlendMode = "normal";
    };

    // Smooth ring follow
    const animateRing = () => {
      const speed = 0.12;
      ringPos.current.x += (pos.current.x - ringPos.current.x) * speed;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * speed;
      ring.style.left = `${ringPos.current.x}px`;
      ring.style.top = `${ringPos.current.y}px`;
      rafRef.current = requestAnimationFrame(animateRing);
    };

    rafRef.current = requestAnimationFrame(animateRing);

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseEnterLink);
    document.addEventListener("mouseout", onMouseLeaveLink);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseEnterLink);
      document.removeEventListener("mouseout", onMouseLeaveLink);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="cursor-dot hidden md:block"
        style={{ position: "fixed", pointerEvents: "none", zIndex: 99999 }}
      />
      <div
        ref={ringRef}
        className="cursor-ring hidden md:block"
        style={{ position: "fixed", pointerEvents: "none", zIndex: 99998 }}
      />
    </>
  );
}
