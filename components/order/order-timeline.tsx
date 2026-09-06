"use client";

import { Check, Circle, XCircle } from "lucide-react";
import type { Order, OrderStatus } from "@/lib/types";
import { TRACKING_FLOW } from "@/lib/types";
import { useT } from "@/components/i18n/language-provider";
import { cn, formatDateTime } from "@/lib/utils";

export function OrderTimeline({
  order,
  compact = false,
}: {
  order: Order;
  compact?: boolean;
}) {
  const tr = useT();
  const done = new Map(order.timeline.map((t) => [t.status, t]));
  const cancelled = order.status === "cancelled";
  const currentIndex = cancelled ? -1 : TRACKING_FLOW.indexOf(order.status);

  const steps = cancelled
    ? (["pending_payment", "cancelled"] as OrderStatus[])
    : TRACKING_FLOW;

  return (
    <ol className="relative">
      {steps.map((s, i) => {
        const event = done.get(s);
        const isDone = !!event;
        const isCurrent = !cancelled && i === currentIndex;
        const isLast = i === steps.length - 1;
        const isCancel = s === "cancelled";

        return (
          <li key={s} className="relative flex gap-4 pb-7 last:pb-0">
            {/* connector */}
            {!isLast && (
              <span
                aria-hidden
                className={cn(
                  "absolute left-[0.86rem] top-7 -bottom-0 w-0.5",
                  isDone && !isCurrent ? "bg-leaf-300" : "bg-cream-500",
                )}
              />
            )}

            {/* dot */}
            <span
              aria-hidden
              className={cn(
                "relative z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 transition-colors",
                isCancel
                  ? "border-rose-300 bg-rose-300 text-on-accent"
                  : isCurrent
                    ? "border-terracotta-500 bg-terracotta-500 text-on-accent"
                    : isDone
                      ? "border-leaf-300 bg-leaf-300 text-on-accent"
                      : "border-cream-500 bg-cream-100 text-cream-500",
              )}
            >
              {isCancel ? (
                <XCircle className="h-4 w-4" />
              ) : isCurrent ? (
                <span className="h-2.5 w-2.5 rounded-full bg-cream-50" />
              ) : isDone ? (
                <Check className="h-4 w-4" strokeWidth={3} />
              ) : (
                <Circle className="h-2.5 w-2.5" />
              )}
            </span>

            {isCurrent && (
              <span
                aria-hidden
                className="absolute left-0 top-0 h-7 w-7 animate-ping rounded-full bg-terracotta-300/40"
              />
            )}

            <div className={cn("min-w-0 flex-1", isLast ? "pb-0" : "-mt-0.5")}>
              <p
                className={cn(
                  "font-display text-[1rem] leading-snug",
                  isDone || isCurrent ? "text-clay-600" : "text-clay-200",
                )}
              >
                {tr.step[s]}
              </p>
              {event ? (
                <p className="mt-0.5 text-[0.8rem] tabular-nums text-clay-400">
                  {formatDateTime(event.at)}
                </p>
              ) : (
                <p className="mt-0.5 text-[0.8rem] text-clay-200">{tr.track.pending}</p>
              )}
              {!compact && (isDone || isCurrent) && (
                <p className="mt-1 text-[0.8rem] leading-relaxed text-clay-300">
                  {tr.stepNote[s]}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
