import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.09em]",
  {
    variants: {
      variant: {
        default: "border-cream-500 bg-cream-200 text-clay-400",
        terracotta: "border-terracotta-200 bg-terracotta-50 text-terracotta-500",
        leaf: "border-leaf-200 bg-leaf-50 text-leaf-400",
        mustard: "border-mustard-200 bg-mustard-50 text-mustard-400",
        solid: "border-transparent bg-inverse-2 text-on-inverse",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

const PRODUCT_BADGE: Record<string, { label: string; variant: BadgeProps["variant"] }> = {
  bestseller: { label: "Bestseller", variant: "terracotta" },
  new: { label: "New", variant: "leaf" },
  limited: { label: "Limited", variant: "mustard" },
  handloom: { label: "Handloom", variant: "default" },
};

export function ProductBadge({ badge }: { badge?: string }) {
  if (!badge || !PRODUCT_BADGE[badge]) return null;
  const b = PRODUCT_BADGE[badge];
  return (
    <Badge variant={b.variant} className="backdrop-blur bg-opacity-90">
      {b.label}
    </Badge>
  );
}
