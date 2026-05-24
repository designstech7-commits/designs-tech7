"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/motion-explorations", label: "Motion" },
  { href: "/about", label: "Studio" },
  { href: "/testimonials", label: "Clients" },
  { href: "/commission", label: "Commission" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isDashboard = pathname?.startsWith("/dashboard");
  if (isDashboard) return null;

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled ? "glass-dark border-b border-white/5" : "bg-transparent"
        )}
      >
        <nav className="flex items-center justify-between px-6 md:px-10 h-16 md:h-20 max-w-[1440px] mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 bg-acid rounded-sm group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-1.5 bg-ink rounded-[2px]" />
              <div className="absolute inset-2.5 bg-acid rounded-[1px] group-hover:rotate-12 transition-transform duration-500" />
            </div>
            <span className="font-mono text-xs tracking-[0.15em] uppercase text-platinum/70 group-hover:text-platinum transition-colors duration-300">
              D7
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "text-label transition-colors duration-200 hover:text-acid",
                    pathname === link.href
                      ? "text-acid"
                      : "text-platinum/50"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="hidden md:flex items-center gap-2 text-label text-platinum/40 hover:text-platinum/80 transition-colors duration-200"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-acid/60" />
              Client Portal
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex flex-col gap-1.5 w-8 h-8 items-center justify-center"
              aria-label="Toggle menu"
            >
              <span
                className={cn(
                  "block w-6 h-[1px] bg-platinum transition-all duration-300",
                  mobileOpen && "rotate-45 translate-y-[5px]"
                )}
              />
              <span
                className={cn(
                  "block w-4 h-[1px] bg-platinum transition-all duration-300 self-start",
                  mobileOpen && "opacity-0 -translate-x-2"
                )}
              />
              <span
                className={cn(
                  "block w-6 h-[1px] bg-platinum transition-all duration-300",
                  mobileOpen && "-rotate-45 -translate-y-[5px]"
                )}
              />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 glass-dark flex flex-col justify-center items-center gap-8 md:hidden"
          >
            {NAV_LINKS.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={link.href}
                  className={cn(
                    "text-display-md transition-colors duration-200",
                    pathname === link.href
                      ? "text-acid"
                      : "text-platinum/80 hover:text-acid"
                  )}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              <Link href="/dashboard" className="text-label text-platinum/40 hover:text-platinum/80 transition-colors">
                Client Portal →
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
