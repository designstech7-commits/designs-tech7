"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-ink mt-0">
      {/* Marquee strip */}
      <div className="overflow-hidden border-b border-white/5 py-3">
        <div className="marquee-track animate-marquee">
          {Array(8)
            .fill(null)
            .map((_, i) => (
              <span key={i} className="marquee-item text-label text-platinum/20">
                POSTER DESIGN&nbsp;&nbsp;·&nbsp;&nbsp;MOTION POSTERS&nbsp;&nbsp;·&nbsp;&nbsp;KEY VISUALS&nbsp;&nbsp;·&nbsp;&nbsp;CAMPAIGN GRAPHICS&nbsp;&nbsp;·&nbsp;&nbsp;TITLE SEQUENCES&nbsp;&nbsp;·&nbsp;&nbsp;ALBUM ARTWORK&nbsp;&nbsp;·&nbsp;&nbsp;EVENT VISUALS&nbsp;&nbsp;·&nbsp;&nbsp;MOTION TYPOGRAPHY
              </span>
            ))}
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="md:col-span-4">
            <Link href="/" className="block mb-6 group">
              <div className="text-display-lg text-platinum font-display leading-none mb-2">
                Designs<span className="text-acid">.</span>Tech<span className="text-acid italic">7</span>
              </div>
            </Link>
            <p className="text-sm text-platinum/40 leading-relaxed max-w-xs">
              A studio for those who treat every frame as a canvas. Poster design, motion graphics, and visual systems built to endure.
            </p>
          </div>

          {/* Links */}
          <div className="md:col-span-2 md:col-start-6">
            <p className="text-label text-platinum/30 mb-4">Work</p>
            <ul className="space-y-2">
              {[
                { href: "/portfolio", label: "Portfolio" },
                { href: "/motion-explorations", label: "Motion" },
                { href: "/testimonials", label: "Clients" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-platinum/50 hover:text-platinum transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="text-label text-platinum/30 mb-4">Studio</p>
            <ul className="space-y-2">
              {[
                { href: "/about", label: "About" },
                { href: "/commission", label: "Commission" },
                { href: "/commission#packages", label: "Packages" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-platinum/50 hover:text-platinum transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="text-label text-platinum/30 mb-4">Contact</p>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:designs.tech7@gmail.com"
                  className="text-sm text-platinum/50 hover:text-acid transition-colors duration-200"
                >
                  designs.tech7@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/919342609507"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-platinum/50 hover:text-acid transition-colors duration-200"
                >
                  +91 93426 09507
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/designs.tech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-platinum/50 hover:text-acid transition-colors duration-200"
                >
                  @designs.tech
                </a>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-platinum/50 hover:text-platinum transition-colors duration-200">
                  Client Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-label text-platinum/25">
            © {year} Designs.Tech7. All work and content reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-label text-platinum/20">Privacy</span>
            <span className="text-label text-platinum/20">Terms</span>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-acid/60 animate-pulse" />
              <span className="text-label text-platinum/25">Available for commissions</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
