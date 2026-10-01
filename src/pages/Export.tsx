import { AppFooter } from "@/components/site/AppFooter";
import { AppHeader } from "@/components/site/AppHeader";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import {
  NODES,
  RANGES,
  rangeHours,
  toCsv,
  toJson,
  type RangeKey,
} from "@/data/measurements";
import { useNow } from "@/hooks/use-now";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

import { useState } from "react";

/**
 * Export — die Messdaten zum Mitnehmen.
 *
 * The files are built in the browser from `src/data/measurements.ts`, the same
 * module the pages read. That is a deliberate substitution rather than an
 * omission: there is no server yet, and a client-side download cannot drift
 * from the screen because it is literally the same function call. When the
 * queries move to Convex, only these two builders change — the selection UI
 * stays.
 *
 * CSV is written in long format (one row per node, timestamp and quantity)
 * because that is what a spreadsheet or a statistics package wants; the wide
 * format with one column per sensor is a presentation choice and belongs in the
 * presentation, not in the raw export.
 */

type Format = "csv" | "json";

function download(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Revoking immediately can cancel the download in some browsers.
  setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

const MIME: Record<Format, string> = {
  csv: "text/csv;charset=utf-8",
  json: "application/json;charset=utf-8",
};

export default function ExportPage() {
  const now = useNow(60_000);
  const [nodeId, setNodeId] = useState(NODES[0].id);
  const [range, setRange] = useState<RangeKey>("24h");
  const node = NODES.find((n) => n.id === nodeId) ?? NODES[0];

  const slug = `${node.id}-${range}`;

  return (
    <div className="min-h-screen">
      <AppHeader />

      <PageHero
        kicker="Export"
        title="Messdaten herunterladen"
        lede="Dieselben Werte, die die Diagramme zeigen — als CSV für Tabellen und als JSON für alles, was programmiert wird. OhneZwischenweg, ohne Anmeldung."
      />

      <main className="mx-auto max-w-3xl px-4 pt-14 pb-20 sm:px-6 sm:pt-16">
        <Reveal>
          <fieldset>
            <legend className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
              Knoten
            </legend>
            <div className="mt-4 flex flex-wrap gap-2">
              {NODES.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => setNodeId(n.id)}
                  aria-pressed={nodeId === n.id}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm transition-colors",
                    nodeId === n.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-foreground/80 hover:border-primary/50",
                  )}
                >
                  {n.name}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-8">
            <legend className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
              Zeitraum
            </legend>
            <div className="mt-4 flex flex-wrap gap-2">
              {RANGES.map((r) => (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => setRange(r.key)}
                  aria-pressed={range === r.key}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm transition-colors",
                    range === r.key
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-foreground/80 hover:border-primary/50",
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </fieldset>
        </Reveal>

        <Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {(["csv", "json"] as const).map((format) => (
              <div key={format} className="border-t border-border pt-5">
                <h2 className="text-lg">
                  {format === "csv" ? "CSV" : "JSON"}
                </h2>
                <p className="mt-1.5 min-h-12 text-sm leading-6 text-muted-foreground">
                  {format === "csv"
                    ? "Langes Format: eine Zeile pro Knoten, Zeitpunkt und Messgröße. Öffnet sich direkt in jeder Tabellenkalkulation."
                    : "Vollständige Messwerte mit Zeitstempel, Empfangsstärke und Batteriestand."}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    download(
                      `${slug}.${format}`,
                      format === "csv"
                        ? toCsv(node.id, range, now)
                        : toJson(node.id, range, now),
                      MIME[format],
                    )
                  }
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  {node.id}-{range}.{format} herunterladen
                </button>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-12 border-t border-border pt-6 text-sm leading-6 text-muted-foreground">
            <p>
              Umfang: {node.name}, {rangeHours(range)} Stunden zurück, erzeugt am{" "}
              {formatDateTime(now)}.
            </p>
            <p className="mt-3">
              Zeitstempel liegen als ISO-8601-String in UTC vor, Zahlen mit Punkt
              als Dezimaltrenner — beim Import in ein Tabellenprogramm unter
              „Dezimaltrennzeichen" also auf Punkt stellen.
            </p>
          </div>
        </Reveal>
      </main>

      <AppFooter />
    </div>
  );
}
