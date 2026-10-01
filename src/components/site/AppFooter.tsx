import { BrandMark } from "@/components/site/BrandMark";
import { Link } from "react-router";

export function AppFooter() {
  return (
    <footer className="relative border-t border-border/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-3">
          <BrandMark />
          <p className="max-w-sm text-sm leading-6 text-muted-foreground">
            Documentation for Project Agora, a long-range LoRa solution: how
            the hardware is built, what it achieves in the field, and why.
          </p>
          <p className="text-xs text-muted-foreground/70">
            Field numbers contributed by partner teams.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Version 1
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link
                to="/guides"
                className="text-foreground/80 transition-colors hover:text-primary"
              >
                Hardware guides
              </Link>
            </li>
            <li>
              <Link
                to="/range"
                className="text-foreground/80 transition-colors hover:text-primary"
              >
                Range comparisons
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Coming in v2
          </h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground/60">
            <li>Resource help center</li>
            <li>Forums &amp; chat</li>
            <li>Meet-up maps</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/40">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground/70 sm:flex-row sm:px-6">
          <span>© {new Date().getFullYear()} Project Agora. Open documentation.</span>
          <span className="font-mono text-[11px]">
            868&nbsp;/&nbsp;915&nbsp;/&nbsp;433&nbsp;MHz — build responsibly
          </span>
        </div>
      </div>
    </footer>
  );
}
