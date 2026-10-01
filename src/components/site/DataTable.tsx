import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * A quiet table: a ruled header, hairline rows, nothing filled in.
 *
 * Built on the native `<table>` so the CSV export and the on-screen rows read
 * the same fields in the same order. The wrapper scrolls horizontally on small
 * screens rather than hiding columns, because on a phone the useful answer is
 * to swipe, not to lose the SNR column.
 */

export function DataTable({
  head,
  children,
  className,
  caption,
}: {
  head: string[];
  children: ReactNode;
  className?: string;
  caption?: string;
}) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full min-w-[640px] border-collapse text-sm">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr className="border-b border-border">
            {head.map((label, i) => (
              <th
                key={label}
                scope="col"
                className={cn(
                  "py-3 pr-4 text-xs font-normal tracking-[0.12em] text-muted-foreground uppercase",
                  i === 0 ? "text-left" : "text-right",
                )}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function DataRow({
  cells,
  className,
}: {
  cells: ReactNode[];
  className?: string;
}) {
  return (
    <tr className={cn("border-b border-border/60", className)}>
      {cells.map((cell, i) => (
        <td
          key={i}
          className={cn(
            "py-3 pr-4 align-baseline",
            i === 0
              ? "text-left text-foreground"
              : "text-right tabular-nums text-foreground/85",
          )}
        >
          {cell}
        </td>
      ))}
    </tr>
  );
}
