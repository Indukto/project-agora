import { StationMap } from "@/components/data/StationMap";
import { AppFooter } from "@/components/site/AppFooter";
import { AppHeader } from "@/components/site/AppHeader";
import { Figure } from "@/components/site/Figure";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { distanceFromStation, KIND_LABEL, NODES, STATION } from "@/data/fixtures";
import { formatNumber } from "@/lib/format";

/**
 * Karte — wo die Station steht und wie weit die Knoten entfernt sind.
 *
 * The distances are computed with the same `distanceM` the link budget uses, so
 * the number in the table is the number that fed the RSSI model on the live
 * page. One function, two pages, no chance of the two disagreeing.
 */

export default function MapPage() {
  return (
    <div className="min-h-screen">
      <AppHeader />

      <PageHero
        kicker="Karte"
        title="Station und Sensorknoten"
        lede="Das Gateway steht auf dem Dach, die Knoten verteilen sich über den Campus. Die Karte entsteht aus denselben Koordinaten, aus denen auch die Funkstärke berechnet wird."
      />

      <main className="mx-auto max-w-6xl px-4 pt-14 pb-20 sm:px-6 sm:pt-16">
        <Reveal>
          <StationMap />
        </Reveal>

        <Reveal>
          <section className="mt-16">
            <h2 className="text-xl">Knoten im Überblick</h2>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {["Knoten", "Art", "Entfernung", "SF", "Reichweite", "Airtime"].map(
                      (label, i) => (
                        <th
                          key={label}
                          scope="col"
                          className={
                            i === 0 || i === 1
                              ? "py-3 pr-4 text-left text-xs font-normal tracking-[0.12em] text-muted-foreground uppercase"
                              : "py-3 pr-4 text-right text-xs font-normal tracking-[0.12em] text-muted-foreground uppercase"
                          }
                        >
                          {label}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {NODES.map((node) => {
                    const m = distanceFromStation(node.lat, node.lng);
                    return (
                      <tr key={node.id} className="border-b border-border/60">
                        <td className="py-3.5 pr-4">{node.name}</td>
                        <td className="py-3.5 pr-4 text-muted-foreground">
                          {KIND_LABEL[node.kind]}
                        </td>
                        <td className="py-3.5 pr-4 text-right tabular-nums">
                          {formatNumber(m)} m
                        </td>
                        <td className="py-3.5 pr-4 text-right tabular-nums">
                          SF{node.spreadingFactor}
                        </td>
                        <td className="py-3.5 pr-4 text-right tabular-nums">
                          {formatNumber(STATION.rangeBySf[node.spreadingFactor] / 1000, 1)} km
                        </td>
                        <td className="py-3.5 pr-4 text-right tabular-nums text-muted-foreground">
                          {node.bandwidthKhz} kHz
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="mt-16 grid gap-8 border-t border-border pt-10 sm:grid-cols-3">
            <Figure
              label="Standort"
              value={`${formatNumber(STATION.lat, 1)}° N`}
              detail={`${formatNumber(STATION.lng, 1)}° O · ${STATION.elevationM} m ü. NN`}
            />
            <Figure
              label="Frequenz"
              value={formatNumber(STATION.frequencyMhz, 1)}
              unit="MHz"
              detail="Europäisches ISM-Band, 868 MHz"
            />
            <Figure
              label="Knoten"
              value={formatNumber(NODES.length)}
              unit="Stück"
              detail={`${STATION.gatewayModel}`}
            />
          </section>
        </Reveal>

        <p className="mt-12 border-t border-border pt-6 text-sm leading-6 text-muted-foreground">
          Die Koordinaten in{" "}
          <code className="font-mono text-[13px]">src/data/fixtures.ts</code> sind
          Platzhalter. Für den endgültigen Betrieb werden sie durch die tatsächlichen
          Standorte ersetzt — Funkstärke, Reichweiten und diese Karte rechnen dann
          automatisch neu.
        </p>
      </main>

      <AppFooter />
    </div>
  );
}
