import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/site/AppHeader";
import { AppFooter } from "@/components/site/AppFooter";
import { difficultyLabel, guides, type Difficulty } from "@/data/guides";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  ListChecks,
} from "lucide-react";
import { Link, useParams } from "react-router";

const difficultyTone: Record<Difficulty, string> = {
  starter: "text-[#1e6b3a] border-[#1e6b3a]/30 bg-[#1e6b3a]/10",
  intermediate: "text-primary border-primary/30 bg-primary/10",
  advanced: "text-[#7d5260] border-[#7d5260]/30 bg-[#7d5260]/10",
};

export default function GuideDetail() {
  const { slug } = useParams();
  const index = guides.findIndex((g) => g.slug === slug);
  const guide = guides[index];

  if (!guide) {
    return (
      <div className="flex min-h-screen flex-col">
        <AppHeader />
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-32 text-center">
          <h1 className="text-3xl font-medium">Guide not found</h1>
          <p className="mt-3 text-muted-foreground">
            That build may have been renamed. Head back to the index.
          </p>
          <Button className="mt-6" asChild>
            <Link to="/guides">
              <ArrowLeft className="size-4" />
              All guides
            </Link>
          </Button>
        </main>
        <AppFooter />
      </div>
    );
  }

  const prev = guides[index - 1];
  const next = guides[index + 1];

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-4xl px-4 pt-32 pb-20 sm:px-6">
        <Link
          to="/guides"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          All guides
        </Link>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Badge variant="outline" className={difficultyTone[guide.difficulty]}>
            {difficultyLabel[guide.difficulty]}
          </Badge>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="size-3.5" />
            {guide.readMinutes} min read
          </span>
          <span className="text-xs text-muted-foreground">
            Updated{" "}
            {new Date(guide.updated).toLocaleDateString("en", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        <h1 className="mt-4 text-4xl font-normal tracking-tight">
          {guide.title}
        </h1>
        <p className="mt-3 max-w-2xl text-lg leading-7 text-muted-foreground">
          {guide.tagline}
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_280px]">
          {/* Steps */}
          <div className="min-w-0">
            <p className="leading-7 text-foreground/90">{guide.summary}</p>
            <ol className="mt-8 space-y-8">
              {guide.steps.map((step, i) => (
                <li key={step.title} className="relative flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary-container text-xs font-medium text-secondary-container-foreground">
                      {i + 1}
                    </span>
                    {i < guide.steps.length - 1 && (
                      <span className="mt-2 w-px flex-1 bg-border" />
                    )}
                  </div>
                  <div className="pb-2">
                    <h2 className="text-lg font-medium">{step.title}</h2>
                    <p className="mt-1.5 leading-7 text-muted-foreground">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            {/* Prev / next */}
            <div className="mt-12 grid gap-3 border-t border-border pt-8 sm:grid-cols-2">
              {prev ? (
                <Link
                  to={`/guides/${prev.slug}`}
                  className="group rounded-2xl border border-border bg-surface-1 p-4 transition-colors hover:border-primary/40"
                >
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <ArrowLeft className="size-3.5" />
                    Previous build
                  </span>
                  <span className="mt-1 block font-medium group-hover:text-primary">
                    {prev.title}
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link
                  to={`/guides/${next.slug}`}
                  className="group rounded-2xl border border-border bg-surface-1 p-4 text-right transition-colors hover:border-primary/40 sm:col-start-2"
                >
                  <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                    Next build
                    <ArrowRight className="size-3.5" />
                  </span>
                  <span className="mt-1 block font-medium group-hover:text-primary">
                    {next.title}
                  </span>
                </Link>
              )}
            </div>
          </div>

          {/* Materials sidebar */}
          <aside className="min-w-0">
            <div className="sticky top-24 rounded-3xl border border-border bg-surface-1 p-5">
              <h2 className="flex items-center gap-2 text-base font-medium">
                <ListChecks className="size-4 text-primary" />
                What you'll need
              </h2>
              <ul className="mt-4 space-y-3">
                {guide.materials.map((m) => (
                  <li
                    key={m}
                    className="flex gap-2.5 text-sm leading-6 text-muted-foreground"
                  >
                    <CheckCircle2 className="mt-1 size-4 shrink-0 text-primary/70" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
