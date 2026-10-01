import { AppHeader } from "@/components/site/AppHeader";
import { Hero } from "@/components/site/Hero";

/**
 * The touch-device 404 — the lagoon artwork the landing uses, with the two links
 * a lost visitor actually needs.
 *
 * It used to be a copy of the landing hero, down to the wash import and the
 * reveal easing, which meant every hero change had to be made twice. It now
 * renders the same `Hero` component and contributes only its own words.
 *
 * There is deliberately no pointer interaction. A coarse pointer has no hover
 * state, so on the devices that actually land here it could never fire.
 */
export function NotFoundLagoon() {
  return (
    <>
      <AppHeader />

      {/* The hero's own content container is a plain div, because on the landing
          the `main` landmark belongs to the project content further down the
          page. This route is all there is, so the landmark goes here instead —
          a 404 with no `main` is a regression, not a simplification. */}
      <main>
        <Hero
          title="404"
          subtitle="Dieser Frame ist nicht angekommen."
          links={[
            { to: "/", label: "Zur Startseite" },
            { to: "/live", label: "Live-Daten" },
          ]}
        />
      </main>
    </>
  );
}
