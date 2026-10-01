import { Figure, FigureGrid } from "@/components/site/Figure";
import { AppFooter } from "@/components/site/AppFooter";
import { AppHeader } from "@/components/site/AppHeader";
import { LiveBadge } from "@/components/site/LiveBadge";
import { PageHero } from "@/components/site/PageHero";
import {
  getLive,
  INTERVAL_MINUTES,
  nodeById,
  type LiveReading,
} from "@/data/measurements";
import { useNow } from "@/hooks/use-now";
import { KIND_LABEL } from "@/data/fixtures";
import {
  formatAge,
  formatNumber,
  formatTime,
  METRIC_META,
} from "@/lib/format";

import { Link } from "react-router";

/**
 * Live-Daten — what each node last transmitted.
 *
 * Everything on this page is a pure function of `now`, so there is nothing to
 * fetch and nothing to get out of sync: the page re-derives on every tick. The
 * honest part is the age on every figure. A sensor that has not spoken for an
 * hour should look like a sensor that has not spoken for an hour, not like a
 * stale number presented as current.
 */

function primaryValue(reading: LiveReading) {
  switch (reading.nodeKind) {
    case "soil":
      return {
        metric: "soilMoisturePct",
        value: reading.soilMoisturePct,
      };
    case "weather":
      // Temperature leads; pressure is the second figure. A roof node that
      // shows only a barometer reading is the less interesting half of itself.
      return {
        metric: "temperatureC",
        value: reading.temperatureC,
      };
    default:
      return { metric: "temperatureC", value: reading.temperatureC };
  }
}

function secondaryValue(reading: LiveReading) {
  if (reading.nodeKind === "climate") {
    return { metric: "humidityPct", value: reading.humidityPct };
  }
  if (reading.nodeKind === "weather") {
    return { metric: "pressureHpa", value: reading.pressureHpa };
  }
  return null;
}

export default function Live() {
  const now = useNow(5_000);
  const live = getLive(now);

  return (
    <div className="min-h-screen">
      <AppHeader />

      <PageHero
        kicker="Live-Daten"
        title="Was die Station gerade empfängt"
        lede="Jeder Wert unten stammt aus dem letzten Uplink des jeweiligen Knotens. Das Alter der Messung steht daneben — eine Zahl ohne Alter ist nur eine Behauptung."
      />

      <main className="mx-auto max-w-6xl px-4 pt-14 pb-20 sm:px-6 sm:pt-16">
        {live.map((reading) => {
          const node = nodeById(reading.nodeId);
          const intervalMs = (INTERVAL_MINUTES[reading.nodeId] ?? 10) * 60_000;
          const primary = primaryValue(reading);
          const primaryMeta = METRIC_META[primary.metric];
          const secondary = secondaryValue(reading);
          const secondaryMeta = secondary ? METRIC_META[secondary.metric] : null;

          return (
            <section key={reading.nodeId} className="mb-14 last:mb-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                <div>
                  <h2 className="text-2xl">{reading.nodeName}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {KIND_LABEL[reading.nodeKind]} · SF{reading.spreadingFactor} ·{" "}
                    {formatNumber(reading.bandwidthKhz, 0)} kHz
                  </p>
                </div>
                <LiveBadge
                  ageMs={reading.ageMs}
                  intervalMs={intervalMs}
                  className="ml-auto"
                />
              </div>

              <FigureGrid columns={4} className="mt-6">
                <Figure
                  variant="ticking"
                  label={primaryMeta.label}
                  value={
                    primary.value === null
                      ? "—"
                      : formatNumber(primary.value, primaryMeta.digits)
                  }
                  unit={primaryMeta.unit}
                />
                {secondary && secondaryMeta && (
                  <Figure
                    variant="ticking"
                    label={secondaryMeta.label}
                    value={
                      secondary.value === null
                        ? "—"
                        : formatNumber(secondary.value, secondaryMeta.digits)
                    }
                    unit={secondaryMeta.unit}
                  />
                )}
                <Figure
                  variant="ticking"
                  label="Empfangsstärke"
                  value={formatNumber(reading.rssi)}
                  unit="dBm"
                  detail={`SNR ${formatNumber(reading.snr, 1)} dB`}
                />
                <Figure
                  variant="ticking"
                  label="Batterie"
                  value={formatNumber(reading.batteryPct)}
                  unit="%"
                  detail={`Airtime ${formatNumber(reading.airtimeMs)} ms`}
                />
              </FigureGrid>

              <p className="mt-5 text-sm leading-6 text-muted-foreground">
                Letzter Uplink {formatTime(reading.ts)} · {formatAge(reading.ageMs)} ·{" "}
                {reading.payloadBytes} Byte Payload auf {formatNumber(reading.frequencyMhz, 1)} MHz,{" "}
                Kodierrate {reading.codingRate}.{" "}
                <Link
                  to={`/statistiken?node=${node.id}`}
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Verlauf ansehen
                </Link>
              </p>
            </section>
          );
        })}

        <p className="mt-14 border-t border-border pt-6 text-sm leading-6 text-muted-foreground">
          Diese Werte werden derzeit aus einem deterministischen Modell erzeugt, nicht
          aus echter Hardware gelesen. Derselbe Generator läuft später serverseitig, sobald
          die Station sendet — die Zahlen auf dieser Seite bleiben dieselben.{" "}
          <Link to="/projekt" className="text-primary underline-offset-4 hover:underline">
            Zum Projekt
          </Link>
        </p>
      </main>

      <AppFooter />
    </div>
  );
}
