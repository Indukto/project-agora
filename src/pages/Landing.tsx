import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/site/AppHeader";
import { AppFooter } from "@/components/site/AppFooter";
import { MeshHero } from "@/components/site/MeshHero";
import { guides } from "@/data/guides";
import { rangeRecords } from "@/data/range";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  MapPin,
  Mountain,
  Radio,
  Signal,
  Users,
  Waves,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
};

/** Feralui-gradient card: soft aurora wash + grain on a tinted surface. */
function GradientCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "group relative isolate overflow-hidden rounded-3xl border border-border/70 bg-surface-1 p-6 transition-colors duration-300 hover:border-primary/30",
        className,
      )}
    >
      {/* Aurora wash revealed on hover */}
      <div
        aria-hidden="true"
        className="mesh-gradient absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      >
        <div className="mesh-blob animate-drift-a top-[-40%] left-[-20%] size-72 bg-[oklch(0.55_0.16_225/0.35)]" />
        <div className="mesh-blob animate-drift-b right-[-25%] bottom-[-45%] size-80 bg-[oklch(0.6_0.15_170/0.3)]" />
        <div className="mesh-blob animate-drift-c top-[-20%] right-[10%] size-56 bg-[oklch(0.5_0.18_285/0.3)]" />
      </div>
      <div className="relative z-[2]">{children}</div>
    </div>
  );
}

const heroStats = [
  { icon: Signal, label: "Field range records", value: `${rangeRecords.length}` },
  { icon: BookOpen, label: "Hardware build guides", value: `${guides.length}` },
  { icon: Users, label: "Partner networks", value: "26" },
  { icon: Radio, label: "Median longest link", value: "58 km" },
];

