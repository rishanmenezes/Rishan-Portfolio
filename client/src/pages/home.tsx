import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Moon,
  Sun,
  ExternalLink,
  Code2,
  Terminal,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

type GithubRepo = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  topics?: string[];
  fork: boolean;
  archived: boolean;
  stargazers_count: number;
  updated_at: string;
};

const PROFILE = {
  name: "Rishan Menezes",
  title: "Aspiring Software Engineer | Full Stack Web Developer",
  email: "rishanmenezes05@gmail.com",
  location: "Mysuru, Karnataka, India",
  status: "Third Year Computer Science & Engineering Student at Maharaja Institute of Technology, Mysore.",
  about:
    "I am a third-year Computer Science Engineering student with a strong interest in full-stack web development and software engineering. I enjoy building responsive, user-focused web applications and learning modern technologies through real-world projects. I focus on writing clean, maintainable code.",
  skills: {
    languages: ["C", "Python", "JavaScript", "TypeScript"],
    web: ["HTML", "CSS", "React.js", "Tailwind CSS"],
    concepts: ["Data Structures & Algorithms (academic level)"],
    tools: ["Git", "GitHub", "VS Code"],
  },
  links: {
    linkedin: "https://www.linkedin.com/in/rishan-menezes/",
    github: "https://github.com/rishanmenezes/",
    leetcode: "https://leetcode.com/u/rishanmenezes/",
    instagram: "https://www.instagram.com/rizzshhan/",
  },
} as const;

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

