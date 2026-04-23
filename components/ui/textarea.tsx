import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full border border-[#2a2a2a] bg-[#0a0a0a] px-3 py-2 text-sm text-[#f5f1e8] placeholder:text-[#666] focus:outline-none focus:border-[#ff6b1a] focus:ring-1 focus:ring-[#ff6b1a] disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-y",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
