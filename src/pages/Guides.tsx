import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/site/AppHeader";
import { AppFooter } from "@/components/site/AppFooter";
import {
  difficultyLabel,
  guides,
  type Difficulty,
} from "@/data/guides";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Clock, Wrench } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

const filters: Array<{ id: Difficulty | "all"; label: string }> = [
  { id: "all", label: "All builds" },
  { id: "starter", label: "Starter" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
];

const difficultyTone: Record<Difficulty, string> = {
  starter: "text-success border-success/25 bg-success/10",
  intermediate: "text-primary border-primary/25 bg-primary/10",
  advanced: "text-[oklch(0.8_0.14_300)] border-[oklch(0.8_0.14_300)]/25 bg-[oklch(0.8_0.14_300)]/10",
};

export default function Guides() {
  const [filter, setFilter] = useState<Difficulty | "all">("all");
  const visible = guides.filter((g) => filter === "all" || g.difficulty === filter);

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="pt-28">
        <section className="mesh-gradient mesh-grain relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(110%_100%_at_50%_0%,oklch(0.22_0.035_235)_0%,var(--background)_72%)]" />
          <div className="mesh-blob animate-drift-b top-[-70%] right-[-10%] size-[30rem] bg-[oklch(0.5_0.14_225/0.3)]" />
          <div className="relative z-[2] mx-auto max-w-6xl px-4 pb-12 sm:px-6">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              <Wrench className="size-3.5" />
              Hardware guides
            </p>
            <h1 className="mt-3 max-w-2xl text-balance font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Builds that survive the weather
            </h1>
            <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
              Each guide is a build someone runs year-round: the exact parts,
              the link-budget math, and the mistakes that cost a weekend.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          {/* Filter chips */}
          <div className="mb-8 flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  filter === f.id
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-surface-1 text-foreground/75 hover:bg-primary/10 hover:text-foreground",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {visible.map((guide) => (
              <Link key={guide.slug} to={`/guides/${guide.slug}`} className="group block h-full rounded-3xl">
                <article className="flex h-full flex-col rounded-3xl border border-border/70 bg-surface-1 p-6 transition-colors duration-300 hover:border-primary/30">
                  <div className="flex items-center justify-between gap-3">
                    <Badge
                      variant="outline"
                      className={difficultyTone[guide.difficulty]}
                    >
                      {difficultyLabel[guide.difficulty]}
                    </Badge>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="size-3.5" />
                      {guide.readMinutes} min
                    </span>
                  </div>
                  <h2 className="mt-4 font-display text-xl font-semibold tracking-tight group-hover:text-primary">
                    {guide.title}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {guide.tagline}
                  </p>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground/85">
                    {guide.summary}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-5">
                    <span className="text-xs text-muted-foreground/70">
                      Updated {new Date(guide.updated).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <span className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      Read build <ArrowUpRight className="size-4" />
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {visible.length === 0 && (
            <p className="rounded-2xl border border-border bg-surface-1 p-8 text-center text-muted-foreground">
              No guides at this level yet — try another filter.
            </p>
          )}
        </section>
      </main>
      <AppFooter />
    </div>
  );
}
