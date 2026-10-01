import { Badge } from "@/components/ui/badge";
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
import { rangeRecords } from "@/data/range";
import { Plus } from "lucide-react";
import { Link } from "react-router";

export default function Dashboard() {
  const latestReports = [...rangeRecords]
    .sort((a, b) => b.rangeKm - a.rangeKm)
    .slice(0, 4);

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 pt-32 pb-20 sm:px-6">
        {/* Welcome */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-normal tracking-tight sm:text-4xl">
              Partner hub
            </h1>
            <p className="mt-2 max-w-xl leading-7 text-muted-foreground">
              Publish field data from your deployments. Every honest number
              here saves the next team a weekend of debugging.
            </p>
          </div>
        </header>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {/* Contribute */}
          <Card className="rounded-3xl border-border bg-surface-1 shadow-none">
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Contribute field data
              </CardTitle>
              <CardDescription>
                Version 1 keeps it simple: submit range reports and node
                details, and the team folds them into the public comparisons.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                {
                  title: "New range report",
                  body: "Radio, antenna, preset, terrain — plus the conditions you'd want to know before repeating the test.",
                },
                {
                  title: "Node profile",
                  body: "Document a gateway or repeater deployment so other teams can reference your setup.",
                },
              ].map((item) => (
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
                    aria-label={`Add ${item.title}`}
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
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-lg font-medium">
                    Latest field reports
                  </CardTitle>
                  <CardDescription>
                    Highest verified medians this quarter.
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild className="shrink-0">
                  <Link to="/range">All records</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {latestReports.map((r) => (
                <div
                  key={`${r.radio}-${r.role}-${r.band}-${r.preset}`}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-background px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{r.radio}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {r.terrain} · {r.antenna}
                    </p>
                  </div>
                  <Badge variant="success" className="shrink-0">
                    {r.rangeKm.toLocaleString("en", { maximumFractionDigits: 1 })} km
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Scope note */}
        <Card className="mt-6 rounded-3xl border-border bg-muted/50 shadow-none">
          <CardContent className="text-sm leading-6 text-muted-foreground">
            <span className="font-medium text-foreground">Version 1 scope.</span>{" "}
            The partner hub covers hardware guides and range comparisons only.
            The resource help center, forums, and meet-up maps are planned for
            later versions — they'll appear here when they're real, not before.
          </CardContent>
        </Card>
      </main>
      <AppFooter />
    </div>
  );
}
