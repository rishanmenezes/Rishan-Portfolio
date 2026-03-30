import { memo, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type GitHubRepo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  updated_at: string;
  fork: boolean;
  homepage: string | null;
  language: string | null;
  topics?: string[]; // May be undefined depending on GitHub response shape
};

const GITHUB_USER = "rishanmenezes";
const PROFILE_URL = `https://github.com/${GITHUB_USER}`;

const prioritizedRepoNames = [
  "ecofinds",
  "skysmart",
  "college-news-portal",
  "mahadasara-auction-arena",
  "clearcity",
  "shivcloud",
] as const;

const projectDescriptions: Record<string, string> = {
  ecofinds:
    "Sustainable shopping experience with curated eco-friendly product listings.",
  skysmart:
    "Flight booking interface with filtering and a modern, user-first UI.",
  "college-news-portal":
    "Campus hub for announcements, events, and updates in one place.",
  "mahadasara-auction-arena":
    "Auction arena UI concept for items, bidding details, and structured listings.",
  clearcity:
    "Urban cleanliness and civic awareness platform with a clean, accessible experience.",
  shivcloud:
    "Cloud-inspired frontend project showcasing responsive layouts and polished UI.",
};

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
let cache:
  | {
      repos: GitHubRepo[];
      fetchedAt: number;
    }
  | null = null;
let inflight: Promise<GitHubRepo[]> | null = null;

