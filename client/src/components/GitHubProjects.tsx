import { memo, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Github, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  topics?: string[];
};

const GITHUB_USER = "rishanmenezes";
const PROFILE_URL = `https://github.com/${GITHUB_USER}`;

// ─── Curated project data ────────────────────────────────────────────

type CuratedProject = {
  repoName: string;
  displayName: string;
  what: string;
  challenge: string;
  solution: string;
  tech: string[];
  category: "fullstack" | "ai-ml";
  featured?: boolean;
};

const CURATED_PROJECTS: CuratedProject[] = [
  // ── Full Stack ──
  {
    repoName: "ecofinds",
    displayName: "EcoFinds",
    what: "E-commerce platform for sustainable products with real-time inventory and advanced filtering.",
    challenge: "Handling real-time inventory updates without degrading search performance.",
    solution: "Implemented optimistic updates with debounced API calls and memoized filter pipelines.",
    tech: ["React", "TypeScript", "Express", "PostgreSQL"],
    category: "fullstack",
    featured: true,
  },
  {
    repoName: "skysmart",
    displayName: "SkySmart",
    what: "Flight comparison tool with price tracking and multi-airline filtering.",
    challenge: "Complex filtering logic across multiple airlines, dates, and price ranges.",
    solution: "Built a composable filter system with memoized selectors for instant results.",
    tech: ["React", "TypeScript", "Node.js", "Tailwind CSS"],
    category: "fullstack",
  },
  {
    repoName: "college-news-portal",
    displayName: "College News Portal",
    what: "Campus platform centralizing announcements, events, and student engagement.",
    challenge: "Replacing fragmented communication channels with a single unified hub.",
    solution: "Role-based content management with category filtering and real-time updates.",
    tech: ["JavaScript", "Node.js", "Express"],
    category: "fullstack",
  },
  {
    repoName: "mahadasara-auction-arena",
    displayName: "Mahadasara Auction Arena",
    what: "Digital auction platform with item management and transparent bidding history.",
    challenge: "Ensuring bid integrity and preventing race conditions in concurrent bidding.",
    solution: "Transaction-safe bid processing with optimistic locking and real-time state sync.",
    tech: ["React", "TypeScript", "Express", "PostgreSQL"],
    category: "fullstack",
  },
  // ── AI / ML ──
  {
    repoName: "Intent-Trajectory-Prediction",
    displayName: "Intent & Trajectory Prediction",
    what: "Multi-modal trajectory prediction system for autonomous driving using PyTorch.",
    challenge: "Predicting accurate future trajectories from noisy, multi-agent sensor data.",
    solution: "Goal-conditioned prediction with social context features achieving competitive ADE/FDE.",
    tech: ["Python", "PyTorch", "NumPy", "Pandas"],
    category: "ai-ml",
    featured: true,
  },
  {
    repoName: "openenv-customer-support",
    displayName: "OpenEnv — Smart Support RL",
    what: "Reinforcement learning environment for automated customer support ticket resolution.",
    challenge: "Designing a deterministic, graded environment with realistic task difficulty scaling.",
    solution: "Task-based RL environment with per-step reward functions and a deterministic grader.",
    tech: ["Python", "FastAPI", "Docker", "OpenAI API"],
    category: "ai-ml",
  },
  {
    repoName: "red-wine-quality-prediction-ann",
    displayName: "Wine Quality Prediction",
    what: "ANN-based quality classifier for red wine using physicochemical properties.",
    challenge: "Imbalanced classes in quality ratings skewing model accuracy.",
    solution: "Feature engineering with normalization and architecture tuning for balanced prediction.",
    tech: ["Python", "Pandas", "NumPy", "Jupyter"],
    category: "ai-ml",
  },
  {
    repoName: "sentiment-analysis-logistic-regression",
    displayName: "Sentiment Analysis",
    what: "NLP sentiment classifier using logistic regression on text review data.",
    challenge: "Extracting meaningful features from unstructured text with limited preprocessing.",
    solution: "TF-IDF vectorization with regularized logistic regression for high-accuracy classification.",
    tech: ["Python", "Pandas", "NumPy", "Jupyter"],
    category: "ai-ml",
  },
];

// ─── GitHub API fetch (fallback data source) ─────────────────────────

const CACHE_TTL_MS = 10 * 60 * 1000;
let cache: { repos: GitHubRepo[]; fetchedAt: number } | null = null;
let inflight: Promise<GitHubRepo[]> | null = null;

