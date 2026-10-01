import { AppHeader } from "@/components/site/AppHeader";
import { LandingIntro } from "@/components/site/LandingIntro";
import { SignalBurst } from "@/components/site/SignalBurst";
import LagoonArt from "../../Lagoon";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";

/**
 * Landing — one fullscreen piece of artwork, almost no copy.
 *
 * `Lagoon.jsx` at the repo root is the generated feral-react-gradient export
 * whose recipe is "Lagoon": an animated WATERCOLOR wash (five soft washes over
 * paper grain, driven by its own clock). It is stretched over the whole first
 * viewport — the wrapper's natural 2048×1506 aspect box and `mix-blend-mode`
 * compositing from the old hero are gone, the engine paints its own opaque
 * paper — and the saturated `.gradient-lagoon` field sits behind it purely as
 * a fallback if the canvas never comes up.
 *
 * Everything else is deliberately sparse: wordmark, one line, two links. The
 * guides/range entry cards and the footer band live on in the header nav and
 * on the placeholder pages themselves.
 */

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const reveal: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0 },
};

const LINK_CLASS =
  "group inline-flex items-center gap-1.5 border-b border-[#06201f]/25 pb-1 text-sm tracking-wide text-[#06201f] transition-colors hover:border-[#06201f]";

export default function Landing() {
  // The reveal is decoration: ask the visitor first.
  const reduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen">
      <AppHeader />

      {/* ── The wash is the page ── */}
      {/* Everything inside this section is the delivered landing hero, class for
          class. The only change is that it is now boxed into a fixed-height
          section, so the German project content can follow below the fold. */}
      <section className="relative h-[100svh] overflow-hidden">
      <div aria-hidden="true" className="gradient-lagoon absolute inset-0">
        <LagoonArt
          speed={22}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            aspectRatio: "auto",
          }}
        />
      </div>

      {/* ── Signal rings, drawn over the wash ── */}
      <SignalBurst className="pointer-events-none absolute -right-[26%] -bottom-[38%] size-[92vmin] text-[#0b3d3c] opacity-80 mix-blend-multiply sm:-right-[16%] sm:-bottom-[30%]" />

      {/* ── Paper veil so the copy stays legible on the darker wash ── */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-[radial-gradient(125%_145%_at_0%_100%,rgba(255,253,248,0.68)_0%,rgba(255,253,248,0.3)_38%,transparent_72%)]" />

      {/* ── The only copy on the page ── */}
      <div className="relative flex h-full flex-col justify-end px-4 pt-32 pb-14 sm:px-6 sm:pb-20">
        <div className="mx-auto w-full max-w-6xl">
          <motion.div
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
            transition={{ staggerChildren: 0.12, delayChildren: 0.3 }}
            className="max-w-xl"
          >
            <motion.h1
              variants={reveal}
              transition={{ duration: 1, ease: EASE }}
              className="text-6xl leading-[1.02] tracking-tight text-[#06201f] sm:text-7xl"
            >
              Project Agora
            </motion.h1>

            <motion.p
              variants={reveal}
              transition={{ duration: 1, ease: EASE }}
              className="mt-4 text-lg leading-7 text-[#06201f]/85 sm:text-xl"
            >
              Long-range LoRa, documented.
            </motion.p>

            <motion.div
              variants={reveal}
              transition={{ duration: 1, ease: EASE }}
              className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3"
            >
                <Link to="/live" className={LINK_CLASS}>
                  Live-Daten
                  <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
                <Link to="/guides" className={LINK_CLASS}>
                  Hardware guides
                  <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              <Link to="/range" className={LINK_CLASS}>
                Range results
                <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
      </section>

      <LandingIntro />
    </div>
  );
}
