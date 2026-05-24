import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "glass" | "solid" | "outline";
  padding?: "sm" | "md" | "lg";
}

export function Card({ children, className, variant = "glass", padding = "md" }: CardProps) {
  const variants = {
    glass: "glass rounded-sm",
    solid: "bg-white/[0.03] rounded-sm border border-white/5",
    outline: "border border-white/8 rounded-sm",
  };

  const paddings = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div className={cn(variants[variant], paddings[padding], className)}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("border-b border-white/5 pb-4 mb-4", className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={cn("text-base font-medium text-platinum", className)}>
      {children}
    </h3>
  );
}

export function CardLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("text-label text-platinum/30", className)}>
      {children}
    </p>
  );
}
