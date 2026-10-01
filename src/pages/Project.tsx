import { ArchitectureDiagram } from "@/components/data/ArchitectureDiagram";
import { AppFooter } from "@/components/site/AppFooter";
import { AppHeader } from "@/components/site/AppHeader";
import { PageHero } from "@/components/site/PageHero";
import { ArticleSection } from "@/components/site/Prose";
import { Reveal } from "@/components/site/Reveal";

/**
 * Projekt — wer was gebaut hat, und in welcher Reihenfolge.
 *
 * The role list is the working split, not a job description. Each entry names
 * the thing that person is actually answerable for, because "UI/UX" on its own
 * does not tell anyone whether the charts are theirs.
 */

const ROLES: { role: string; owns: string; delivers: string }[] = [
  {
    role: "Projektleitung",
    owns: "Zeitplan, Aufgabenverteilung, Präsentation",
    delivers: "Abstimmung zwischen Funk und Web, Abnahme der Zwischenstände",
  },
  {
    role: "Webentwicklung",
    owns: "Seiten, Navigation, Datenanbindung",
    delivers: "Live-Daten, Statistiken, Karte und Export in einer gemeinsamen Codebasis",
  },
  {
    role: "UI/UX und Design",
    owns: "Farben, Typografie, Bildsprache",
    delivers: "Gestaltungsregeln, die auch die Diagramme tragen",
  },
  {
    role: "LoRaWAN und Funktechnik",
    owns: "Funkparameter, Link-Budget, Netzanbindung",
    delivers: "Spreading Factor je Knoten, Anbindung an den Netzwerkserver",
  },
  {
    role: "Daten und Visualisierung",
    owns: "Datenmodell, Kennzahlen, Diagrammwahl",
    delivers: "Messwerte und Statistiken, die einer Zahl entsprechen können",
  },
  {
    role: "Funkstation und Hardware",
    owns: "Aufbau, Montage, Energieversorgung, Wartung",
    delivers: "Betriebssichere Station und gepflegte Knoten",
  },
  {
    role: "Dokumentation",
    owns: "Fachdokumentation, Glossar, Präsentationsunterlagen",
    delivers: "Baupläne, Glossar, Vortragsskript",
  },
  {
    role: "Testing und Staging",
    owns: "Prüfen auf echten Geräten, Abnahme vor der Veröffentlichung",
    delivers: "Nachweis, dass jede Zahl auf einen Messwert zurückgeht",
  },
];

export default function Project() {
  return (
    <div className="min-h-screen">
      <AppHeader />

      <PageHero
        kicker="Projekt"
        title="Wie AGORA gebaut wurde"
        lede="Eine Funkstation an einer Schule und eine Website, die zeigt, was sie empfängt. Wer daran gearbeitet hat, wer was verantwortet — und was als Nächstes ansteht."
      />

      <main className="mx-auto max-w-6xl px-4 pt-14 pb-20 sm:px-6 sm:pt-16">
        <div className="space-y-12">
          <Reveal>
            <ArticleSection
              title="Die Aufgabe"
              lead="Eine LoRaWAN-Funkstation an der Schule aufbauen, betreiben und die Messdaten so veröffentlichen, dass sie sich im Unterricht und in der Präsentation verwenden lassen."
            >
              <p>
                Aus dieser Aufgabe sind zwei Dinge entstanden, die getrennt
                funktionieren: eine Station, die im Freien zuverlässig sendet, und
                eine Website, die ehrlich zeigt, was angekommen ist. Beides wird
                gern zusammengedacht, hat aber völlig verschiedene Fehlerquellen —
                die Funkseite kennt keine Frame-Lücken, die Webseite keinen schlechten
                Empfang.
              </p>
            </ArticleSection>
          </Reveal>

          <Reveal>
            <ArticleSection
              title="Der Aufbau"
              lead="Vom Messwert im Boden bis zur Kurve im Browser sind es fünf Stufen. Der längste Weg ist nicht die Technik, sondern der Weg durch das LoRaWAN-Netz."
            >
              <div className="mt-8">
                <ArchitectureDiagram />
              </div>
            </ArticleSection>
          </Reveal>

          <Reveal>
            <section className="border-t border-border pt-8">
              <h2 className="text-2xl">Aufgabenverteilung</h2>
              <p className="mt-2 max-w-2xl text-base leading-7 text-muted-foreground">
                Jede Rolle ist für etwas verantwortlich, das man am Ende prüfen
                kann. Eine Aufgabe ohne überprüfbares Ergebnis steht hier nicht.
              </p>

              <div className="mt-8 overflow-x-auto">
                <table className="w-full min-w-[720px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {["Rolle", "Verantwortet", "Ergebnis"].map((label, i) => (
                        <th
                          key={label}
                          scope="col"
                          className={
                            i === 0
                              ? "py-3 pr-4 text-left text-xs font-normal tracking-[0.12em] text-muted-foreground uppercase"
                              : "py-3 pr-4 text-left text-xs font-normal tracking-[0.12em] text-muted-foreground uppercase"
                          }
                        >
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ROLES.map((entry) => (
                      <tr key={entry.role} className="border-b border-border/60 align-top">
                        <td className="py-3.5 pr-4 whitespace-nowrap">{entry.role}</td>
                        <td className="py-3.5 pr-4 text-muted-foreground">
                          {entry.owns}
                        </td>
                        <td className="py-3.5 pr-4 text-muted-foreground">
                          {entry.delivers}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </Reveal>

          <Reveal>
            <section className="border-t border-border pt-8">
              <h2 className="text-2xl">Stand und nächste Schritte</h2>
              <div className="mt-5 space-y-4 text-[15px] leading-7 text-foreground/85">
                <p>
                  Heute erzeugt ein deterministisches Modell die Messwerte, das
                  derselbe ist, der später serverseitig die echten Uplinks
                  entpackt. Damit sind Website und Präsentation vollwertig, bevor
                  eine einzige Anmeldung an einen Netzwerkserver steht.
                </p>
                <p>
                  Offen sind der Anschluss an das LoRaWAN-Netz, die exakten
                  Standortkoordinaten der Station und ein Formular, über das
                  Partnerstationen eigene Messreihen beitragen können. Die
                  Koordinaten stehen in den Projektdateien und werden an einer
                  Stelle gepflegt, damit Karte, Funkstärke und Reichweite
                  gemeinsam neu rechnen.
                </p>
              </div>
            </section>
          </Reveal>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
