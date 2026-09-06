import { cva, type VariantProps } from "class-variance-authority";

/**
 * Kept in its own module (no "use client") so server components can style
 * links with the same recipe the Button component uses.
 */
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 active:scale-[.98] select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-terracotta-500 text-on-accent shadow-soft hover:bg-terracotta-600 hover:shadow-lift",
        secondary: "bg-inverse-2 text-on-inverse hover:bg-inverse shadow-soft",
        outline:
          "border border-clay-200 bg-transparent text-clay-500 hover:border-clay-400 hover:bg-cream-200",
        ghost: "text-clay-500 hover:bg-cream-300",
        subtle: "bg-cream-300 text-clay-500 hover:bg-cream-400",
        link: "text-terracotta-500 underline-offset-4 hover:underline rounded-none px-0",
        danger: "bg-rose-300 text-on-accent hover:bg-rose-400 shadow-soft",
      },
      size: {
        sm: "h-9 px-4 text-[0.8rem]",
        md: "h-11 px-6 text-sm",
        lg: "h-[3.25rem] px-8 text-[0.95rem]",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
      },
      full: { true: "w-full", false: "" },
    },
    defaultVariants: { variant: "primary", size: "md", full: false },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
