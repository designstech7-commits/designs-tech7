import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, disabled, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-mono tracking-wider uppercase transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed";

    const variants = {
      primary: "bg-acid text-ink hover:bg-acid/90",
      secondary: "border border-white/10 text-platinum/60 hover:border-white/20 hover:text-platinum",
      ghost: "text-platinum/50 hover:text-platinum",
      danger: "border border-ember/30 text-ember/70 hover:border-ember hover:text-ember",
    };

    const sizes = {
      sm: "px-4 py-2 text-[10px]",
      md: "px-6 py-3 text-[11px]",
      lg: "px-8 py-4 text-xs",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 border border-current/30 border-t-current rounded-full animate-spin" />
            Loading…
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
