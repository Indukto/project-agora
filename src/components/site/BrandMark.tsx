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
        <rect
          x="1"
          y="1"
          width="30"
          height="30"
          rx="9"
          className="fill-primary/15 stroke-primary/40"
          strokeWidth="1.5"
        />
        <circle cx="10.5" cy="21.5" r="2.2" className="fill-primary" />
        <path
          d="M15.5 17.5a8.2 8.2 0 0 1 2.4 5.8"
          className="stroke-primary"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M19.8 13.2a14.3 14.3 0 0 1 4.2 10.1"
          className="stroke-primary/60"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M24.1 8.9a20.4 20.4 0 0 1 6 14.4"
          className="stroke-primary/30"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      {!compact && (
        <span className="font-display text-lg font-semibold tracking-tight">
          Project&nbsp;<span className="text-primary">Agora</span>
        </span>
      )}
    </span>
  );
}