function useActiveSection(sectionIds: string[]) {
  const [active, setActive] = useState(sectionIds[0] ?? "hero");

  useEffect(() => {
    const els = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));
        if (visible[0]?.target?.id) setActive(visible[0].target.id);
      },
      { root: null, threshold: [0.2, 0.35, 0.5, 0.65], rootMargin: "-15% 0px -70% 0px" },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIds]);

  return active;
}

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short" });
  } catch {
    return "";
  }
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Container({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>;
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-10">
      <div
        className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur"
        data-testid={`text-eyebrow-${eyebrow.toLowerCase().replace(/\s+/g, "-")}`}
      >
        <Sparkles className="h-3.5 w-3.5" />
        <span className="font-medium tracking-wide">{eyebrow}</span>
      </div>
      <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight sm:text-3xl" data-testid={`text-section-${title.toLowerCase().replace(/\s+/g, "-")}`}>
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base" data-testid={`text-subtitle-${title.toLowerCase().replace(/\s+/g, "-")}`}>
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const resolved = theme === "system" ? systemTheme : theme;
  const isDark = resolved === "dark";

  return (
    <button
      type="button"
      className="ring-focus inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background/70 text-foreground/80 shadow-sm backdrop-blur transition hover:bg-background"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      data-testid="button-theme-toggle"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
    </button>
  );
}

function TopNav() {
  const items = useMemo(
    () =>
      [
        { id: "about", label: "About" },
        { id: "skills", label: "Skills" },
        { id: "projects", label: "Projects" },
        { id: "profiles", label: "Profiles" },
        { id: "contact", label: "Contact" },
      ] as const,
    [],
  );

  const active = useActiveSection(items.map((i) => i.id));

  return (
    <div className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/55">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <button
            type="button"
            className="group inline-flex items-center gap-2 rounded-full px-2 py-1 ring-focus"
            onClick={() => scrollToId("hero")}
            data-testid="button-nav-home"
            aria-label="Scroll to top"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 ring-1 ring-border/60">
              <Code2 className="h-4.5 w-4.5 text-foreground/80" />
            </span>
            <span className="hidden text-sm font-semibold tracking-tight sm:inline">
              {PROFILE.name}
            </span>
          </button>

          <div className="hidden items-center gap-1 md:flex">
            {items.map((item) => {
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToId(item.id)}
                  className={cx(
                    "ring-focus rounded-full px-3 py-2 text-sm transition",
                    isActive
                      ? "bg-foreground/5 text-foreground"
                      : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
                  )}
                  data-testid={`button-nav-${item.id}`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <a
              href={PROFILE.links.github}
              target="_blank"
              rel="noreferrer"
              className="ring-focus inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background/70 text-foreground/80 shadow-sm backdrop-blur transition hover:bg-background"
              aria-label="Open GitHub"
              data-testid="link-github-top"
            >
              <Github className="h-4.5 w-4.5" />
            </a>
            <ThemeToggle />
          </div>
        </div>
      </Container>
    </div>
  );
}

function Hero() {
  const reduced = useReducedMotion();

  return (
    <section id="hero" className="relative overflow-hidden" data-testid="section-hero">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 grid-fade opacity-60" />
        <div className="absolute left-1/2 top-[-320px] h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-primary/30 via-accent/25 to-transparent blur-3xl" />
        <div className="absolute bottom-[-320px] right-[-120px] h-[520px] w-[520px] rounded-full bg-gradient-to-tr from-accent/25 via-primary/20 to-transparent blur-3xl" />
        <div className="absolute inset-0 noise" />
      </div>

      <Container>
        <div className="relative py-16 sm:py-20 lg:py-24">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="grid items-start gap-10 lg:grid-cols-[1.3fr_0.7fr]"
          >
            <div>
              <div
                className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur"
                data-testid="status-current"
              >
                <GraduationCap className="h-3.5 w-3.5" />
                <span className="font-medium">{PROFILE.status}</span>
              </div>

              <h1
                className="mt-5 font-display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl"
                data-testid="text-hero-title"
              >
                I’m <span className="text-gradient">{PROFILE.name}</span>.
              </h1>

              <p
                className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
                data-testid="text-hero-subtitle"
              >
                Third-year Computer Science student building modern, scalable web applications.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2" data-testid="text-hero-location">
                  <MapPin className="h-4 w-4" />
                  {PROFILE.location}
                </span>
                <span className="hidden h-4 w-px bg-border sm:inline" />
                <a
                  href={`mailto:${PROFILE.email}`}
                  className="inline-flex items-center gap-2 underline-offset-4 hover:underline"
                  data-testid="link-email-hero"
                >
                  <Mail className="h-4 w-4" />
                  {PROFILE.email}
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  className="rounded-full"
                  onClick={() => scrollToId("projects")}
                  data-testid="button-view-projects"
                >
                  View Projects
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  className="rounded-full"
                  onClick={() => scrollToId("contact")}
                  data-testid="button-contact"
                >
                  Contact Me
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full opacity-50 cursor-not-allowed"
                  disabled
                  data-testid="button-download-resume"
                >
                  Download Resume
                </Button>
              </div>
            </div>

            <div className="lg:pt-2">
              <Card className="glass shadow-premium overflow-hidden rounded-2xl" data-testid="card-quick-summary">
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-muted-foreground" data-testid="text-card-eyebrow">
                        Quick summary
                      </p>
                      <p
                        className="mt-1 font-display text-xl font-semibold tracking-tight"
                        data-testid="text-card-title"
                      >
                        Clean code. Real projects. Great UX.
                      </p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 ring-1 ring-border/60">
                      <Terminal className="h-5 w-5 text-foreground/80" />
                    </div>
                  </div>

                  <Separator className="my-5" />

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between" data-testid="row-summary-role">
                      <span className="text-muted-foreground">Role</span>
                      <span className="font-medium">Student / Developer</span>
                    </div>
                    <div className="flex items-center justify-between" data-testid="row-summary-focus">
                      <span className="text-muted-foreground">Focus</span>
                      <span className="font-medium">Full-stack web</span>
                    </div>
                    <div className="flex items-center justify-between" data-testid="row-summary-stack">
                      <span className="text-muted-foreground">Stack</span>
                      <span className="font-medium">React • TS • Tailwind</span>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2" data-testid="list-highlights">
                    {["Responsive UI", "Modern tooling", "Maintainable code"].map((t) => (
                      <Badge
                        key={t}
                        variant="secondary"
                        className="rounded-full"
                        data-testid={`badge-highlight-${t.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="py-16 sm:py-20" data-testid="section-about">
      <Container>
        <SectionHeader
          eyebrow="About"
          title="About me"
          subtitle="A quick snapshot of who I am and what I care about when building software."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="glass shadow-premium rounded-2xl" data-testid="card-about">
            <div className="p-6 sm:p-7">
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base" data-testid="text-about-body">
                {PROFILE.about}
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border/70 bg-background/60 p-4" data-testid="card-about-status">
                  <p className="text-xs text-muted-foreground">Currently</p>
                  <p className="mt-1 text-sm font-medium">Third Year CSE</p>
                </div>
                <div className="rounded-xl border border-border/70 bg-background/60 p-4" data-testid="card-about-location">
                  <p className="text-xs text-muted-foreground">Based in</p>
                  <p className="mt-1 text-sm font-medium">Mysuru, India</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="glass shadow-premium rounded-2xl" data-testid="card-about-strengths">
            <div className="p-6 sm:p-7">
              <h3 className="font-display text-lg font-semibold" data-testid="text-about-strengths-title">
                What you can expect
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground" data-testid="list-about-strengths">
                {[
                  "Clean, maintainable code with strong fundamentals.",
                  "Responsive UI with attention to interaction details.",
                  "Modern React + TypeScript workflow.",
                  "Always learning through real-world projects.",
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-3" data-testid={`item-strength-${idx}`}>
                    <span className="mt-1 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-foreground/5">
                      <span className="h-1.5 w-1.5 rounded-full bg-foreground/60" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
}

function Skills() {
  const groups = [
    { label: "Programming", items: PROFILE.skills.languages },
    { label: "Web", items: PROFILE.skills.web },
    { label: "Core concepts", items: PROFILE.skills.concepts },
    { label: "Tools", items: PROFILE.skills.tools },
  ] as const;

  return (
    <section id="skills" className="py-16 sm:py-20" data-testid="section-skills">
      <Container>
        <SectionHeader
          eyebrow="Skills"
          title="Tools & technologies"
          subtitle="A focused set of skills I use to build modern, responsive web applications."
        />

        <div className="grid gap-6 md:grid-cols-2" data-testid="grid-skills">
          {groups.map((g) => (
            <Card key={g.label} className="glass shadow-premium rounded-2xl" data-testid={`card-skill-${g.label.toLowerCase().replace(/\s+/g, "-")}`}>
              <div className="p-6 sm:p-7">
                <h3 className="font-display text-lg font-semibold" data-testid={`text-skill-title-${g.label.toLowerCase().replace(/\s+/g, "-")}`}>
                  {g.label}
                </h3>
                <div className="mt-4 flex flex-wrap gap-2" data-testid={`list-skill-badges-${g.label.toLowerCase().replace(/\s+/g, "-")}`}>
                  {g.items.map((item) => (
                    <Badge
                      key={item}
                      variant="secondary"
                      className="rounded-full border border-border/60 bg-foreground/5 text-foreground/90"
                      data-testid={`badge-skill-${item.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Projects() {
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const url = "https://api.github.com/users/rishanmenezes/repos?per_page=100&sort=updated";
        const res = await fetch(url, {
          headers: {
            Accept: "application/vnd.github+json",
          },
        });

        if (!res.ok) {
          throw new Error(`GitHub request failed (${res.status})`);
        }

        const data = (await res.json()) as GithubRepo[];

        const filtered = data
          .filter((r) => !r.fork && !r.archived)
          .filter((r) => !/prodigy/i.test(r.name) && !/prodigy/i.test(r.full_name))
          .filter((r) => (r.description ?? "").toLowerCase().includes("prodigy") === false)
          .slice(0, 6)
          .sort((a, b) => {
            const sa = a.stargazers_count ?? 0;
            const sb = b.stargazers_count ?? 0;
            if (sb !== sa) return sb - sa;
            return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
          });

        if (!cancelled) setRepos(filtered);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Failed to load projects");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return repos;
    return repos.filter((r) => {
      const hay = `${r.name} ${(r.description ?? "")} ${(r.language ?? "")}`.toLowerCase();
      return hay.includes(q);
    });
  }, [repos, query]);

  return (
    <section id="projects" className="py-16 sm:py-20" data-testid="section-projects">
      <Container>
        <SectionHeader
          eyebrow="Projects"
          title="Featured projects"
          subtitle="A collection of my personal and academic work, ranging from web applications to software tools."
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground" data-testid="text-projects-meta">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Recent builds
            </span>
            <span className="hidden h-4 w-px bg-border sm:inline" />
            <span>{loading ? "Loading…" : `${visible.length} projects`}</span>
          </div>

          <div className="w-full sm:w-[320px]">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects…"
              className="rounded-full"
              data-testid="input-project-search"
            />
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2" data-testid="grid-projects">
          {loading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <Card key={idx} className="glass rounded-2xl" data-testid={`skeleton-project-${idx}`}>
                <div className="p-6">
                  <div className="h-5 w-44 rounded bg-foreground/10" />
                  <div className="mt-4 space-y-2">
                    <div className="h-3 w-full rounded bg-foreground/10" />
                    <div className="h-3 w-5/6 rounded bg-foreground/10" />
                  </div>
                  <div className="mt-5 flex gap-2">
                    <div className="h-6 w-16 rounded-full bg-foreground/10" />
                    <div className="h-6 w-20 rounded-full bg-foreground/10" />
                  </div>
                </div>
              </Card>
            ))
          ) : error ? (
            <Card className="glass rounded-2xl md:col-span-2" data-testid="card-projects-error">
              <div className="p-6">
                <p className="text-sm text-muted-foreground" data-testid="text-projects-error">
                  {error}
                </p>
                <div className="mt-4">
                  <Button
                    variant="secondary"
                    className="rounded-full"
                    onClick={() => window.location.reload()}
                    data-testid="button-projects-retry"
                  >
                    Retry
                  </Button>
                </div>
              </div>
            </Card>
          ) : visible.length === 0 ? (
            <Card className="glass rounded-2xl md:col-span-2" data-testid="card-projects-empty">
              <div className="p-8 text-center">
                <p className="font-display text-lg font-semibold" data-testid="text-projects-empty-title">
                  No matches
                </p>
                <p className="mt-2 text-sm text-muted-foreground" data-testid="text-projects-empty-subtitle">
                  Try a different search term.
                </p>
              </div>
            </Card>
          ) : (
            visible.map((r) => (
              <Card
                key={r.id}
                className="group glass shadow-premium rounded-2xl transition hover:-translate-y-0.5 hover:shadow-[0_1px_0_hsl(var(--foreground)_/_0.06),_0_26px_70px_hsl(var(--foreground)_/_0.12)]"
                data-testid={`card-project-${r.id}`}
              >
                <div className="p-6 sm:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3
                        className="font-display text-lg font-semibold tracking-tight"
                        data-testid={`text-project-name-${r.id}`}
                      >
                        {r.name}
                      </h3>
                      <p
                        className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground"
                        data-testid={`text-project-desc-${r.id}`}
                      >
                        {r.description || "Personal project focusing on clean code and user experience."}
                      </p>
                    </div>
                    <a
                      href={r.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="ring-focus inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background/60 text-foreground/80 transition hover:bg-background"
                      aria-label="Open GitHub repo"
                      data-testid={`link-project-github-${r.id}`}
                    >
                      <ExternalLink className="h-4.5 w-4.5" />
                    </a>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-2" data-testid={`list-project-meta-${r.id}`}>
                    {r.language ? (
                      <div className="flex items-center gap-1.5 rounded-full border border-border/60 bg-foreground/5 px-2.5 py-0.5 text-xs font-medium text-foreground/90">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {r.language}
                      </div>
                    ) : null}
                    <Badge
                      variant="secondary"
                      className="rounded-full border border-border/60 bg-foreground/5"
                      data-testid={`badge-project-updated-${r.id}`}
                    >
                      {formatDate(r.updated_at)}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </Container>
    </section>
  );
}

function Profiles() {
  const items = [
    { label: "LinkedIn", href: PROFILE.links.linkedin, icon: Linkedin },
    { label: "GitHub", href: PROFILE.links.github, icon: Github },
    { label: "LeetCode", href: PROFILE.links.leetcode, icon: Code2, sub: "Problem-solving practice" },
    { label: "Instagram", href: PROFILE.links.instagram, icon: Sparkles },
  ] as const;

  return (
    <section id="profiles" className="py-16 sm:py-20" data-testid="section-profiles">
      <Container>
        <SectionHeader
          eyebrow="Profiles"
          title="Find me online"
          subtitle="Explore my professional presence and technical activity across various platforms."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" data-testid="grid-profiles">
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="group glass shadow-premium rounded-2xl p-6 transition hover:-translate-y-0.5"
              data-testid={`link-profile-${item.label.toLowerCase()}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 ring-1 ring-border/60">
                  <item.icon className="h-5 w-5 text-foreground/80" />
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5" />
              </div>
              <p className="mt-4 font-display text-base font-semibold" data-testid={`text-profile-title-${item.label.toLowerCase()}`}>
                {item.label}
              </p>
              <p className="mt-1 text-xs text-muted-foreground" data-testid={`text-profile-url-${item.label.toLowerCase()}`}>
                {item.sub || item.href.replace(/^https?:\/\//, "")}
              </p>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const mailto = useMemo(() => {
    const subject = encodeURIComponent(`Portfolio contact — ${name || ""}`.trim());
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`.trim());
    return `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;
  }, [name, email, message]);

  return (
    <section id="contact" className="py-16 sm:py-20" data-testid="section-contact">
      <Container>
        <SectionHeader
          eyebrow="Contact"
          title="Let’s connect"
          subtitle="I’m always open to discussing internships, software projects, or potential collaborations."
        />

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="glass shadow-premium rounded-2xl" data-testid="card-contact-info">
            <div className="p-6 sm:p-7">
              <h3 className="font-display text-lg font-semibold" data-testid="text-contact-info-title">
                Contact details
              </h3>

              <div className="mt-4 space-y-3 text-sm text-muted-foreground" data-testid="list-contact-details">
                <a
                  className="ring-focus flex items-center justify-between rounded-xl border border-border/70 bg-background/60 px-4 py-3 hover:bg-background"
                  href={`mailto:${PROFILE.email}`}
                  data-testid="link-contact-email"
                >
                  <span className="inline-flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {PROFILE.email}
                  </span>
                  <ExternalLink className="h-4 w-4" />
                </a>

                <div
                  className="flex items-center justify-between rounded-xl border border-border/70 bg-background/60 px-4 py-3"
                  data-testid="text-contact-location"
                >
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {PROFILE.location}
                  </span>
                </div>

                <a
                  className="ring-focus flex items-center justify-between rounded-xl border border-border/70 bg-background/60 px-4 py-3 hover:bg-background"
                  href={PROFILE.links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  data-testid="link-contact-linkedin"
                >
                  <span className="inline-flex items-center gap-2">
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </span>
                  <ExternalLink className="h-4 w-4" />
                </a>

                <a
                  className="ring-focus flex items-center justify-between rounded-xl border border-border/70 bg-background/60 px-4 py-3 hover:bg-background"
                  href={PROFILE.links.github}
                  target="_blank"
                  rel="noreferrer"
                  data-testid="link-contact-github"
                >
                  <span className="inline-flex items-center gap-2">
                    <Github className="h-4 w-4" />
                    GitHub
                  </span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              <div className="mt-6 rounded-2xl border border-border/70 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 p-5">
                <p className="text-sm text-muted-foreground" data-testid="text-contact-note">
                  Feel free to reach out for internships, projects, or collaboration.
                </p>
              </div>
            </div>
          </Card>

          <Card className="glass shadow-premium rounded-2xl" data-testid="card-contact-form">
            <div className="p-6 sm:p-7">
              <h3 className="font-display text-lg font-semibold" data-testid="text-contact-form-title">
                Send a message
              </h3>

              <div className="mt-5 grid gap-3">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="rounded-xl"
                  data-testid="input-name"
                />
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  type="email"
                  className="rounded-xl"
                  data-testid="input-email"
                />
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Your message"
                  className="min-h-[140px] rounded-xl"
                  data-testid="input-message"
                />

                <div className="mt-2 flex flex-wrap gap-3">
                  <a
                    href={mailto}
                    className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-95"
                    data-testid="button-send-message"
                  >
                    Send
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                  <Button
                    variant="secondary"
                    className="rounded-full"
                    onClick={() => {
                      setName("");
                      setEmail("");
                      setMessage("");
                    }}
                    data-testid="button-clear-form"
                  >
                    Clear
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground" data-testid="text-contact-disclaimer">
                  This is a frontend-only portfolio—messages open your email app instead of being stored.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60 py-10" data-testid="section-footer">
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground" data-testid="text-footer-copy">
            © {new Date().getFullYear()} {PROFILE.name}. Built with React + Tailwind.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <a
              className="ring-focus inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-4 py-2 text-sm text-muted-foreground hover:bg-background"
              href={PROFILE.links.linkedin}
              target="_blank"
              rel="noreferrer"
              data-testid="link-footer-linkedin"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </a>
            <a
              className="ring-focus inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-4 py-2 text-sm text-muted-foreground hover:bg-background"
              href={PROFILE.links.github}
              target="_blank"
              rel="noreferrer"
              data-testid="link-footer-github"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="min-h-dvh" data-testid="page-home">
      <TopNav />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Profiles />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
