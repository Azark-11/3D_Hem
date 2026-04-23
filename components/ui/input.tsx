import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full border border-[#2a2a2a] bg-[#0a0a0a] px-3 py-2 text-sm text-[#f5f1e8] placeholder:text-[#666] focus:outline-none focus:border-[#ff6b1a] focus:ring-1 focus:ring-[#ff6b1a] disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