const gradientPanels = [
  {
    to: "/guides",
    icon: BookOpen,
    kicker: "Build it right",
    title: "Hardware guides",
    body: "Solar gateways, rooftop backhaul, pocket nodes — step-by-step builds from people who run them year-round.",
    from: "oklch(0.55_0.16_225)",
    accent: "text-[oklch(0.84_0.15_205)]",
  },
  {
    to: "/range",
    icon: Mountain,
    kicker: "Real numbers",
    title: "Range comparisons",
    body: "Field-reported medians by radio, antenna, preset and terrain. No datasheet fairy tales — every record lists its conditions.",
    from: "oklch(0.6_0.15_170)",
    accent: "text-[oklch(0.82_0.17_155)]",
  },
  {
    to: "/dashboard",
    icon: Users,
    kicker: "For partners",
    title: "Partner hub",
    body: "Share your network's field data, get early access to new guides, and help shape what Meshwire documents next.",
    from: "oklch(0.5_0.18_285)",
    accent: "text-[oklch(0.78_0.16_280)]",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      <AppHeader />

      {/* ── Hero: the feralui gradient leads, the words ride on top ── */}
      <section className="mesh-gradient mesh-grain relative overflow-hidden">
        <MeshHero />
        <div className="relative z-[2] mx-auto flex max-w-6xl flex-col items-center px-4 pt-36 pb-20 text-center sm:px-6 sm:pt-44 sm:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <Badge variant="outline" className="mb-6 gap-1.5 backdrop-blur-sm">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex size-1.5 rounded-full bg-success" />
              </span>
              v1 is live — hardware guides &amp; range data
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease }}
            className="max-w-3xl text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl"
          >
            Long-range networks,{" "}
            <span className="text-gradient">built like they'll outlive us</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16, ease }}
            className="mt-6 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8"
          >
            Meshwire is field-tested LoRa documentation: honest hardware
            guides, range data with its conditions attached, and a partner
            network of builders who publish what actually works.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24, ease }}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
          >
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link to="/guides">
                <BookOpen className="size-4" />
                Explore the guides
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
              <Link to="/range">
                <Mountain className="size-4" />
                See real range data
              </Link>
            </Button>
          </motion.div>

          {/* Live-stat strip */}
          <motion.dl
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32, ease }}
            className="mt-14 grid w-full grid-cols-2 gap-3 sm:grid-cols-4"
          >
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-border/60 bg-surface-1/60 px-4 py-4 backdrop-blur-md"
              >
                <stat.icon className="mx-auto mb-2 size-4 text-primary/80" />
                <dd className="font-display text-2xl font-semibold tracking-tight">
                  {stat.value}
                </dd>
                <dt className="mt-0.5 text-xs text-muted-foreground">
                  {stat.label}
                </dt>
              </div>
            ))}
          </motion.dl>
        </div>
        <div className="h-12 bg-gradient-to-b from-transparent to-background" />
      </section>

      {/* ── Partner-first mission strip ── */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <motion.div {...fadeUp} transition={{ duration: 0.6, ease }} className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              <Waves className="size-3.5" />
              Why partners build with us
            </p>
            <h2 className="text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Documentation is infrastructure
            </h2>
            <p className="mt-4 max-w-md leading-7 text-muted-foreground">
              Community networks live or die on whether the next builder can
              reproduce what the last one did. Meshwire exists so that the
              antenna heights, coax runs, and failure stories get written
              down — by the people who measured them.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Badge variant="outline">Field-verified builds</Badge>
              <Badge variant="outline">Open contributions</Badge>
              <Badge variant="outline">No vendor lock</Badge>
            </div>
          </div>
          <div className="relative">
            <div className="mesh-gradient mesh-grain overflow-hidden rounded-3xl border border-border/60 p-6">
              <div className="mesh-blob animate-drift-b top-[-50%] right-[-30%] size-80 bg-[oklch(0.55_0.16_225/0.35)]" />
              <div className="mesh-blob animate-drift-a bottom-[-55%] left-[-20%] size-72 bg-[oklch(0.6_0.15_170/0.3)]" />
              <div className="relative z-[2] space-y-4 font-mono text-[13px] leading-6">
                <p className="text-muted-foreground">
                  <span className="text-primary">// what partners publish</span>
                </p>
                {[
                  { k: "antenna", v: "5.8 dBi omni @ 14 m" },
                  { k: "coax", v: "LMR-400, 4.2 m, 2.5 dB" },
                  { k: "terrain", v: "suburban, 3-storey ridge" },
                  { k: "median", v: "10.5 km @ SF7 / 250 kHz" },
                  { k: "caveat", v: "−18% during heavy rain" },
                ].map((row) => (
                  <div key={row.k} className="flex justify-between gap-4">
                    <span className="text-muted-foreground">{row.k}</span>
                    <span className="text-right text-foreground/90">
                      {row.v}
                    </span>
                  </div>
                ))}
                <p className="pt-2 text-xs text-muted-foreground/70">
                  Every number ships with its conditions. That's the deal.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── The gradient quick-link panels ── */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24">
        <motion.div {...fadeUp} transition={{ duration: 0.6, ease }} className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight">
              Start where you are
            </h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Version 1 keeps the scope tight: build hardware, compare range,
              join the partner network.
            </p>
          </div>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-3">
          {gradientPanels.map((panel, i) => (
            <motion.div
              key={panel.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.08, ease }}
            >
              <Link to={panel.to} className="block h-full rounded-3xl">
                <GradientCard className="h-full">
                  <div className="flex items-start justify-between">
                    <div
                      className={cn(
                        "flex size-11 items-center justify-center rounded-2xl bg-surface-3/80 backdrop-blur-sm",
                      )}
                    >
                      <panel.icon className={cn("size-5", panel.accent)} />
                    </div>
                    <ArrowUpRight className="size-4 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                  </div>
                  <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {panel.kicker}
                  </p>
                  <h3 className="mt-1.5 font-display text-xl font-semibold tracking-tight">
                    {panel.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {panel.body}
                  </p>
                </GradientCard>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Partner CTA on a full-bleed gradient band ── */}
      <section className="relative overflow-hidden">
        <div className="mesh-gradient mesh-grain">
          <div className="absolute inset-0 bg-[radial-gradient(100%_120%_at_50%_100%,oklch(0.26_0.05_240)_0%,oklch(0.17_0.014_260)_70%)]" />
          <div className="mesh-blob animate-drift-a top-[-60%] left-[15%] size-[34rem] bg-[oklch(0.55_0.16_225/0.4)]" />
          <div className="mesh-blob animate-drift-c top-[-40%] right-[10%] size-[30rem] bg-[oklch(0.5_0.18_285/0.35)]" />
        </div>
        <div className="relative z-[2] mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <motion.div {...fadeUp} transition={{ duration: 0.6, ease }}>
            <MapPin className="mx-auto mb-5 size-6 text-primary" />
            <h2 className="text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Your network's data belongs in the field guide
            </h2>
            <p className="mx-auto mt-4 max-w-xl leading-7 text-muted-foreground">
              Partners get a dashboard for their range reports, early drafts of
              new guides, and a direct line to the editors. Publish once, help
              every builder after you.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link to="/auth">
                  Become a partner
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="lg" asChild>
                <Link to="/guides">Just browsing? Read the guides</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <AppFooter />
    </div>
  );
}
