"use client";

export default function GrainOverlay() {
  return (
    <div
      className="grain-overlay"
      aria-hidden="true"
      style={{ pointerEvents: "none", zIndex: 9997 }}
    />
  );
}
