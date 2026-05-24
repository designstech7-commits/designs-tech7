"use client";

const ITEMS = [
  "Poster Design",
  "Motion Posters",
  "Key Visuals",
  "Campaign Graphics",
  "Title Sequences",
  "Album Artwork",
  "Event Visuals",
  "Motion Typography",
  "Visual Systems",
  "Cinematic UI",
];

export default function MarqueeStrip() {
  return (
    <div className="relative border-y border-white/5 overflow-hidden py-3 bg-white/[0.02]">
      <div className="flex">
        {/* Forward */}
        <div className="marquee-track animate-marquee">
          {[...ITEMS, ...ITEMS].map((item, i) => (
            <span key={i} className="marquee-item">
              <span className="text-label text-platinum/30">{item}</span>
              <span className="mx-4 text-acid/40">◆</span>
            </span>
          ))}
        </div>
        <div className="marquee-track animate-marquee" aria-hidden>
          {[...ITEMS, ...ITEMS].map((item, i) => (
            <span key={i} className="marquee-item">
              <span className="text-label text-platinum/30">{item}</span>
              <span className="mx-4 text-acid/40">◆</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
