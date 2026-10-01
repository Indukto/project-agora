import { BrandMark } from "@/components/site/BrandMark";
import { Link } from "react-router";

export function AppFooter() {
  return (
    <footer className="border-t border-border bg-surface-1">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-3">
          <BrandMark />
          <p className="max-w-sm text-sm leading-6 text-muted-foreground">
            Documentation for Project Agora, a long-range LoRa solution: how
            the hardware is built, what it achieves in the field, and why.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-medium">Version 1</h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link
                to="/guides"
                className="text-foreground/75 transition-colors hover:text-primary"
              >
                Hardware guides
              </Link>
            </li>
            <li>
              <Link
                to="/range"
                className="text-foreground/75 transition-colors hover:text-primary"
              >
                Range comparisons
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-medium">Later versions</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li>Resource help center</li>
            <li>Forums and chat</li>
            <li>Meet-up maps</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <span>© {new Date().getFullYear()} Project Agora</span>
          <span>868 / 915 / 433 MHz</span>
        </div>
      </div>
    </footer>
  );
}
