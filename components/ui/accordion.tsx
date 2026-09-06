"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

export function Accordion({
  items,
  defaultOpen,
  allowMultiple = false,
  className,
  itemClassName,
}: {
  items: AccordionItem[];
  defaultOpen?: string[];
  allowMultiple?: boolean;
  className?: string;
  itemClassName?: string;
}) {
  const [open, setOpen] = React.useState<string[]>(defaultOpen ?? []);

  const toggle = (id: string) =>
    setOpen((cur) =>
      cur.includes(id)
        ? cur.filter((x) => x !== id)
        : allowMultiple
          ? [...cur, id]
          : [id],
    );

  return (
    <div className={cn("divide-y divide-cream-400", className)}>
      {items.map((item) => {
        const isOpen = open.includes(item.id);
        return (
          <div key={item.id} className={itemClassName}>
            <h3>
              <button
                type="button"
                onClick={() => toggle(item.id)}
                aria-expanded={isOpen}
                aria-controls={`acc-${item.id}`}
                className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-terracotta-500"
              >
                <span className="font-display text-[1.05rem] leading-snug text-clay-600">
                  {item.title}
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-clay-300 transition-transform duration-300",
                    isOpen && "rotate-180 text-terracotta-500",
                  )}
                  aria-hidden
                />
              </button>
            </h3>
            <div
              id={`acc-${item.id}`}
              hidden={!isOpen}
              className="animate-fade-in pb-5 pr-8 text-[0.92rem] leading-relaxed text-clay-400"
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
