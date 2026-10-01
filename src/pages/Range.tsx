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
import { useState } from "react";

const presetColor: Record<RangeRecord["preset"], string> = {
  "Long Fast": "bg-primary",
  "Long Slow": "bg-[#7d5260]",
  "Medium Fast": "bg-[#6750a4]",
  "Very Long": "bg-[#b58392]",
};

const bandTone: Record<RangeRecord["band"], string> = {
  "868 MHz": "text-primary border-primary/30 bg-primary/10",
  "915 MHz": "text-[#6750a4] border-[#6750a4]/30 bg-[#6750a4]/10",
  "433 MHz": "text-[#7d5260] border-[#7d5260]/30 bg-[#7d5260]/10",
};

export default function Range() {
  const [band, setBand] = useState<"All" | RangeRecord["band"]>("All");
  const [terrain, setTerrain] = useState<(typeof terrainTypes)[number]>("All");

  const visible = rangeRecords
    .filter((r) => band === "All" || r.band === band)
    .filter((r) => terrain === "All" || r.terrain === terrain)
    .sort((a, b) => b.rangeKm - a.rangeKm);

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 pt-32 pb-20 sm:px-6">
        <h1 className="text-4xl font-normal tracking-tight">
          Range comparisons
        </h1>
        <p className="mt-3 max-w-xl leading-7 text-muted-foreground">
          Every record is a measured median with its conditions attached —
          radio, antenna, preset, terrain, and the caveats that would
          otherwise be quietly omitted.
        </p>

        {/* Filters */}
        <div className="mt-8 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
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
                    ? "bg-secondary-container text-secondary-container-foreground"
                    : "border border-input text-foreground/75 hover:bg-muted",
                )}
              >
                {b}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Terrain
            </span>
            {terrainTypes.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTerrain(t)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  terrain === t
                    ? "bg-secondary-container text-secondary-container-foreground"
                    : "border border-input text-foreground/75 hover:bg-muted",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          {Object.entries(presetColor).map(([preset, cls]) => (
            <span key={preset} className="flex items-center gap-1.5">
              <span className={cn("size-2.5 rounded-full", cls)} />
              {preset}
            </span>
          ))}
        </div>

        {/* Chart rows */}
        <div className="mt-6 space-y-3">
          {visible.map((r) => (
            <article
              key={`${r.radio}-${r.role}-${r.terrain}-${r.band}-${r.preset}`}
              className="rounded-3xl border border-border bg-surface-1 p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className={bandTone[r.band]}>
                    {r.band}
                  </Badge>
                  <Badge variant="outline">{r.preset}</Badge>
                  <Badge variant="outline">{r.terrain}</Badge>
                </div>
                <p className="text-2xl font-medium text-primary">
                  {r.rangeKm.toLocaleString("en", { maximumFractionDigits: 1 })}
                  <span className="ml-1 text-sm font-normal text-muted-foreground">
                    km
                  </span>
                </p>
              </div>

              <div className="mt-3">
                <p className="font-medium">{r.radio}</p>
                <p className="text-sm text-muted-foreground">
                  {r.role} · {r.antenna}
                </p>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-3">
                <div
                  className={cn("h-full rounded-full", presetColor[r.preset])}
                  style={{ width: `${(r.rangeKm / maxRangeKm) * 100}%` }}
                />
              </div>

              <p className="mt-3 text-xs leading-5 text-muted-foreground">
                {r.conditions}
              </p>
            </article>
          ))}
        </div>

        {visible.length === 0 && (
          <p className="mt-8 rounded-2xl border border-border bg-surface-1 p-8 text-center text-muted-foreground">
            No field records match that combination yet. Try widening the
            filters.
          </p>
        )}
      </main>
      <AppFooter />
    </div>
  );
}
