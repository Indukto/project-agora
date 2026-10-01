import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BrandMark } from "@/components/site/BrandMark";
import { cn } from "@/lib/utils";
import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";

/**
 * Header navigation.
 *
 * Five destinations in the bar, the rest behind "Mehr". Eleven equal-weight
 * links would stop being navigation and start being an index, and on a phone
 * the whole set would wrap before the logo was out of sight. The split also
 * says something: Live-Daten, Karte and Statistiken are the project; LoRaWAN,
 * Funktechnik and Glossar are the background reading.
 *
 * The English guides and range pages stay reachable from the same menu, under a
 * rule, because they are the technical documentation rather than part of the
 * school's own tour.
 */

const primaryItems = [
  { label: "Live-Daten", to: "/live" },
  { label: "Karte", to: "/karte" },
  { label: "Statistiken", to: "/statistiken" },
  { label: "Station", to: "/station" },
  { label: "Projekt", to: "/projekt" },
];

const moreItems = [
  { label: "LoRaWAN erklärt", to: "/lorawan" },
  { label: "Funktechnik", to: "/funktechnik" },
  { label: "Glossar", to: "/glossar" },
  { label: "Daten exportieren", to: "/export" },
];

const documentationItems = [
  { label: "Hardware guides", to: "/guides" },
  { label: "Range comparisons", to: "/range" },
];

export function AppHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const isActive = (to: string) => location.pathname.startsWith(to);
  const moreActive = [...moreItems, ...documentationItems].some((i) =>
    isActive(i.to),
  );

  const navLinkClass = (active: boolean) =>
    cn(
      "text-sm transition-colors",
      active ? "font-medium text-primary" : "text-foreground/80 hover:text-foreground",
    );

  return (
    <header
      className={cn(
        // Translucent rather than a solid `bg-background`: the header is fixed,
        // so an opaque bar would paint over the lagoon paper (and over the
        // landing hero) for the full width of every page. The blur keeps the
        // nav legible over whatever scrolls beneath it.
        "fixed inset-x-0 top-0 z-50 border-b border-transparent bg-background/80 backdrop-blur-md transition-shadow duration-200",
        scrolled && "border-border shadow-[0_1px_0_0_var(--border)]",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" aria-label="Project Agora home" className="rounded-md">
          <BrandMark />
        </Link>

        <nav className="hidden items-center gap-5 md:flex lg:gap-6">
          {primaryItems.map((item) => (
            <Link key={item.to} to={item.to} className={navLinkClass(isActive(item.to))}>
              {item.label}
            </Link>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "flex items-center gap-1 text-sm transition-colors",
                moreActive
                  ? "font-medium text-primary"
                  : "text-foreground/80 hover:text-foreground",
              )}
            >
              Mehr
              <ChevronDown className="size-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {moreItems.map((item) => (
                <DropdownMenuItem key={item.to} asChild>
                  <Link to={item.to} className={isActive(item.to) ? "text-primary" : undefined}>
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              {documentationItems.map((item) => (
                <DropdownMenuItem key={item.to} asChild>
                  <Link to={item.to} className={isActive(item.to) ? "text-primary" : undefined}>
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="hidden items-center gap-1 md:flex">
          <Button size="sm" asChild>
            <Link to="/live">Live ansehen</Link>
          </Button>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="inline-flex size-10 items-center justify-center rounded-full text-foreground/80 hover:bg-muted md:hidden"
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-border bg-background/95 backdrop-blur-md md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4">
            {primaryItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-xl px-4 py-3 text-sm",
                  isActive(item.to) ? "bg-muted text-primary" : "text-foreground/80",
                )}
              >
                {item.label}
              </Link>
            ))}

            <div className="mt-2 border-t border-border pt-2">
              {[...moreItems, ...documentationItems].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "rounded-xl px-4 py-3 text-sm",
                    isActive(item.to) ? "bg-muted text-primary" : "text-foreground/80",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <Link
              to="/live"
              className="mt-2 inline-flex h-10 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground"
            >
              Live ansehen
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