async function fetchReposFromGitHub(signal?: AbortSignal): Promise<GitHubRepo[]> {
  const url = `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`;
  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/vnd.github+json" },
    signal,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GitHub API error (${res.status}). ${text ? text.slice(0, 200) : ""}`.trim());
  }

  return (await res.json()) as GitHubRepo[];
}

// ─── Animation variants ──────────────────────────────────────────────

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const gridVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.98,
    transition: { duration: 0.25, ease: EASE_OUT },
  },
};

// ─── Project Card ────────────────────────────────────────────────────

const ProjectCard = memo(function ProjectCard({
  project,
  repo,
  variant = "default",
}: {
  project: CuratedProject;
  repo?: GitHubRepo;
  variant?: "default" | "featured";
}) {
  const repoUrl = repo?.html_url ?? `https://github.com/${GITHUB_USER}/${project.repoName}`;
  const live = repo?.homepage?.trim() ?? "";
  const hasLive = live.length > 0;
  const liveHref = hasLive && /^https?:\/\//i.test(live) ? live : hasLive ? `https://${live}` : "";
  const [isHovered, setIsHovered] = useState(false);

  const isFeatured = variant === "featured";

  return (
    <motion.div
      variants={cardVariants}
      layout
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        className={cn(
          "glass rounded-2xl shadow-premium card-elevate overflow-hidden",
          isFeatured
            ? "gradient-border-always"
            : "gradient-border",
        )}
        data-testid={`card-project-${project.repoName}`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            window.open(repoUrl, "_blank", "noopener,noreferrer");
          }
        }}
      >
        {/* Featured gradient overlay */}
        {isFeatured ? (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/8" />
        ) : null}

        <div
          className={cn(
            "relative flex h-full flex-col p-7 sm:p-8",
            isFeatured ? "min-h-[360px]" : "min-h-[280px]",
          )}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              {isFeatured ? (
                <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent backdrop-blur">
                  <Sparkles className="h-2.5 w-2.5" />
                  Featured
                </div>
              ) : null}
              <h3
                className={cn(
                  "font-display font-bold tracking-tight",
                  isFeatured ? "text-2xl sm:text-3xl" : "text-lg",
                )}
              >
                {project.displayName}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                {project.what}
              </p>
            </div>
          </div>

          {/* Challenge / Solution — reveals on hover */}
          <motion.div
            className="mt-4 space-y-2 overflow-hidden"
            initial={false}
            animate={{
              height: isHovered || isFeatured ? "auto" : 0,
              opacity: isHovered || isFeatured ? 1 : 0,
            }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="rounded-lg border border-border/30 bg-background/30 p-3 backdrop-blur-sm">
              <p className="text-xs text-muted-foreground/80">
                <span className="font-semibold text-foreground/65">Challenge</span>{" "}
                — {project.challenge}
              </p>
              <p className="mt-1.5 text-xs text-muted-foreground/80">
                <span className="font-semibold text-foreground/65">Solution</span>{" "}
                — {project.solution}
              </p>
            </div>
          </motion.div>

          {/* Tech badges */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.tech.map((t) => (
              <Badge
                key={t}
                variant="secondary"
                className="rounded-full border border-border/40 bg-foreground/[0.03] px-2.5 py-0.5 text-xs text-foreground/80 transition-colors duration-200 hover:bg-foreground/[0.08]"
              >
                {t}
              </Badge>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
            <Button
              asChild
              variant="secondary"
              className="rounded-full px-4 hover:shadow-[0_0_26px_hsl(var(--accent)_/_0.15)] hover:scale-[1.03]"
              data-testid={`button-github-${project.repoName}`}
            >
              <a href={repoUrl} target="_blank" rel="noreferrer">
                <Github className="h-4 w-4" />
                GitHub
              </a>
            </Button>

            {hasLive && (
              <Button
                asChild
                variant="secondary"
                className="rounded-full px-4 hover:shadow-[0_0_26px_hsl(var(--accent)_/_0.15)] hover:scale-[1.03]"
                data-testid={`button-live-${project.repoName}`}
              >
                <a href={liveHref} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  Live
                </a>
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
});

// ─── Section animation variants ──────────────────────────────────────

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: EASE_OUT,
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_OUT },
  },
};

// ─── Main Component ──────────────────────────────────────────────────

export default function GitHubProjects() {
  const [repos, setRepos] = useState<GitHubRepo[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<"all" | "fullstack" | "ai-ml">("all");

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

  const repoMap = useMemo(() => {
    if (!repos) return new Map<string, GitHubRepo>();
    const map = new Map<string, GitHubRepo>();
    for (const r of repos) {
      map.set(r.name.toLowerCase(), r);
    }
    return map;
  }, [repos]);

  const filteredProjects = useMemo(() => {
    if (activeCategory === "all") return CURATED_PROJECTS;
    return CURATED_PROJECTS.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  const fullstackCount = CURATED_PROJECTS.filter((p) => p.category === "fullstack").length;
  const aimlCount = CURATED_PROJECTS.filter((p) => p.category === "ai-ml").length;

  const categories = [
    { key: "all" as const, label: "All", count: CURATED_PROJECTS.length },
    { key: "fullstack" as const, label: "Full Stack", count: fullstackCount },
    { key: "ai-ml" as const, label: "AI / ML", count: aimlCount },
  ];

  return (
    <section
      id="projects"
      className="py-24 sm:py-28 min-h-[560px]"
      data-testid="section-projects"
    >
      <motion.div
        className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        <motion.div className="mb-12" variants={itemVariants}>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-3.5 py-1.5 text-xs text-muted-foreground backdrop-blur">
            <Sparkles className="h-3 w-3" />
            <span className="font-medium tracking-wider uppercase">Projects</span>
          </div>
          <h2 className="mt-5 font-display text-3xl font-bold tracking-tight leading-[1.12] sm:text-4xl text-foreground">
            Featured projects
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground/80 sm:text-base">
            Curated work spanning full-stack applications and AI/ML systems — each built to solve a specific problem.
          </p>
        </motion.div>

        {/* Category toggles */}
        <motion.div className="flex flex-wrap items-center gap-1.5 mb-8" variants={itemVariants}>
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setActiveCategory(cat.key)}
              className={cn(
                "ring-focus relative inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-250",
                activeCategory === cat.key
                  ? "text-foreground"
                  : "text-muted-foreground/70 hover:text-foreground",
              )}
              data-testid={`button-category-${cat.key}`}
            >
              {activeCategory === cat.key && (
                <motion.span
                  layoutId="project-category-indicator"
                  className="absolute inset-0 rounded-full bg-foreground/[0.06] border border-border/50"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                />
              )}
              <span className="relative z-10">{cat.label}</span>
              <span className="relative z-10 text-xs text-muted-foreground/50">({cat.count})</span>
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            className="grid gap-5 md:grid-cols-2"
            data-testid="grid-projects"
            variants={gridVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="glass rounded-2xl shadow-premium">
                  <div className="p-7 sm:p-8">
                    <Skeleton className="h-5 w-2/3" />
                    <div className="mt-4 space-y-3">
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
                  <p className="font-display text-lg font-bold">Projects unavailable</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Unable to fetch repositories right now. You can still view everything on GitHub.
                  </p>
                  <div className="mt-6 flex justify-center">
                    <Button
                      asChild
                      className="rounded-full px-5 hover:shadow-[0_0_26px_hsl(var(--accent)_/_0.18)] hover:scale-[1.03]"
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
            ) : filteredProjects.length === 0 ? (
              <Card className="glass rounded-2xl md:col-span-2">
                <div className="p-8 text-center">
                  <p className="font-display text-lg font-bold">No matching projects</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    No projects match the current filter.
                  </p>
                </div>
              </Card>
            ) : (
              <>
                {filteredProjects.map((project) => {
                  const repo = repoMap.get(project.repoName.toLowerCase());
                  const isFeatured = project.featured && (activeCategory === "all" || activeCategory === project.category);
                  const isFirstFeatured = isFeatured && filteredProjects.indexOf(project) === filteredProjects.findIndex((p) => p.featured && (activeCategory === "all" || activeCategory === p.category));

                  return (
                    <div
                      key={project.repoName}
                      className={cn("min-w-0", isFirstFeatured && "md:col-span-2")}
                    >
                      <ProjectCard
                        project={project}
                        repo={repo}
                        variant={isFirstFeatured ? "featured" : "default"}
                      />
                    </div>
                  );
                })}
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <motion.div
          className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between"
          variants={itemVariants}
        >
          <p className="text-xs text-muted-foreground/60">
            Project data synced with GitHub. Descriptions are curated.
          </p>
          <Button
            asChild
            variant="secondary"
            className="rounded-full px-5 hover:shadow-[0_0_26px_hsl(var(--accent)_/_0.15)] hover:scale-[1.03]"
          >
            <a href={PROFILE_URL} target="_blank" rel="noreferrer">
              View more on GitHub
              <ExternalLink className="h-4.5 w-4.5" />
            </a>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
