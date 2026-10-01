import { AppHeader } from "@/components/site/AppHeader";
import { AppFooter } from "@/components/site/AppFooter";
import { cn } from "@/lib/utils";
import { Construction } from "lucide-react";

export function ComingSoon({
  title,
  description,
  className,
}: {
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <main
        className={cn(
          "mx-auto flex max-w-6xl flex-col px-4 pt-32 pb-20 sm:px-6",
          className,
        )}
      >
        <h1 className="text-4xl font-normal tracking-tight">{title}</h1>
        <p className="mt-3 max-w-xl leading-7 text-muted-foreground">
          {description}
        </p>

        <div className="mt-10 max-w-2xl rounded-3xl border border-dashed border-border bg-surface-1 p-10 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
            <Construction className="size-5 text-muted-foreground" />
          </div>
          <p className="mt-4 font-medium">Nothing published here yet</p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            This section is still being written. We would rather show an empty
            shelf than numbers and build notes we cannot stand behind — real
            guides and measured results land here as they are finished.
          </p>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
