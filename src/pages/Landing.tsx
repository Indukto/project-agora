import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/site/AppHeader";
import { AppFooter } from "@/components/site/AppFooter";
import { guides } from "@/data/guides";
import { rangeRecords } from "@/data/range";
import { cn } from "@/lib/utils";
import { ArrowRight, BookOpen, Mountain } from "lucide-react";
import { Link } from "react-router";

/** Tonal panel: secondary-container surface for the partner band. */
function TonalPanel({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl bg-secondary-container px-6 py-12 text-secondary-container-foreground sm:px-10",
        className,
      )}
    >
      {children}
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen">
      <AppHeader />

      {/* ── Hero: left-aligned, flat, no gradient ── */}
      <section className="mx-auto max-w-6xl px-4 pt-36 pb-16 sm:px-6 sm:pt-44">
        <Badge variant="outline" className="mb-5">
          v1 — hardware guides and range data
        </Badge>
        <h1 className="max-w-2xl text-4xl font-normal leading-[1.15] tracking-tight sm:text-[3.4rem]">
          Documentation for our long-range{" "}
          <span className="text-primary">LoRa</span> solution
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
          Project Agora is how we document the solution: build guides for the
          hardware, measured range results, and the reasoning behind each
          design decision.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" asChild>
            <Link to="/guides">
              Read the guides
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/range">See range results</Link>
          </Button>
        </div>
      </section>

      {/* ── Two content cards, unequal columns ── */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="grid gap-4 md:grid-cols-5">
          <Link
            to="/guides"
            className="group rounded-3xl border border-border bg-surface-1 p-8 transition-colors hover:border-primary/40 md:col-span-3"
          >
            <div className="flex items-center justify-between">
              <BookOpen className="size-5 text-primary" />
              <ArrowRight className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
            </div>
            <h2 className="mt-16 text-2xl font-medium tracking-tight">
              Hardware build guides
            </h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              {guides.length} field-tested builds — solar gateways, rooftop
              links, pocket nodes — with parts lists and the mistakes to avoid.
            </p>
          </Link>

          <Link
            to="/range"
            className="group rounded-3xl border border-border bg-surface-1 p-8 transition-colors hover:border-primary/40 md:col-span-2"
          >
            <div className="flex items-center justify-between">
              <Mountain className="size-5 text-primary" />
              <ArrowRight className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
            </div>
            <h2 className="mt-16 text-2xl font-medium tracking-tight">
              Range comparisons
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {rangeRecords.length} measured results, each with its antenna,
              preset and conditions recorded.
            </p>
          </Link>
        </div>
      </section>

      {/* ── Partner band on secondary container ── */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <TonalPanel>
          <h2 className="max-w-lg text-2xl font-medium tracking-tight sm:text-3xl">
            Building a network with us?
          </h2>
          <p className="mt-3 max-w-md text-sm leading-6 opacity-80">
            Partners and team members can sign in to contribute deployment
            data and follow new documentation as it lands.
          </p>
          <Button variant="tonal" className="mt-6 bg-white text-secondary-container-foreground hover:bg-white/90" asChild>
            <Link to="/auth">
              Team and partner sign-in
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </TonalPanel>
      </section>

      <AppFooter />
    </div>
  );
}
