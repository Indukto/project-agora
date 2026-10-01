import { Badge } from "@/components/ui/badge";
import { AppHeader } from "@/components/site/AppHeader";
import { AppFooter } from "@/components/site/AppFooter";
import {
  bands,
  maxRangeKm,
  rangeRecords,
  terrainTypes,
  type RangeRecord,
} from "@/data/range";
import { cn } from "@/lib/utils";
import { Mountain, Ruler, TriangleAlert } from "lucide-react";
import { useMemo, useState } from "react";

const presetColor: Record<RangeRecord["preset"], string> = {
  "Long Fast": "bg-primary",
  "Long Slow": "bg-[oklch(0.82_0.17_155)]",
  "Medium Fast": "bg-[oklch(0.68_0.16_280)]",
  "Very Long": "bg-[oklch(0.7_0.13_85)]",
};

const bandTone: Record<RangeRecord["band"], string> = {
  "868 MHz": "text-primary border-primary/25 bg-primary/10",
  "915 MHz": "text-[oklch(0.8_0.14_300)] border-[oklch(0.8_0.14_300)]/25 bg-[oklch(0.8_0.14_300)]/10",
  "433 MHz": "text-[oklch(0.82_0.17_155)] border-[oklch(0.82_0.17_155)]/25 bg-[oklch(0.82_0.17_155)]/10",
};

export default function Range() {
  const [band, setBand] = useState<"All" | RangeRecord["band"]>("All");
  const [terrain, setTerrain] = useState<(typeof terrainTypes)[number]>("All");

  const visible = useMemo(
    () =>
      rangeRecords
        .filter((r) => band === "All" || r.band === band)
        .filter((r) => terrain === "All" || r.terrain === terrain)
        .sort((a, b) => b.rangeKm - a.rangeKm),
    [band, terrain],
  );

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="pt-28">
        <section className="mesh-gradient mesh-grain relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(110%_100%_at_50%_0%,oklch(0.22_0.04_190)_0%,var(--background)_72%)]" />
          <div className="mesh-blob animate-drift-a top-[-70%] right-[-12%] size-[30rem] bg-[oklch(0.5_0.14_170/0.3)]" />
          <div className="relative z-[2] mx-auto max-w-6xl px-4 pb-12 sm:px-6">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              <Mountain className="size-3.5" />
              Field range comparisons
            </p>
            <h1 className="mt-3 max-w-2xl text-balance font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Range, with the fine print attached
            </h1>
            <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
              Every record is a field-reported median from partner networks —
              radio, antenna, preset, terrain and the caveats that would
              otherwise be quietly omitted.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          {/* Filters */}
          <div className="mb-8 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Band
              </span>
              {(["All", ...bands] as const).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBand(b)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    band === b
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-surface-1 text-foreground/75 hover:bg-primary/10 hover:text-foreground",
                  )}
                >
                  {b}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Terrain
              </span>
              {terrainTypes.map((t) => (
                <button
                  type="button"
                  onClick={() => setTerrain(t)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    terrain === t
                      ? "bg-primary text-primary-foreground"
                    : "border border-border bg-surface-1 text-foreground/75 hover:bg-primary/10 hover:text-foreground",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mb-6 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Ruler className="size-3.5 text-primary" />
              Bar length = median field range
            </span>
            {Object.entries(presetColor).map(([preset, cls]) => (
              <span key={preset} className="flex items-center gap-1.5">
                <span className={cn("size-2.5 rounded-full", cls)} />
                {preset}
              </span>
            ))}
          </div>

          {/* Chart rows */}
          <div className="space-y-3">
            {visible.map((r) => (
              <article
                key={`${r.radio}-${r.role}-${r.terrain}-${r.band}-${r.preset}`}
                className="rounded-3xl border border-border/70 bg-surface-1 p-5 transition-colors hover:border-primary/25"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className={bandTone[r.band]}>
                      {r.band}
                    </Badge>
                    <Badge variant="outline">{r.preset}</Badge>
                    <Badge variant="outline">{r.terrain}</Badge>
                  </div>
                  <p className="font-display text-2xl font-semibold tracking-tight text-primary">
                    {r.rangeKm.toLocaleString("en", { maximumFractionDigits: 1 })}
                    <span className="ml-1 text-sm font-medium text-muted-foreground">km</span>
                  </p>
                </div>

                <div className="mt-3">
                  <p className="font-medium">{r.radio}</p>
                  <p className="text-sm text-muted-foreground">
                    {r.role} · {r.antenna}
                  </p>
                </div>

                <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-surface-3">
                  <div
                    className={cn("h-full rounded-full", presetColor[r.preset])}
                    style={{ width: `${(r.rangeKm / maxRangeKm) * 100}%` }}
                  />
                </div>

                <p className="mt-3.5 flex gap-2 text-xs leading-5 text-muted-foreground">
                  <TriangleAlert className="mt-0.5 size-3.5 shrink-0 text-muted-foreground/60" />
                  {r.conditions}
                </p>
              </article>
            ))}
          </div>

          {visible.length === 0 && (
            <p className="rounded-2xl border border-border bg-surface-1 p-8 text-center text-muted-foreground">
              No field records match that combination yet — partners are
              measuring. Try widening the filters.
            </p>
          )}
        </section>
      </main>
      <AppFooter />
    </div>
  );
}
