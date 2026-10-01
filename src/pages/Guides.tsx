import { Badge } from "@/components/ui/badge";
import { AppHeader } from "@/components/site/AppHeader";
import { AppFooter } from "@/components/site/AppFooter";
import { difficultyLabel, guides, type Difficulty } from "@/data/guides";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

const filters: Array<{ id: Difficulty | "all"; label: string }> = [
  { id: "all", label: "All builds" },
  { id: "starter", label: "Starter" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
];

const difficultyTone: Record<Difficulty, string> = {
  starter: "text-[#1e6b3a] border-[#1e6b3a]/30 bg-[#1e6b3a]/10",
  intermediate: "text-primary border-primary/30 bg-primary/10",
  advanced: "text-[#7d5260] border-[#7d5260]/30 bg-[#7d5260]/10",
};

export default function Guides() {
  const [filter, setFilter] = useState<Difficulty | "all">("all");
  const visible = guides.filter(
    (g) => filter === "all" || g.difficulty === filter,
  );

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 pt-32 pb-20 sm:px-6">
        <h1 className="text-4xl font-normal tracking-tight">
          Hardware build guides
        </h1>
        <p className="mt-3 max-w-xl leading-7 text-muted-foreground">
          Each guide is a build we run year-round: the exact parts, the
          link-budget math, and the mistakes that cost a weekend.
        </p>

        {/* Filter chips */}
        <div className="mt-8 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                filter === f.id
                  ? "bg-secondary-container text-secondary-container-foreground"
                  : "border border-input text-foreground/75 hover:bg-muted",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {visible.map((guide) => (
            <Link
              key={guide.slug}
              to={`/guides/${guide.slug}`}
              className="group block h-full rounded-3xl"
            >
              <article className="flex h-full flex-col rounded-3xl border border-border bg-surface-1 p-6 transition-colors hover:border-primary/40">
                <div className="flex items-center justify-between gap-3">
                  <Badge variant="outline" className={difficultyTone[guide.difficulty]}>
                    {difficultyLabel[guide.difficulty]}
                  </Badge>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="size-3.5" />
                    {guide.readMinutes} min
                  </span>
                </div>
                <h2 className="mt-4 text-xl font-medium group-hover:text-primary">
                  {guide.title}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {guide.tagline}
                </p>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                  {guide.summary}
                </p>
                <div className="mt-auto flex items-center justify-between pt-5">
                  <span className="text-xs text-muted-foreground">
                    Updated{" "}
                    {new Date(guide.updated).toLocaleDateString("en", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-sm font-medium text-primary">
                    Read build →
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {visible.length === 0 && (
          <p className="mt-8 rounded-2xl border border-border bg-surface-1 p-8 text-center text-muted-foreground">
            No guides at this level yet — try another filter.
          </p>
        )}
      </main>
      <AppFooter />
    </div>
  );
}
