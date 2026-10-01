import { SignalBurst } from "@/components/site/SignalBurst";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";

import LagoonArt from "../../../Lagoon";

/**
 * The full-screen lagoon hero, and the only place its composition exists.
 *
 * `Lagoon.jsx` at the repo root is the generated feral-react-gradient export
 * whose recipe is "Lagoon": an animated watercolour wash driven by its own
 * clock. It is stretched over the whole first viewport — the wrapper's natural
 * 2048×1506 aspect box is replaced — and the saturated `.gradient-lagoon` field
 * sits behind it purely as a fallback if the canvas never comes up. The signal
 * rings are drawn over the wash, and a paper veil under the copy keeps the text
 * legible where the wash runs dark.
 *
 * The landing and the touch-device 404 both open on this composition and differ
 * only in their words, so the wash import, the burst position, the veil, the
 * easing curve, the reveal variants and the link styling all used to be copied
 * between them. They are not any more: changing the hero changes it once.
 *
 * `PageHero` is a different composition on purpose — a 52svh band with a kicker
 * and a lede for interior pages — so it keeps its own layers rather than being
 * bent into this one.
 *
 * The caller renders `AppHeader` itself, so the header stays a sibling of the
 * hero on the landing and inside the page frame on the 404, exactly as it was.
 */

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const reveal: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0 },
};

const LINK_CLASS =
  "group inline-flex items-center gap-1.5 border-b border-[#06201f]/25 pb-1 text-sm tracking-wide text-[#06201f] transition-colors hover:border-[#06201f]";

export interface HeroLink {
  to: string;
  label: string;
}

export function Hero({
  title,
  subtitle,
  links,
  speed = 22,
}: {
  title: string;
  subtitle: string;
  links: HeroLink[];
  /** `Lagoon.jsx` clock speed. Lower is slower. */
  speed?: number;
}) {
  // The reveal is decoration: ask the visitor first.
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative h-[100svh] overflow-hidden">
      <div aria-hidden="true" className="gradient-lagoon absolute inset-0">
        <LagoonArt
          speed={speed}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            aspectRatio: "auto",
          }}
        />
      </div>

      <SignalBurst className="pointer-events-none absolute -right-[26%] -bottom-[38%] size-[92vmin] text-[#0b3d3c] opacity-80 mix-blend-multiply sm:-right-[16%] sm:-bottom-[30%]" />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-[radial-gradient(125%_145%_at_0%_100%,rgba(255,253,248,0.68)_0%,rgba(255,253,248,0.3)_38%,transparent_72%)]" />

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
              {title}
            </motion.h1>

            <motion.p
              variants={reveal}
              transition={{ duration: 1, ease: EASE }}
              className="mt-4 text-lg leading-7 text-[#06201f]/85 sm:text-xl"
            >
              {subtitle}
            </motion.p>

            <motion.div
              variants={reveal}
              transition={{ duration: 1, ease: EASE }}
              className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3"
            >
              {links.map((link) => (
                <Link key={link.to} to={link.to} className={LINK_CLASS}>
                  {link.label}
                  <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
