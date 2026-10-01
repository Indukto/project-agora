import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/site/AppHeader";
import { AppFooter } from "@/components/site/AppFooter";
import { LagoonWash } from "@/components/site/LagoonWash";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

const contentLinks = [
  {
    to: "/guides",
    title: "Hardware guides",
    caption: "Build notes from units we run — in progress",
  },
  {
    to: "/range",
    title: "Range comparisons",
    caption: "Measured results with conditions recorded — in progress",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      <AppHeader />

      {/* ── The wash is the design ── */}
      <section className="gradient-lagoon relative overflow-hidden">
        <LagoonWash />
        <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-4 pt-40 pb-16 sm:px-6 sm:pb-20">
          <div className="max-w-xl">
            <h1 className="text-4xl font-medium leading-[1.1] tracking-tight text-[#12191f] sm:text-5xl">
              Project Agora
            </h1>
            <p className="mt-4 text-lg leading-7 text-[#1d2a33]/85">
              Long-range LoRa, documented.
            </p>
            <p className="mt-3 max-w-md text-sm leading-6 text-[#1d2a33]/70">
              Guides and measured results are still being written. We publish a
              section once its numbers and build notes can be defended.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link to="/guides">
                  Read the guides
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-[#12191f]/30 bg-white/40 text-[#12191f] hover:bg-white/70"
                asChild
              >
                <Link to="/range">Range results</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Two quiet entries into the documentation ── */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {contentLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="group rounded-3xl border border-border bg-surface-1 p-7 transition-colors hover:border-primary/40"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">{item.title}</h2>
                <ArrowRight className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
              </div>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {item.caption}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <AppFooter />
    </div>
  );
}
