import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

/**
 * The fade-up the landing page uses, lifted into a component.
 *
 * `src/pages/Landing.tsx` still declares these variants inline and is left
 * alone on purpose: its hero is finished artwork that arrived in a single
 * commit, and re-plumbing it buys nothing. New pages use these two instead of
 * copying the motion setup a third time.
 *
 * Reduced motion is honoured by skipping the animation outright rather than
 * playing it faster — the landing does the same, and the whole site treats
 * `prefers-reduced-motion` as a hard rule rather than a hint.
 */

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const reveal: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0 },
};

/** Parent for a staggered sequence. Children must be `<Reveal>`. */
export function RevealGroup({
  children,
  className,
  delay = 0.3,
  stagger = 0.12,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : "hidden"}
      animate="visible"
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Reveal({
  children,
  className,
  duration = 1,
}: {
  children: ReactNode;
  className?: string;
  duration?: number;
}) {
  return (
    <motion.div
      variants={reveal}
      transition={{ duration, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
