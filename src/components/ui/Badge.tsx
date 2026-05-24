import { cn, getStatusColor, getStatusLabel } from "@/lib/utils";

interface BadgeProps {
  children?: React.ReactNode;
  variant?: "default" | "acid" | "ember" | "muted";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const variants = {
    default: "border border-white/10 text-platinum/50",
    acid: "border border-acid/20 text-acid/80 bg-acid/5",
    ember: "border border-ember/20 text-ember/80 bg-ember/5",
    muted: "text-platinum/25 bg-white/[0.03]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 font-mono text-[10px] tracking-wider uppercase rounded-full",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const colorClass = getStatusColor(status);
  const label = getStatusLabel(status);

  const getBg = () => {
    if (colorClass.includes("acid")) return "bg-acid/5 border border-acid/20";
    if (colorClass.includes("ember") || colorClass.includes("red")) return "bg-ember/5 border border-ember/20";
    if (colorClass.includes("green")) return "bg-green-500/5 border border-green-500/20";
    if (colorClass.includes("blue")) return "bg-blue-500/5 border border-blue-500/20";
    if (colorClass.includes("yellow")) return "bg-yellow-500/5 border border-yellow-500/20";
    if (colorClass.includes("purple")) return "bg-purple-500/5 border border-purple-500/20";
    return "bg-white/[0.03] border border-white/8";
  };

  return (
    <span
      className={cn(
        "status-badge",
        colorClass,
        getBg(),
        className
      )}
    >
      {label}
    </span>
  );
}
