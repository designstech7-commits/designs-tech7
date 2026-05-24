import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(cents: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "…";
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    draft: "text-ink-400",
    submitted: "text-blue-400",
    reviewing: "text-yellow-400",
    quoted: "text-purple-400",
    approved: "text-acid",
    in_progress: "text-acid",
    revision: "text-ember",
    delivered: "text-green-400",
    completed: "text-green-500",
    cancelled: "text-red-400",
  };
  return colors[status] || "text-ink-400";
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    draft: "Draft",
    submitted: "Submitted",
    reviewing: "Under Review",
    quoted: "Quote Ready",
    approved: "Approved",
    in_progress: "In Progress",
    revision: "In Revision",
    delivered: "Delivered",
    completed: "Completed",
    cancelled: "Cancelled",
  };
  return labels[status] || status;
}

export function getProjectTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    poster_design: "Poster Design",
    animated_poster: "Animated Poster",
    teaser_visual: "Teaser Visual",
    social_campaign: "Social Campaign",
    event_visuals: "Event Visuals",
    album_artwork: "Album Artwork",
    motion_typography: "Motion Typography",
    title_sequence: "Title Sequence",
    key_visual: "Key Visual",
    other: "Other",
  };
  return labels[type] || type;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
}

export const PROJECT_TYPES = [
  { value: "poster_design", label: "Poster Design" },
  { value: "animated_poster", label: "Animated Poster" },
  { value: "teaser_visual", label: "Teaser Visual" },
  { value: "social_campaign", label: "Social Campaign Assets" },
  { value: "event_visuals", label: "Event Visuals" },
  { value: "album_artwork", label: "Album Artwork" },
  { value: "motion_typography", label: "Motion Typography" },
  { value: "title_sequence", label: "Title Sequence" },
  { value: "key_visual", label: "Key Visual" },
  { value: "other", label: "Other" },
];

export const ASPECT_RATIOS = [
  { value: "16:9", label: "16:9 — Widescreen / Landscape" },
  { value: "9:16", label: "9:16 — Portrait / Story" },
  { value: "1:1", label: "1:1 — Square / Feed" },
  { value: "4:5", label: "4:5 — Portrait Feed" },
  { value: "4:3", label: "4:3 — Classic" },
  { value: "A4", label: "A4 — Print Standard" },
  { value: "A3", label: "A3 — Large Format Print" },
  { value: "A2", label: "A2 — Poster Format" },
  { value: "custom", label: "Custom — specify in brief" },
];

export const EXPORT_FORMATS = [
  { value: "mp4", label: "MP4 — Video" },
  { value: "gif", label: "GIF — Animated" },
  { value: "webm", label: "WebM — Web Video" },
  { value: "jpg", label: "JPG — Photo Quality" },
  { value: "png", label: "PNG — Transparent" },
  { value: "pdf", label: "PDF — Print Ready" },
  { value: "psd", label: "PSD — Photoshop Source" },
  { value: "ai", label: "AI — Illustrator Source" },
  { value: "svg", label: "SVG — Vector" },
];

export const BUDGET_RANGES = [
  { value: "under_1000", label: "Under $1,000" },
  { value: "1000_2500", label: "$1,000 – $2,500" },
  { value: "2500_5000", label: "$2,500 – $5,000" },
  { value: "5000_10000", label: "$5,000 – $10,000" },
  { value: "10000_plus", label: "$10,000+" },
  { value: "discuss", label: "Let's Discuss" },
];
