import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-violet-500/20 bg-violet-500/10 text-violet-400",
        secondary: "border-border bg-secondary text-secondary-foreground",
        destructive: "border-red-500/20 bg-red-500/10 text-red-400",
        outline: "border-border text-foreground",
        free: "border-slate-500/20 bg-slate-500/10 text-slate-400",
        pro: "border-violet-500/20 bg-violet-500/10 text-violet-400",
        elite: "border-amber-500/20 bg-amber-500/10 text-amber-400",
        new: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
        trending: "border-orange-500/20 bg-orange-500/10 text-orange-400",
        featured: "border-cyan-500/20 bg-cyan-500/10 text-cyan-400",
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
