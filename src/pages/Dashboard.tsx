import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AppHeader } from "@/components/site/AppHeader";
import { AppFooter } from "@/components/site/AppFooter";
import { Construction, Plus } from "lucide-react";

const contributions = [
  {
    title: "New range report",
    body: "Radio, antenna, preset, terrain — plus the conditions you'd want to know before repeating the test.",
  },
  {
    title: "Node profile",
    body: "Document a gateway or repeater deployment so other teams can reference your setup.",
  },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 pt-32 pb-20 sm:px-6">
        <header>
          <h1 className="text-3xl font-normal tracking-tight sm:text-4xl">
            Partner hub
          </h1>
          <p className="mt-2 max-w-xl leading-7 text-muted-foreground">
            Where deployments get turned into field data. Every honest number
            here saves the next team a weekend of debugging.
          </p>
        </header>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {/* Contribute */}
          <Card className="rounded-3xl border-border bg-surface-1 shadow-none">
            <CardHeader>
              <CardTitle className="font-display text-lg">
                Contribute field data
              </CardTitle>
              <CardDescription>
                Version 1 keeps it simple: submit range reports and node
                details, and the team folds them into the public comparisons.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {contributions.map((item) => (
                <div
                  key={item.title}
                  className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-background p-4"
                >
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {item.body}
                    </p>
                  </div>
                  <Button
                    size="icon-sm"
                    variant="tonal"
                    disabled
                    aria-label={`Add ${item.title} (coming soon)`}
                  >
                    <Plus className="size-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Latest reports */}
          <Card className="rounded-3xl border-border bg-surface-1 shadow-none">
            <CardHeader>
              <CardTitle className="font-display text-lg">
                Latest field reports
              </CardTitle>
              <CardDescription>
                Submissions from partner deployments, once there are any.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-2xl border border-dashed border-border bg-background px-6 py-10 text-center">
                <Construction className="mx-auto size-5 text-muted-foreground" />
                <p className="font-display mt-3 text-sm">No reports yet</p>
                <p className="mx-auto mt-1.5 max-w-xs text-sm leading-6 text-muted-foreground">
                  Submissions are not open in this version. Verified results
                  appear here — and on the range page — when they are real.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scope note */}
        <Card className="mt-6 rounded-3xl border-border bg-muted/50 shadow-none">
          <CardContent className="text-sm leading-6 text-muted-foreground">
            <span className="font-medium text-foreground">Version 1 scope.</span>{" "}
            The hub covers hardware guides and range comparisons only. Guides,
            comparisons, and the submission forms behind them are still being
            written — they will appear here when they are real, not before.
          </CardContent>
        </Card>
      </main>
      <AppFooter />
    </div>
  );
}
