import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Text-based wordmark. The Gujarati name leads, the English name sits
 * beneath it in small caps — no image asset involved.
 */
export function Logo({
  className,
  size = "md",
  onClick,
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}) {
  const s = {
    sm: ["text-[1.15rem]", "text-[0.52rem] tracking-[0.32em]"],
    md: ["text-[1.35rem] sm:text-[1.5rem]", "text-[0.55rem] tracking-[0.34em]"],
    lg: ["text-[2rem]", "text-[0.65rem] tracking-[0.36em]"],
  }[size];

  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label="Hansaben Godadi — home"
      className={cn("group inline-flex flex-col leading-none", className)}
    >
      <span
        className={cn(
          "font-gujarati font-semibold text-clay-600 transition-colors group-hover:text-terracotta-500",
          s[0],
        )}
      >
        હંસાબેન ગોદડી
      </span>
      <span className={cn("mt-1 font-semibold uppercase text-terracotta-400", s[1])}>
        Hansaben
      </span>
    </Link>
  );
}
