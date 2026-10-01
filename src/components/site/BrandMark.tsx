import { cn } from "@/lib/utils";

/** Project Agora brand: concentric signal arcs (a LoRa burst) + wordmark. */
export function BrandMark({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        viewBox="0 0 32 32"
        className="size-7 shrink-0"
        aria-hidden="true"
        fill="none"
      >
        <circle cx="11" cy="21" r="2.4" className="fill-primary" />
        <path
          d="M15.5 16.5a8.2 8.2 0 0 1 2.4 5.8"
          className="stroke-primary"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M19.8 12.2a14.3 14.3 0 0 1 4.2 10.1"
          className="stroke-primary/55"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M24.1 7.9a20.4 20.4 0 0 1 6 14.4"
          className="stroke-primary/25"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
      {!compact && (
        <span className="text-lg font-medium tracking-tight">
          Project&nbsp;<span className="text-primary">Agora</span>
        </span>
      )}
    </span>
  );
}
