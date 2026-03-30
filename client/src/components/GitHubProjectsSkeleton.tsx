import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function GitHubProjectsSkeleton() {
  return (
    <section
      id="projects"
      className="py-20 sm:py-24 min-h-[560px]"
      data-testid="section-projects"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <span className="font-medium tracking-wide">Projects</span>
          </div>
          <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight leading-[1.15] sm:text-3xl text-foreground">
            Featured projects
          </h2>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="h-9 w-full sm:w-64 rounded-full bg-primary/10" />
          <div className="w-full sm:w-[320px]">
            <div className="h-10 w-full rounded-full bg-primary/10" />
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card
              key={i}
              className="glass rounded-2xl shadow-premium"
              data-testid={`projects-skeleton-card-${i}`}
            >
              <div className="p-6 sm:p-7">
                <Skeleton className="h-5 w-2/3" />
                <div className="mt-3 space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-11/12" />
                  <Skeleton className="h-6 w-4/5" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

