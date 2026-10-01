import { AppFooter } from "@/components/site/AppFooter";
import { AppHeader } from "@/components/site/AppHeader";
import { PageHero } from "@/components/site/PageHero";
import { ArticleSection, FactList } from "@/components/site/Prose";
import { Reveal } from "@/components/site/Reveal";
import { NODES, STATION } from "@/data/fixtures";
import { airtimeMs } from "@/lib/telemetry";
import { formatNumber } from "@/lib/format";
import { Link } from "react-router";

/**
 * LoRaWAN — das Netzwerkprotokoll, erklärt an dem, was wir selbst senden.
 *
 * Every figure on this page is computed with the same `airtimeMs` function the
 * generator uses, so the table below cannot drift away from what the station
 * really transmits. Explanations stay general; the numbers do not.
 */

export default function LoRaWan() {
  // One row per node: what it costs to send that payload at that setting.
  const airtimes = NODES.map((node) => {
    const payloadBytes = node.kind === "climate" ? 10 : node.kind === "soil" ? 6 : 14;
    return {
      node,
      payloadBytes,
      ms: airtimeMs({
        spreadingFactor: node.spreadingFactor,
        bandwidthKhz: node.bandwidthKhz,
        payloadBytes,
        codingRate: node.codingRate,
        crcOn: true,
      }),
    };
  });

  const fastest = airtimes.reduce((a, b) => (a.ms <= b.ms ? a : b));
  const slowest = airtimes.reduce((a, b) => (a.ms >= b.ms ? a : b));

  return (
    <div className="min-h-screen">
      <AppHeader />

      <PageHero
        kicker="LoRaWAN"
        title="Wie LoRaWAN funktioniert"
        lede="LoRa ist der Funk. LoRaWAN ist das Protokoll, das darüber läuft und daraus ein Netz macht. Der Unterschied ist der Grund, warum es überhaupt Strecken von mehreren Kilometern gibt."
      />

      <main className="mx-auto max-w-6xl px-4 pt-14 pb-20 sm:px-6 sm:pt-16">
        <div className="space-y-12">
          <Reveal>
            <ArticleSection
              title="LoRa und LoRaWAN"
              lead="LoRa ist ein Funksystem: ein Chirp-Spreading-Spectrum-Verfahren, das ein Symbol sehr lange über die Luft streut. Der Empfänger integriert über diese Zeit, und plötzlich stört ein einzelner schmaler Störer kaum."
            >
              <p>
                LoRa allein ist aber nur ein einzelnes Funkgerät, das andere
                Funkgeräte hört. Damit daraus ein Netz wird, braucht es LoRaWAN:
                Adressen, Verschlüsselung, Regeln für Wiederholungen und einen
                Dienst, der die empfangenen Frames entpackt. Unsere Knoten
                sprechen LoRaWAN — sie kennen das Protokoll, nicht die Physik des
                Funks.
              </p>
            </ArticleSection>
          </Reveal>

          <Reveal>
            <ArticleSection
              title="Uplink, Downlink, ALOHA"
              lead="Unsere Knoten sind batteriebetrieben und schlafen. Das bestimmt den gesamten Betrieb."
            >
              <p>
                Ein Endgerät sendet einen Uplink und öffnet danach kurz zwei
                Receive-Fenster. Nur in diesen beiden Fenstern kann das Netz
                etwas zurückschicken. Dazwischen ist das Gerät taub und spart
                Energie. Ein Downlink außerhalb dieser Fenster kommt nicht an.
              </p>
              <p>
                Wer senden darf, entscheidet niemand. Das Verfahren heißt ALOHA:
                Jeder, der möchte, sendet. Senden zwei Knoten exakt gleichzeitig,
                überlagern sich die Frames und beide gehen verloren. LoRaWAN
                erkennt das am Empfang und wiederholt — deshalb sieht man auf{" "}
                <Link to="/live" className="text-primary underline-offset-4 hover:underline">
                  der Live-Seite
                </Link>{" "}
                gelegentlich eine Lücke in der Kurve, statt einer erfundenen
                Zahl.
              </p>
            </ArticleSection>
          </Reveal>

          <Reveal>
            <ArticleSection
              title="Was ein Uplink wirklich kostet"
              lead="Jedes Byte und jedes gesendete Bit wird auf der Luftbahn teurer. Die Luftzeit folgt der Semtech-Formel aus Datenrate, Spreading Factor, Payloadlänge und Kodierrate."
            >
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {["Knoten", "SF", "Payload", "Luftzeit"].map((label, i) => (
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
                    {airtimes.map(({ node, payloadBytes, ms }) => (
                      <tr key={node.id} className="border-b border-border/60">
                        <td className="py-3 pr-4">{node.name}</td>
                        <td className="py-3 pr-4 text-right tabular-nums">
                          SF{node.spreadingFactor}
                        </td>
                        <td className="py-3 pr-4 text-right tabular-nums">
                          {payloadBytes} B
                        </td>
                        <td className="py-3 pr-4 text-right tabular-nums">
                          {formatNumber(ms)} ms
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>
                Der Dachmesspunkt mit SF7 ist nach rund{" "}
                {formatNumber(fastest.ms)} ms durch, der Schulgarten mit SF11
                braucht {formatNumber(slowest.ms)} ms — etwa das{" "}
                {formatNumber(slowest.ms / fastest.ms, 0)}-Fache. Bei einem
                Duty-Cycle-Limit von einem Prozent ist genau das der Grund, warum
                der Schulgarten nur alle halbe Stunde sendet.
              </p>
            </ArticleSection>
          </Reveal>

          <Reveal>
            <ArticleSection title="Die drei Server im Weg">
              <p>
                Nach dem Gateway wartet der Netzwerkserver. Er entpackt die
                Payloads, verwaltet die Zugangsdaten jedes Knotens und
                dedupliziert Nachrichten, die mehrfach ankamen. Bei uns ist das
                ein The-Things-Stack- oder ChirpStack-kompatibler Dienst.
              </p>
              <p>
                Dahinter steht der Application Server — bei uns die Datenbank.
                Erst er entscheidet, was mit einer Messung geschieht. Diese
                Trennung ist in fast jeder Fehldarstellung zu sehen und ein
                guter Moment, um im Vortrag kurz in die Runde zu fragen, wer sie
                für denselben Server hält.
              </p>
              <FactList
                items={[
                  ["Frequenz", `${formatNumber(STATION.frequencyMhz, 1)} MHz`],
                  ["Bandbreite", "125 kHz"],
                  ["Sendeleistung", "14 dBm"],
                  ["Antennengewinn", "2 dBi"],
                  ["Kodierrate", "4/5"],
                ]}
              />
            </ArticleSection>
          </Reveal>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
