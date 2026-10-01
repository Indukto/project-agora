import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * Long-form layout for the German knowledge pages.
 *
 * The site's reading measure is roughly 70 characters; anything wider is fine
 * for a chart and unreadable for a paragraph. So the prose column is capped
 * separately from the page column — a chart or a table can still run to
 * `max-w-6xl` while the sentences around it stay at a comfortable width.
 *
 * Section headings carry a hanging rule rather than sitting in a card, which
 * keeps the reading rhythm continuous from one page to the next.
 */

export function Prose({
  children,
  className,
  wide = false,
}: {
  children: ReactNode;
  className?: string;
  /** Let a table or figure run wider than the reading measure. */
  wide?: boolean;
}) {
  return (
    <div
      className={cn(
        wide ? "max-w-4xl" : "max-w-2xl",
        "text-[15px] leading-7 text-foreground/85",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function ArticleSection({
  title,
  children,
  lead,
  className,
}: {
  title?: string;
  children: ReactNode;
  lead?: string;
  className?: string;
}) {
  return (
    <section className={cn("border-t border-border pt-8", className)}>
      {title && <h2 className="text-2xl">{title}</h2>}
      {lead && (
        <p className="mt-2 text-base leading-7 text-muted-foreground">{lead}</p>
      )}
      <div className={cn("mt-5 space-y-4", title ? "" : "mt-0")}>{children}</div>
    </section>
  );
}

/** A key/value pair, used wherever the prose needs a spec without a full table. */
export function FactList({ items }: { items: [string, string][] }) {
  return (
    <dl className="divide-y divide-border border-y border-border">
      {items.map(([term, detail]) => (
        <div
          key={term}
          className="flex flex-wrap justify-between gap-x-6 gap-y-1 py-3"
        >
          <dt className="text-sm text-muted-foreground">{term}</dt>
          <dd className="text-sm">{detail}</dd>
        </div>
      ))}
    </dl>
  );
}
