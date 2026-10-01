import { AppFooter } from "@/components/site/AppFooter";
import { AppHeader } from "@/components/site/AppHeader";
import { PageHero } from "@/components/site/PageHero";
import { ArticleSection, FactList } from "@/components/site/Prose";
import { Reveal } from "@/components/site/Reveal";
import { NODES, STATION } from "@/data/fixtures";
import { distanceM } from "@/lib/telemetry";
import { formatNumber } from "@/lib/format";
import { Link } from "react-router";

/**
 * Funktechnik — Frequenzen, Reichweite und die Rechnung dahinter.
 *
 * The link budget is shown rather than asserted, and the range figures come
 * from `STATION.rangeBySf` — the same numbers the map draws its circles from. If
 * a measurement ever contradicts one of them, the contradiction shows up in two
 * places instead of quietly becoming folklore.
 */

const SFS = [7, 8, 9, 10, 11, 12] as const;

export default function Radio() {
  // The one number that explains the whole node layout: how much of each
  // node's range budget its distance to the gateway actually uses.
  const links = NODES.map((node) => {
    const m = distanceM(node.lat, node.lng, STATION.lat, STATION.lng);
    const range = STATION.rangeBySf[node.spreadingFactor];
    return { node, m, range, headroom: range / Math.max(m, 1) };
  });

  return (
    <div className="min-h-screen">
      <AppHeader />

      <PageHero
        kicker="Funktechnik"
        title="Frequenz, Reichweite, Link-Budget"
        lede="Warum ein Knoten auf dem Dach SF7 sendet und einer im Schulgarten SF11, obwohl beide dieselbe Antenne haben: Entfernung, Frequenz und ein Funkbudget, das nicht beliebig ist."
      />

      <main className="mx-auto max-w-6xl px-4 pt-14 pb-20 sm:px-6 sm:pt-16">
        <div className="space-y-12">
          <Reveal>
            <ArticleSection
              title="Frequenz und Wellenlänge"
              lead="LoRa sendet im europäischen ISM-Band 868 MHz. Die Wellenlänge beträgt rund 34 Zentimeter — kurz genug, dass die Antenne klein bleibt, lang genug, dass sich die Welle um Hindernisse herumbiegt."
            >
              <p>
                Wer schneller sendet, muss mehr Bandbreite belegen und braucht
                mehr Energie für die gleiche Reichweite. Das ist der Grund, warum
                hier durchgehend 125 kHz eingestellt sind: schmal, sparsam, und
                für unsere Entfernungen völlig ausreichend.
              </p>
            </ArticleSection>
          </Reveal>

          <Reveal>
            <ArticleSection
              title="Reichweite nach Spreading Factor"
              lead="Der Spreading Factor bestimmt, wie oft ein Bit über die Luftbahn wiederholt wird. Höher heißt robuster — und langsamer."
            >
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {["SF", "Reichweite", "Datenrate", "Einsatz"].map((label, i) => (
                        <th
                          key={label}
                          scope="col"
                          className={
                            i === 3
                              ? "py-3 pr-4 text-left text-xs font-normal tracking-[0.12em] text-muted-foreground uppercase"
                              : "py-3 pr-4 text-right text-xs font-normal tracking-[0.12em] text-muted-foreground uppercase"
                          }
                        >
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SFS.map((sf) => {
                      const used = links.filter((l) => l.node.spreadingFactor === sf);
                      return (
                        <tr key={sf} className="border-b border-border/60">
                          <td className="py-3 pr-4 text-right tabular-nums">SF{sf}</td>
                          <td className="py-3 pr-4 text-right tabular-nums">
                            {formatNumber(STATION.rangeBySf[sf] / 1000, 1)} km
                          </td>
                          <td className="py-3 pr-4 text-right tabular-nums text-muted-foreground">
                            {formatNumber(0.3 * 2 ** (12 - sf), 2)} kbit/s
                          </td>
                          <td className="py-3 pr-4 text-muted-foreground">
                            {used.length ? used.map((l) => l.node.name).join(", ") : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p>
                Diese Reichweiten gelten für freie Sicht. Zwischen Gebäuden
                liegen sie niedriger, weshalb wir die Faktoren nicht nach
                Entfernung allein vergeben, sondern mit Reserve.
              </p>
            </ArticleSection>
          </Reveal>

          <Reveal>
            <ArticleSection
              title="Das Link-Budget"
              lead="Ob eine Verbindung trägt, ist eine Rechnung: Sendeleistung plus Antennengewinn, minus Ausbreitungsdämpfung minus Schatten durch Gebäude."
            >
              <FactList
                items={[
                  ["Sendeleistung", "14 dBm (gesetzliche Obergrenze)"],
                  ["Empfangsgewinn", "2 dBi"],
                  ["Frequenz", `${formatNumber(STATION.frequencyMhz, 1)} MHz`],
                  ["Rauschpegel am Gateway", "−121 dBm (SF7, 125 kHz)"],
                  ["Duty-Cycle-Limit", "1 %"],
                ]}
              />
              <p>
                Ein höherer Spreading Factor senkt nicht das Rauschen, er hebt
                das Signal über das Rauschteppich: SNR statt 6 dB sind bei
                SF11 rund 19 dB. Genau deshalb funktioniert SF11 dort, wo SF7
                längst im Grundrauschen verschwunden wäre.
              </p>
            </ArticleSection>
          </Reveal>

          <Reveal>
            <ArticleSection
              title="Wie viel Reserve die Knoten haben"
              lead="Entfernung zur Funkstation im Verhältnis zur angegebenen Reichweite ihres Spreading Factors. Alles über 1 bedeutet Reserve."
            >
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {["Knoten", "Entfernung", "SF", "Reserve"].map((label, i) => (
                        <th
                          key={label}
                          scope="col"
                          className={
                            i === 0
                              ? "py-3 pr-4 text-left text-xs font-normal tracking-[0.12em] text-muted-foreground uppercase"
                              : "py-3 pr-4 text-right text-xs font-normal tracking-[0.12em] text-muted-foreground uppercase"
                          }
                        >
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {links.map(({ node, m, headroom }) => (
                      <tr key={node.id} className="border-b border-border/60">
                        <td className="py-3 pr-4">{node.name}</td>
                        <td className="py-3 pr-4 text-right tabular-nums">
                          {formatNumber(m)} m
                        </td>
                        <td className="py-3 pr-4 text-right tabular-nums">
                          SF{node.spreadingFactor}
                        </td>
                        <td className="py-3 pr-4 text-right tabular-nums">
                          {formatNumber(headroom, 1)}×
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>
                Der Schulgarten liegt am weitesten vom Gateway entfernt und
                bekommt deshalb das höchste SF. Die gemessenen Werte stehen in{" "}
                <Link
                  to="/range"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  den Reichweitenvergleichen
                </Link>
                .
              </p>
            </ArticleSection>
          </Reveal>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
