import { BrandMark } from "@/components/site/BrandMark";
import { Link } from "react-router";

export function AppFooter() {
  return (
    <footer className="border-t border-border bg-surface-1">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-3">
          <BrandMark />
          <p className="max-w-sm text-sm leading-6 text-muted-foreground">
            Project Agora — eine LoRaWAN-Funkstation an der Schule und die
            Website, die zeigt, was bei ihr ankommt. Jede Zahl stammt aus einem
            echten Uplink.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-medium">Station</h4>
          <ul className="space-y-2.5 text-sm">
            {[
              { to: "/live", label: "Live-Daten" },
              { to: "/karte", label: "Karte" },
              { to: "/statistiken", label: "Statistiken" },
              { to: "/station", label: "Funkstation" },
              { to: "/export", label: "Daten exportieren" },
            ].map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="text-foreground/75 transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-medium">Hintergrund</h4>
          <ul className="space-y-2.5 text-sm">
            {[
              { to: "/lorawan", label: "LoRaWAN" },
              { to: "/funktechnik", label: "Funktechnik" },
              { to: "/glossar", label: "Glossar" },
              { to: "/projekt", label: "Projekt" },
              { to: "/guides", label: "Hardware guides" },
              { to: "/range", label: "Range comparisons" },
            ].map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="text-foreground/75 transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
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
