"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

const base =
  "w-full rounded-xl border bg-card px-4 text-sm text-ink placeholder:text-clay-200 transition-colors focus:border-terracotta-300 focus:outline-none focus:ring-2 focus:ring-terracotta-200/70 disabled:bg-cream-200";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }
>(({ className, invalid, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      base,
      "h-12",
      invalid ? "border-rose-300 focus:border-rose-300 focus:ring-rose-100" : "border-cream-500",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }
>(({ className, invalid, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      base,
      "min-h-[7.5rem] py-3 leading-relaxed",
      invalid ? "border-rose-300" : "border-cream-500",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <div className="relative">
    <select
      ref={ref}
      className={cn(
        base,
        "h-11 appearance-none border-cream-500 pr-10 cursor-pointer",
        className,
      )}
      {...props}
    >
      {children}
    </select>
    <svg
      className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-clay-300"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
    >
      <path
        d="m5 7.5 5 5 5-5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
));
Select.displayName = "Select";

export function Field({
  label,
  htmlFor,
  error,
  hint,
  required,
  className,
  children,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="block text-[0.78rem] font-medium text-clay-400"
      >
        {label}
        {required && <span className="ml-0.5 text-terracotta-400">*</span>}
      </label>
      {children}
      {error ? (
        <p className="flex items-center gap-1.5 text-[0.75rem] text-rose-300">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      ) : hint ? (
        <p className="text-[0.75rem] text-clay-300">{hint}</p>
      ) : null}
    </div>
  );
}
