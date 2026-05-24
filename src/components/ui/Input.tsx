import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="text-label text-platinum/40 block">
            {label}
          </label>
        )}
        {hint && <p className="text-[10px] font-mono text-platinum/20 -mt-0.5">{hint}</p>}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "form-input w-full px-4 py-3 rounded-sm text-sm transition-all duration-200",
            error && "border-ember/40 bg-ember/5",
            className
          )}
          {...props}
        />
        {error && <p className="text-label text-ember/70">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
