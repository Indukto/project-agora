import { AppHeader } from "@/components/site/AppHeader";
import { NotFoundArt } from "@/components/site/NotFoundArt";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";

import LagoonArt from "../../Lagoon";

/**
 * 404 — the landing, with nothing to land on.
 *
 * Same construction as `src/pages/Landing.tsx`: the generated Lagoon wash over
 * the whole viewport, the LoRa arcs above it, a paper veil under the copy. The
 * only addition is that the arcs drift toward the pointer, because a missing
 * page is a frame nobody received and following a signal is what a receiver
 * does.
 *
 * Three lines of copy. The earlier version explained the conceit, showed a
 * frequency dial, three readouts and a link list — none of which a lost visitor
 * needs. They want to be somewhere, so the only job here is to be beautiful for
 * a second and then get out of the way.
 */

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const reveal: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0 },
};

const LINK_CLASS =
  "group inline-flex items-center gap-1.5 border-b border-[#06201f]/25 pb-1 text-sm tracking-wide text-[#06201f] transition-colors hover:border-[#06201f]";

export default function NotFound() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative h-[100svh] overflow-hidden">
      <AppHeader />

      <section aria-hidden="true" className="gradient-lagoon absolute inset-0">
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
      </section>

      <NotFoundArt />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-[radial-gradient(125%_145%_at_0%_100%,rgba(255,253,248,0.68)_0%,rgba(255,253,248,0.3)_38%,transparent_72%)]" />

      <main className="relative flex h-full flex-col justify-end px-4 pt-32 pb-14 sm:px-6 sm:pb-20">
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
              404
            </motion.h1>

            <motion.p
              variants={reveal}
              transition={{ duration: 1, ease: EASE }}
              className="mt-4 text-lg leading-7 text-[#06201f]/85 sm:text-xl"
            >
              Dieser Frame ist nicht angekommen.
            </motion.p>

            <motion.div
              variants={reveal}
              transition={{ duration: 1, ease: EASE }}
              className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3"
            >
              <Link to="/" className={LINK_CLASS}>
                Zur Startseite
                <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <Link to="/live" className={LINK_CLASS}>
                Live-Daten
                <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
