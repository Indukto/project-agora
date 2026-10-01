import { AppFooter } from "@/components/site/AppFooter";
import { AppHeader } from "@/components/site/AppHeader";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { GLOSSARY } from "@/data/glossary";

/**
 * Glossar — the words the project keeps having to explain.
 *
 * Grouped by stage of the signal path, matching the order in which a reader
 * meets them on the station page. That ordering is the point: a term is far
 * easier to remember next to the step it belongs to than in an alphabetical
 * list.
 *
 * The terms are in a real HTML `<dl>` so the pairing survives a browser's find
 * in page and a screen reader announces the description with its term.
 */

export default function Glossary() {
  return (
    <div className="min-h-screen">
      <AppHeader />

      <PageHero
        kicker="Glossar"
        title="Begriffe, die man kennen muss"
        lede="Nach der Reihenfolge des Signalwegs sortiert: erst das Funkverfahren, dann der Empfang, dann das Netz. Jeder Begriff so erklärt, wie er in diesem Projekt tatsächlich auftaucht."
      />

      <main className="mx-auto max-w-6xl px-4 pt-14 pb-20 sm:px-6 sm:pt-16">
        {GLOSSARY.map((group) => (
          <Reveal key={group.title}>
            <section className="mb-14 last:mb-0">
              <h2 className="border-b border-border pb-4 text-2xl">
                {group.title}
              </h2>

              <dl className="mt-8 space-y-9">
                {group.terms.map((entry) => (
                  <div key={entry.term} className="max-w-2xl">
                    <dt className="text-lg">{entry.term}</dt>
                    <dd className="mt-1.5 text-[15px] leading-7 text-foreground/85">
                      {entry.short}
                    </dd>
                    <dd className="mt-1.5 text-sm leading-6 text-muted-foreground">
                      {entry.detail}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          </Reveal>
        ))}
      </main>

      <AppFooter />
    </div>
  );
}
