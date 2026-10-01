import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/site/BrandMark";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Guides", to: "/guides" },
  { label: "Range", to: "/range" },
];

export function AppHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const partnerHref = isAuthenticated ? "/dashboard" : "/auth";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border/80 bg-background/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" aria-label="Meshwire home" className="rounded-md">
          <BrandMark />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const active =
              item.to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/12 text-primary"
                    : "text-foreground/70 hover:bg-primary/8 hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/auth">Partner sign-in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to={partnerHref}>
              Become a partner
              <ArrowUpRight className="size-3.5" />
            </Link>
          </Button>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="inline-flex size-10 items-center justify-center rounded-full text-foreground/80 hover:bg-primary/10 md:hidden"
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-border/60 bg-background/95 backdrop-blur-xl md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-xl px-4 py-3 text-sm font-medium text-foreground/80 hover:bg-primary/10"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to={partnerHref}
              className="mt-2 inline-flex h-10 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground"
            >
              Become a partner
              <ArrowUpRight className="ml-1 size-3.5" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
