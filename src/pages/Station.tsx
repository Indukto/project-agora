import { ArchitectureDiagram } from "@/components/data/ArchitectureDiagram";
import { AppFooter } from "@/components/site/AppFooter";
import { AppHeader } from "@/components/site/AppHeader";
import { Figure, FigureGrid } from "@/components/site/Figure";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { NODES, STATION } from "@/data/fixtures";
import { useNow } from "@/hooks/use-now";
import { getLive } from "@/data/measurements";
import { formatDateTime } from "@/lib/format";
import { Link } from "react-router";

/**
 * Funkstation — the hardware on the roof, and how a measurement travels.
 *
 * The live figures at the top are pulled from the same reading the live page
 * shows, so this page describes the station in its current state rather than in
 * a state frozen at some point during the build.
 */

const SPECS: [string, string][] = [
  ["Position", "Dach des Hauptgebäudes"],
  ["Höhe", `${STATION.elevationM} m ü. NN`],
  ["Gerät", STATION.gatewayModel],
  ["Antenne", STATION.antenna],
  ["Frequenz", `${STATION.frequencyMhz.toLocaleString("de-DE")} MHz (EU 868)`],
  ["Aufgebaut", formatDateTime(STATION.installedAt)],
  ["Knoten", `${NODES.length} Stück`],
];

export default function Station() {
  const now = useNow(30_000);
  const live = getLive(now);
  const worst = live.reduce((a, b) => (a.rssi <= b.rssi ? a : b));

  return (
    <div className="min-h-screen">
      <AppHeader />

      <PageHero
        kicker="Funkstation"
        title="Die Station an der Schule"
        lede="Auf dem Dach steht das Gateway, das die Uplinks aller Knoten empfängt. Von hier aus beginnt der Weg einer Messung bis zur Webseite."
      />

      <main className="mx-auto max-w-6xl px-4 pt-14 pb-20 sm:px-6 sm:pt-16">
        <Reveal>
          <p className="max-w-2xl text-base leading-8 text-muted-foreground">
            {STATION.description}
          </p>
        </Reveal>

        <Reveal>
          <FigureGrid columns={4} className="mt-12">
            <Figure
              variant="ticking"
              label="Schwächste Verbindung"
              value={worst.rssi}
              unit="dBm"
              detail={worst.nodeName}
            />
            <Figure
              variant="ticking"
              label="Knoten online"
              value={live.length}
              unit={`von ${NODES.length}`}
            />
            <Figure
              label="Übertragungsrate"
              value="0,3–2,5"
              unit="kbit/s"
              detail="je nach Spreading Factor"
            />
            <Figure
              label="Duty Cycle"
              value="≤ 1"
              unit="%"
              detail="gesetzlicher Grenzwert, 868 MHz"
            />
          </FigureGrid>
        </Reveal>

        <Reveal>
          <section className="mt-16">
            <h2 className="text-xl">Technische Daten</h2>
            <dl className="mt-6 max-w-2xl">
              {SPECS.map(([term, detail], i) => (
                <div
                  key={term}
                  className={`flex flex-wrap justify-between gap-x-6 gap-y-1 border-b border-border py-3.5 ${
                    i === 0 ? "border-t" : ""
                  }`}
                >
                  <dt className="text-sm text-muted-foreground">{term}</dt>
                  <dd className="text-sm">{detail}</dd>
                </div>
              ))}
            </dl>
          </section>
        </Reveal>

        <Reveal>
          <section className="mt-16">
            <h2 className="text-xl">Der Weg einer Messung</h2>
            <p className="mt-2 mb-10 max-w-2xl text-sm leading-6 text-muted-foreground">
              Fünf Stufen, jede mit einer klaren Aufgabe. Der häufigste Irrtum in der
              Präsentation ist übrigens Stufe zwei: das Gateway leitet nur weiter — es
              entscheidet nichts über die Daten.
            </p>
            <ArchitectureDiagram />
          </section>
        </Reveal>

        <Reveal>
          <section className="mt-16 border-t border-border pt-10">
            <h2 className="text-xl">Energie und Betrieb</h2>
            <div className="mt-5 grid gap-x-8 gap-y-6 sm:grid-cols-2">
              <p className="text-sm leading-7 text-muted-foreground">
                Die Knoten arbeiten auf Batteriestrom und schlafen zwischen den
                Sendungen. Der Verbrauch hängt fast nur am Spreading Factor: dieselbe
                Nutzlast dauert auf SF11 rund zehnmal so lange wie auf SF7, dafür
                weiter. Der Schulgarten steht deshalb auf SF11, der Dachmesspunkt
                auf SF7 — die Rechnung steht in den{" "}
                <Link
                  to="/range"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Reichweitenvergleichen
                </Link>
                .
              </p>
              <p className="text-sm leading-7 text-muted-foreground">
                Im Europäischen ISM-Band 868 MHz gilt ein Duty-Cycle-Limit von
                einem Prozent. Das Gateway selbst sendet nicht, sondern empfängt
                nur — das Limit betrifft die Knoten, und genau deshalb senden sie
                seltener und dafür länger.
              </p>
            </div>
          </section>
        </Reveal>
      </main>

      <AppFooter />
    </div>
  );
}
