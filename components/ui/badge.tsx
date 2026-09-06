"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useT } from "@/components/i18n/language-provider";

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

const BADGE_VARIANT: Record<string, BadgeProps["variant"]> = {
  bestseller: "terracotta",
  new: "leaf",
  limited: "mustard",
  handloom: "default",
};

export function ProductBadge({ badge }: { badge?: string }) {
  const t = useT();
  if (!badge || !BADGE_VARIANT[badge]) return null;
  return (
    <Badge variant={BADGE_VARIANT[badge]} className="backdrop-blur bg-opacity-90">
      {t.badges[badge as keyof typeof t.badges]}
    </Badge>
  );
}
