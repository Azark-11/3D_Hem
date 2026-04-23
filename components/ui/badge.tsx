import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide border transition-colors",
  {
    variants: {
      variant: {
        default: "border-[#ff6b1a] bg-[#ff6b1a]/10 text-[#ff6b1a]",
        secondary: "border-[#2a2a2a] bg-transparent text-[#f5f1e8]",
        destructive: "border-red-600 bg-red-600/10 text-red-400",
        outline: "border-[#2a2a2a] bg-transparent text-[#f5f1e8]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