function toTopicLabel(topic: string) {
  // Keep labels readable; topics are typically lowercase with hyphens.
  return topic
    .trim()
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function cleanDescription(desc: string) {
  return desc.replace(/\s+/g, " ").trim();
}

function formatPrettyRepoName(name: string) {
  return name
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function generateDescription(repo: Pick<GitHubRepo, "name" | "topics" | "language">) {
  const pretty = formatPrettyRepoName(repo.name);
  const topics = (repo.topics ?? []).filter(Boolean);
  const topTopics = topics.slice(0, 3);
  const lang = repo.language ? repo.language : "";

  if (topTopics.length > 0 && lang) {
    return `${pretty} featuring ${topTopics.join(
      ", ",
    )} built with ${lang}.`;
  }

  if (topTopics.length > 0) {
    return `${pretty} featuring ${topTopics.join(", ")}.`;
  }

  if (lang) {
    return `${pretty} built with ${lang}.`;
  }

  return `${pretty} - modern project showcasing practical implementation.`;
}

function isRecentWithin6Months(updatedAtIso: string) {
  const sixMonthsAgo = Date.now() - 1000 * 60 * 60 * 24 * 183; // Approx. 6 months
  const updated = Date.parse(updatedAtIso);
  return Number.isFinite(updated) && updated >= sixMonthsAgo;
}

async function fetchReposFromGitHub(signal?: AbortSignal): Promise<GitHubRepo[]> {
  const perPage = 100;
  const url = `https://api.github.com/users/${GITHUB_USER}/repos?per_page=${perPage}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      // Request standard JSON; GitHub may still omit `topics` depending on API response.
      Accept: "application/vnd.github+json",
    },
    signal,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `GitHub API error (${res.status}). ${text ? text.slice(0, 200) : ""}`.trim(),
    );
  }

  const data = (await res.json()) as GitHubRepo[];
  return data;
}

function inferTechBadges(repo: GitHubRepo) {
  const badges: string[] = [];
  const seen = new Set<string>();

  if (repo.language) {
    const normalized = repo.language.toLowerCase();
    if (!seen.has(normalized)) {
      seen.add(normalized);
      badges.push(repo.language);
    }
  }

  const topics = repo.topics ?? [];
  for (const topic of topics) {
    if (!topic) continue;
    const normalized = topic.toLowerCase();
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    badges.push(toTopicLabel(topic));
    if (badges.length >= 5) break;
  }

  return badges;
}

function projectPriorityIndex(name: string) {
  const i = prioritizedRepoNames.indexOf(name as (typeof prioritizedRepoNames)[number]);
  return i === -1 ? Number.MAX_SAFE_INTEGER : i;
}

function selectDescription(repo: GitHubRepo) {
  if (repo.description && repo.description.trim()) {
    return cleanDescription(repo.description);
  }
  const mapped = projectDescriptions[repo.name];
  if (mapped) return mapped;
  return generateDescription(repo);
}

function applyProjectRules(repos: GitHubRepo[]) {
  const filtered = repos.filter((repo) => {
    const name = repo.name;
    if (name.toUpperCase().includes("PRODIGY")) return false;
    if (name === GITHUB_USER) return false;
    if (repo.fork) return false;

    const hasDescription = !!repo.description?.trim();
    const hasStars = repo.stargazers_count > 0;
    const recent = isRecentWithin6Months(repo.updated_at);

    return hasDescription || hasStars || recent;
  });

  filtered.sort((a, b) => {
    const pa = projectPriorityIndex(a.name);
    const pb = projectPriorityIndex(b.name);
    if (pa !== pb) return pa - pb;

    if (a.stargazers_count !== b.stargazers_count) {
      return b.stargazers_count - a.stargazers_count;
    }

    return Date.parse(b.updated_at) - Date.parse(a.updated_at);
  });

  return filtered.slice(0, 6);
}

const ProjectCard = memo(function ProjectCard({
  repo,
  description,
  techBadges,
  variant = "default",
}: {
  repo: GitHubRepo;
  description: string;
  techBadges: string[];
  variant?: "default" | "featured";
}) {
  const live = repo.homepage?.trim() ?? "";
  const hasLive = live.length > 0;
  const liveHref =
    hasLive && /^https?:\/\//i.test(live) ? live : hasLive ? `https://${live}` : "";

  const isFeatured = variant === "featured";

  return (
    <Card
      className={cn(
        "glass rounded-2xl shadow-premium transition-all duration-300",
        isFeatured
          ? "relative overflow-hidden border border-accent/35 hover:-translate-y-1 hover:scale-[1.01]"
          : "hover:-translate-y-1 hover:scale-[1.01]",
        "hover:shadow-[0_1px_0_hsl(var(--foreground)_/_0.06),_0_26px_70px_hsl(var(--foreground)_/_0.12)]",
      )}
      data-testid={`card-project-${repo.name}`}
    >
      {isFeatured ? (
        <div className="pointer-events-none absolute inset-0 opacity-70 bg-gradient-to-br from-primary/15 via-transparent to-accent/10" />
      ) : null}
      {isFeatured ? (
        <div className="pointer-events-none absolute left-5 top-5 rounded-full border border-accent/20 bg-background/40 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-foreground/70 backdrop-blur">
          Featured
        </div>
      ) : null}

      <div
        className={cn(
          "flex h-full flex-col p-7 sm:p-8",
          isFeatured ? "min-h-[340px]" : "min-h-[260px]",
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3
              className={cn(
                "font-display font-semibold tracking-tight",
                isFeatured ? "text-2xl" : "text-lg",
              )}
            >
              {repo.name}
            </h3>
            <p
              className={cn(
                "mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground sm:text-sm",
                isFeatured ? "text-sm" : "text-sm",
              )}
            >
              {description}
            </p>
          </div>
        </div>

        <div className="mt-3.5 flex flex-wrap gap-2">
          {techBadges.map((t) => (
            <Badge
              key={t}
              variant="secondary"
              className="rounded-full border border-border/60 bg-foreground/5 text-foreground/90"
            >
              {t}
            </Badge>
          ))}
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-3">
          <Button
            asChild
            variant="secondary"
            className="rounded-full hover:shadow-[0_0_26px_hsl(var(--accent)_/_0.18)] hover:scale-[1.02]"
            data-testid={`button-github-${repo.name}`}
          >
            <a href={repo.html_url} target="_blank" rel="noreferrer">
              <Github className="h-4.5 w-4.5" />
              GitHub
            </a>
          </Button>

          {hasLive && (
            <Button
              asChild
              variant="secondary"
              className="rounded-full hover:shadow-[0_0_26px_hsl(var(--accent)_/_0.18)] hover:scale-[1.02]"
              data-testid={`button-live-${repo.name}`}
            >
              <a href={liveHref} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4.5 w-4.5" />
                Live
              </a>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
});

export default function GitHubProjects() {
  const [repos, setRepos] = useState<GitHubRepo[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);

      try {
        if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
          setRepos(cache.repos);
          setLoading(false);
          return;
        }

        if (!inflight) {
          inflight = fetchReposFromGitHub(controller.signal).finally(() => {
            inflight = null;
          });
        }

        const fetched = await inflight;
        if (cancelled) return;

        cache = { repos: fetched, fetchedAt: Date.now() };
        setRepos(fetched);
        setLoading(false);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load projects.");
        setRepos(null);
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  const topProjects = useMemo(() => {
    if (!repos) return [];
    return applyProjectRules(repos);
  }, [repos]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return topProjects;

    return topProjects.filter((p) => {
      const tech = inferTechBadges(p).join(" ").toLowerCase();
      const hay = `${p.name} ${p.description ?? ""} ${tech}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query, topProjects]);

  const projectCards = useMemo(() => {
    return visible.map((repo) => ({
      repo,
      description: selectDescription(repo),
      techBadges: inferTechBadges(repo),
    }));
  }, [visible]);

  return (
    <section id="projects" className="py-20 sm:py-24" data-testid="section-projects">
      <motion.div
        className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <span className="font-medium tracking-wide">Projects</span>
          </div>
          <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight leading-[1.15] sm:text-3xl text-foreground">
            Featured projects
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            GitHub-driven portfolio highlights with clean UI and practical implementation.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              {visible.length} {visible.length === 1 ? "project" : "projects"}
            </span>
          </div>

          <div className="w-full sm:w-[320px]">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter projects..."
              className="rounded-full"
              data-testid="input-project-search"
            />
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2" data-testid="grid-projects">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="glass rounded-2xl shadow-premium">
                <div className="p-6 sm:p-7">
                  <Skeleton className="h-5 w-2/3" />
                  <div className="mt-3 space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-11/12" />
                    <Skeleton className="h-6 w-4/5" />
                  </div>
                </div>
              </Card>
            ))
          ) : error ? (
            <Card className="glass rounded-2xl md:col-span-2">
              <div className="p-8 text-center">
                <p className="font-display text-lg font-semibold">Projects unavailable</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Unable to fetch repositories right now. You can still view everything on GitHub.
                </p>
                <div className="mt-6 flex justify-center">
                  <Button
                    asChild
                    className="rounded-full hover:shadow-[0_0_26px_hsl(var(--accent)_/_0.18)] hover:scale-[1.02]"
                    variant="secondary"
                  >
                    <a href={PROFILE_URL} target="_blank" rel="noreferrer">
                      <Github className="h-4.5 w-4.5" />
                      View on GitHub
                    </a>
                  </Button>
                </div>
              </div>
            </Card>
          ) : visible.length === 0 ? (
            <Card className="glass rounded-2xl md:col-span-2">
              <div className="p-8 text-center">
                <p className="font-display text-lg font-semibold">No matching projects</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  No additional projects match the current filter.
                </p>
              </div>
            </Card>
          ) : (
            <>
              {projectCards[0] ? (
                <div className="md:col-span-2 min-w-0">
                  <ProjectCard
                    variant="featured"
                    repo={projectCards[0].repo}
                    description={projectCards[0].description}
                    techBadges={projectCards[0].techBadges}
                  />
                </div>
              ) : null}

              {projectCards.slice(1).map(({ repo, description, techBadges }) => (
                <div key={repo.id} className="min-w-0">
                  <ProjectCard repo={repo} description={description} techBadges={techBadges} />
                </div>
              ))}
            </>
          )}
        </div>

        <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            Showing the latest matching repositories from GitHub.
          </p>
          <Button
            asChild
            variant="secondary"
            className="rounded-full hover:shadow-[0_0_26px_hsl(var(--accent)_/_0.18)] hover:scale-[1.02]"
          >
            <a href={PROFILE_URL} target="_blank" rel="noreferrer">
              View more on GitHub
              <ExternalLink className="h-4.5 w-4.5" />
            </a>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}

