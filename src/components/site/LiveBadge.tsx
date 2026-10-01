import { formatAge, freshness } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * How recently a node last transmitted, coloured by how far behind it is.
 *
 * The rule itself lives in `@/lib/format` next to `formatAge` — it is a
 * statement about the data's cadence, not about this component.
 */
export function LiveBadge({
  ageMs,
  intervalMs,
  className,
}: {
  ageMs: number;
  intervalMs: number;
  className?: string;
}) {
  const state = freshness(ageMs, intervalMs);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-xs tracking-[0.1em] uppercase",
        state === "live" && "text-success",
        state === "delayed" && "text-foreground/70",
        state === "stale" && "text-destructive",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "size-1.5 rounded-full",
          state === "live" && "bg-success",
          state === "delayed" && "bg-foreground/40",
          state === "stale" && "bg-destructive",
        )}
      />
      {formatAge(ageMs)}
    </span>
  );
}
