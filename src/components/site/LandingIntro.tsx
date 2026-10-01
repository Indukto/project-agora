import { AppFooter } from "@/components/site/AppFooter";
import { Figure, FigureGrid } from "@/components/site/Figure";
import { Reveal } from "@/components/site/Reveal";
import { STATION } from "@/data/fixtures";
import { getLive, getWorstLink, NODES } from "@/data/measurements";
import { useNow } from "@/hooks/use-now";
import { formatAge, formatNumber } from "@/lib/format";
import { ArrowUpRight } from "lucide-react";

import { Link } from "react-router";

/**
 * What sits below the hero: the German project content.
 *
 * The hero keeps its two links and almost no words, so everything a first
 * visitor actually needs to know happens after the artwork. The three figures
 * are real readings, not a marketing stat — the same numbers the live page
 * shows, which is the point of the site.
 *
 * The page keeps scrolling into the documentation it grew out of rather than
 * pretending the school project replaced it.
 */

const entries = [
  {
    to: "/live",
    title: "Live-Daten",
    caption: "Was die Station gerade empfängt, mit Alter jeder Messung",
  },
  {
    to: "/karte",
    title: "Karte",
    caption: "Station, Sensorknoten und ihre Reichweiten",
  },
  {
    to: "/statistiken",
    title: "Statistiken",
    caption: "Verlauf, Kennzahlen und das Funkprotokoll",
  },
  {
    to: "/lorawan",
    title: "LoRaWAN",
    caption: "Uplink, Downlink, ALOHA und die Luftzeit-Rechnung",
  },
  {
    to: "/funktechnik",
    title: "Funktechnik",
    caption: "Frequenz, Spreading Factor und Link-Budget",
  },
  {
    to: "/glossar",
    title: "Glossar",
    caption: "Die Begriffe entlang des Signalwegs erklärt",
  },
];

const LINK_CLASS =
  "group flex items-start justify-between gap-6 border-b border-border py-5 transition-colors hover:border-primary/60";

export function LandingIntro() {
  const now = useNow(10_000);
  const live = getLive(now);
  const worst = getWorstLink(now);
  const warmest = live.reduce((a, b) =>
    (a.temperatureC ?? -99) >= (b.temperatureC ?? -99) ? a : b,
  );

  return (
    <>
      <main className="mx-auto max-w-6xl px-4 pt-16 pb-20 sm:px-6 sm:pt-20">
        <Reveal>
          <section className="max-w-2xl">
            <h2 className="text-3xl">Was ist AGORA?</h2>
            <div className="mt-5 space-y-4 text-[15px] leading-7 text-foreground/85">
              <p>
                Auf dem Dach unserer Schule steht eine LoRaWAN-Funkstation. Vier
                Sensorknoten auf dem Campus messen Temperatur, Feuchte und
                Bodenfeuchte und funken ihre Werte alle paar Minuten an das
                Gateway — bei einer Sendeleistung von 14 dBm und einer
                Batterie, die ein Schuljahr reichen soll.
              </p>
              <p>
                Diese Website zeigt, was bei uns ankommt. Jede Zahl auf den
                Seiten zu Live-Daten, Statistik und Karte stammt aus einem
                Uplink; nichts davon wird in der Oberfläche erzeugt, gerundet
                oder schöngerechnet. Wo ein Knoten einmal nicht gesendet hat,
                steht eine Lücke — und keine ausgedachte Kurve.
              </p>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="mt-16">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <h2 className="text-xl">Gerade eben empfangen</h2>
              <Link
                to="/live"
                className="text-sm text-primary underline-offset-4 hover:underline"
              >
                Alle Werte ansehen
              </Link>
            </div>

            <FigureGrid columns={4} className="mt-7">
              <Figure
                variant="ticking"
                label="Höchste Temperatur"
                value={
                  warmest.temperatureC === null
                    ? "—"
                    : formatNumber(warmest.temperatureC, 1)
                }
                unit="°C"
                detail={warmest.nodeName}
              />
              <Figure
                variant="ticking"
                label="Schwächste Verbindung"
                value={formatNumber(worst.rssi)}
                unit="dBm"
                detail={`SNR ${formatNumber(worst.snr, 1)} dB`}
              />
              <Figure
                variant="ticking"
                label="Knoten"
                value={formatNumber(live.length)}
                unit={`von ${NODES.length}`}
                detail={formatAge(Math.max(...live.map((l) => l.ageMs)))}
              />
              <Figure
                label="Sendefrequenz"
                value={formatNumber(STATION.frequencyMhz, 1)}
                unit="MHz"
                detail={`${STATION.gatewayModel.split(" /")[0]}`}
              />
            </FigureGrid>
          </section>
        </Reveal>

        <Reveal>
          <section className="mt-20">
            <h2 className="text-xl">Weiterlesen</h2>
            <div className="mt-4">
              {entries.map((entry) => (
                <Link key={entry.to} to={entry.to} className={LINK_CLASS}>
                  <span>
                    <span className="block text-lg">{entry.title}</span>
                    <span className="mt-0.5 block text-sm text-muted-foreground">
                      {entry.caption}
                    </span>
                  </span>
                  <ArrowUpRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                </Link>
              ))}
            </div>
          </section>
        </Reveal>
      </main>

      <AppFooter />
    </>
  );
}
