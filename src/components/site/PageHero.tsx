import { SignalBurst } from "@/components/site/SignalBurst";
import { Reveal, RevealGroup } from "@/components/site/Reveal";
import type { ReactNode } from "react";
import LagoonArt from "../../../Lagoon";

/**
 * The landing hero, shortened — every inner page opens on the same artwork.
 *
 * Same three layers as `src/pages/Landing.tsx`: the generated `Lagoon` wash
 * stretched over its own box, the LoRa signal rings over that, and a paper veil
 * under the copy. What changes is only the height (52svh instead of a full
 * viewport) and that a title can go in it, so a reader always lands on a piece
 * of the site rather than on a wall of text.
 *
 * `Lagoon.jsx` is generated output and must not be edited; the look is steered
 * only through its props. `speed` is a touch slower than the landing's 22 so
 * two canvases are never in an obvious rhythm if the wash is ever reused.
 */

export function PageHero({
  title,
  kicker,
  lede,
  children,
}: {
  title: string;
  kicker?: string;
  lede?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate h-[52svh] min-h-[340px] w-full overflow-hidden">
      <div aria-hidden="true" className="gradient-lagoon absolute inset-0">
        <LagoonArt
          speed={26}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            aspectRatio: "auto",
          }}
        />
      </div>

      <SignalBurst className="pointer-events-none absolute -right-[24%] -bottom-[46%] size-[74vmin] text-[#0b3d3c] opacity-70 mix-blend-multiply sm:-right-[14%]" />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[72%] bg-[radial-gradient(125%_145%_at_0%_100%,rgba(255,253,248,0.7)_0%,rgba(255,253,248,0.32)_38%,transparent_72%)]" />

      <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-10 sm:px-6 sm:pb-14">
        <RevealGroup className="max-w-2xl">
          {kicker && (
            <Reveal>
              <p className="text-xs tracking-[0.16em] text-[#06201f]/70 uppercase">
                {kicker}
              </p>
            </Reveal>
          )}
          <Reveal>
            <h1 className="text-4xl leading-[1.05] tracking-tight text-[#06201f] sm:text-5xl">
              {title}
            </h1>
          </Reveal>
          {lede && (
            <Reveal>
              <p className="mt-4 max-w-xl text-base leading-7 text-[#06201f]/85">
                {lede}
              </p>
            </Reveal>
          )}
          {children}
        </RevealGroup>
      </div>
    </section>
  );
}
