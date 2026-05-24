"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import type { Package } from "@/types";
import { formatPrice } from "@/lib/utils";
import CommissionForm from "./CommissionForm";

const DEMO_PACKAGES: Package[] = [
  {
    id: "essentials", name: "Essentials", tagline: "Single poster, maximum impact",
    description: "For a focused commission — one deliverable, executed with full attention.",
    price_from: 80000, price_to: 150000, currency: "USD", delivery_days: 7, revisions: 2,
    is_popular: false, is_active: true, sort_order: 1, created_at: new Date().toISOString(),
    features: ["1 static poster design", "High-resolution exports", "2 rounds of revisions", "Print + digital ready", "Basic usage license"],
    deliverables: ["1× Poster (A2/A3)", "Print-ready PDF", "Web JPG/PNG", "Color codes"],
  },
  {
    id: "studio", name: "Studio", tagline: "Full campaign visual system",
    description: "The complete package for campaigns that need to live across formats and motion.",
    price_from: 200000, price_to: 400000, currency: "USD", delivery_days: 14, revisions: 3,
    is_popular: true, is_active: true, sort_order: 2, created_at: new Date().toISOString(),
    features: ["Up to 3 poster variants", "Motion poster (15s loop)", "Social media adaptations", "3 rounds of revisions", "Extended usage license", "Source files included"],
    deliverables: ["3× Poster variants", "1× Motion poster", "Social kit", "Source files", "License doc"],
  },
  {
    id: "atelier", name: "Atelier", tagline: "Cinematic visual universe",
    description: "Full creative partnership for projects that demand a complete visual world.",
    price_from: 500000, price_to: null, currency: "USD", delivery_days: 30, revisions: 5,
    is_popular: false, is_active: true, sort_order: 3, created_at: new Date().toISOString(),
    features: ["Full visual identity system", "Animated campaign suite", "Title sequence (30s+)", "Unlimited revisions", "Full ownership transfer", "Priority support"],
    deliverables: ["Full identity system", "5+ Poster series", "Motion poster suite", "Title sequence", "All source files", "Full IP transfer"],
  },
];

interface CommissionPageClientProps {
  packages: Package[];
}

export default function CommissionPageClient({ packages }: CommissionPageClientProps) {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const packagesRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const displayPackages = packages.length > 0 ? packages : DEMO_PACKAGES;

  const handleSelectPackage = (id: string) => {
    setSelectedPackage(id);
    setShowForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <div className="pt-24 md:pt-28">
      {/* ── Header ── */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 items-end gap-8">
          <div className="md:col-span-7">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-label text-platinum/30 mb-4"
            >
              Commission Portal
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="text-display-xl text-platinum"
            >
              Start a<br />
              <span className="text-acid italic">Commission</span>
            </motion.h1>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="md:col-span-4 space-y-4"
          >
            <p className="text-sm text-platinum/50 leading-relaxed">
              Choose a starting point below, or submit a brief directly. We'll follow up with a tailored proposal within 48 hours.
            </p>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-acid animate-pulse" />
              <span className="text-label text-platinum/40">Currently accepting commissions</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Packages ── */}
      <div id="packages" ref={packagesRef} className="max-w-[1440px] mx-auto px-6 md:px-10 mb-24">
        <p className="text-label text-platinum/25 mb-8">Commission Packages</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {displayPackages.map((pkg, i) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              index={i}
              selected={selectedPackage === pkg.id}
              onSelect={() => handleSelectPackage(pkg.id)}
            />
          ))}
        </div>

        {/* Custom / skip packages */}
        <div className="mt-8 text-center">
          <p className="text-label text-platinum/25 mb-3">Have something specific in mind?</p>
          <button
            onClick={() => { setSelectedPackage(null); setShowForm(true); setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100); }}
            className="text-label text-acid hover:text-acid/70 transition-colors duration-200"
          >
            Skip packages — submit a custom brief →
          </button>
        </div>
      </div>

      {/* ── Multi-step form ── */}
      {showForm && (
        <div ref={formRef} className="border-t border-white/5 pt-20 pb-32">
          <CommissionForm selectedPackageId={selectedPackage} packages={displayPackages} />
        </div>
      )}
    </div>
  );
}

function PackageCard({
  pkg, index, selected, onSelect
}: {
  pkg: Package; index: number; selected: boolean; onSelect: () => void;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onClick={onSelect}
      className={`relative cursor-pointer rounded-sm border p-8 transition-all duration-300 ${
        selected
          ? "border-acid bg-acid/5 glow-acid"
          : pkg.is_popular
          ? "border-white/15 bg-white/[0.03] hover:border-white/25"
          : "border-white/5 hover:border-white/12"
      }`}
    >
      {pkg.is_popular && (
        <div className="absolute -top-3 left-6">
          <span className="bg-acid text-ink text-label px-3 py-1">Most Popular</span>
        </div>
      )}

      {selected && (
        <div className="absolute top-4 right-4">
          <div className="w-6 h-6 rounded-full bg-acid flex items-center justify-center">
            <span className="text-ink text-xs">✓</span>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h3 className="font-display text-2xl text-platinum mb-1">{pkg.name}</h3>
        {pkg.tagline && <p className="text-label text-platinum/40">{pkg.tagline}</p>}
      </div>

      {/* Price */}
      <div className="mb-6">
        <p className="text-sm text-platinum/30 mb-1">Starting from</p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-display text-acid">
            {formatPrice(pkg.price_from)}
          </span>
          {pkg.price_to && (
            <span className="text-platinum/40 text-sm">– {formatPrice(pkg.price_to)}</span>
          )}
          {!pkg.price_to && (
            <span className="text-platinum/40 text-sm">+</span>
          )}
        </div>
        <div className="flex gap-4 mt-2">
          {pkg.delivery_days && (
            <span className="text-label text-platinum/30">{pkg.delivery_days} days</span>
          )}
          <span className="text-label text-platinum/30">{pkg.revisions} revisions</span>
        </div>
      </div>

      {/* Features */}
      <ul className="space-y-2 mb-8">
        {(Array.isArray(pkg.features) ? pkg.features : []).map((feat: string) => (
          <li key={feat} className="flex items-start gap-2 text-sm text-platinum/50">
            <span className="text-acid/60 mt-0.5 shrink-0 text-xs">◆</span>
            {feat}
          </li>
        ))}
      </ul>

      {/* Select button */}
      <button
        className={`w-full py-3 text-label font-mono uppercase transition-all duration-300 ${
          selected
            ? "bg-acid text-ink"
            : "border border-white/10 text-platinum/50 hover:border-white/20 hover:text-platinum"
        }`}
      >
        {selected ? "Selected ✓" : "Select This Package"}
      </button>
    </motion.div>
  );
}
