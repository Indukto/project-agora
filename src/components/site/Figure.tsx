import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * A number, set like a figure in a report — not a card.
 *
 * The site's vocabulary is hairlines and open paper, so a measurement gets a
 * label, a large value and a quiet caption, separated from its neighbours by a
 * single rule. There is deliberately no box, no shadow and no fill: the lagoon
 * paper in `src/index.css` is the surface, and covering it is what the README
 * warns against.
 *
 * `variant="ticking"` switches to the sans face with tabular figures. The
 * display serif does not offer tabular figures, so a value that rewrites every
 * few seconds visibly jitters in it — which is exactly the wrong signal on a
 * page whose job is to say whether a number changed.
 */

export function Figure({
  label,
  value,
  unit,
  detail,
  variant = "display",
  className,
}: {
  label: string;
  value: ReactNode;
  unit?: string;
  detail?: ReactNode;
  variant?: "display" | "ticking";
  className?: string;
}) {
  return (
    <div className={cn("border-t border-border pt-4", className)}>
      <p className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
        {label}
      </p>
      <p
        className={cn(
          "mt-2 flex items-baseline gap-1.5 leading-none",
          variant === "display"
            ? "font-display text-4xl tracking-tight sm:text-5xl"
            : "font-sans text-4xl font-light tabular-nums tracking-tight sm:text-5xl",
        )}
      >
        {value}
        {unit && (
          <span className="text-lg text-muted-foreground sm:text-xl">{unit}</span>
        )}
      </p>
      {detail && (
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{detail}</p>
      )}
    </div>
  );
}

/** Figures laid out as a ledger: one rule above each, columns on wide screens. */
export function FigureGrid({
  children,
  columns = 4,
  className,
}: {
  children: ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-x-8 gap-y-7",
        columns === 2 && "sm:grid-cols-2",
        columns === 3 && "sm:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "sm:grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
