import { AppHeader } from "@/components/site/AppHeader";
import { Hero } from "@/components/site/Hero";
import { LandingIntro } from "@/components/site/LandingIntro";

/**
 * Landing — one fullscreen piece of artwork, almost no copy.
 *
 * The hero composition lives in `src/components/site/Hero.tsx`, which the
 * touch-device 404 renders too; this page supplies the words. Everything below
 * the fold is the German project content in `LandingIntro`.
 */

export default function Landing() {
  return (
    <div className="min-h-screen">
      <AppHeader />

      <Hero
        title="Project Agora"
        subtitle="Long-range LoRa, documented."
        links={[
          { to: "/live", label: "Live-Daten" },
          { to: "/guides", label: "Hardware guides" },
          { to: "/range", label: "Range results" },
        ]}
      />

      <LandingIntro />
    </div>
  );
}
