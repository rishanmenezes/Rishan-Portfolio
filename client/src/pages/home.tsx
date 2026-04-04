import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Github,
  Linkedin,
  MapPin,
  Moon,
  Sun,
  ExternalLink,
  Code2,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Instagram,
  Trophy,
  Briefcase,
} from "lucide-react";
import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GitHubProjectsSkeleton } from "@/components/GitHubProjectsSkeleton";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import emailjs from "@emailjs/browser";

const GitHubProjectsLazy = lazy(() => import("@/components/GitHubProjects"));
const AnimatedBackgroundLazy = lazy(async () => {
  const mod = await import("@/components/AnimatedBackground");
  return { default: mod.AnimatedBackground };
});

const PROFILE = {
  name: "Rishan Menezes",
  title: "Full Stack Developer building scalable applications with AI integration",
  email: "rishanmenezes05@gmail.com",
  location: "Mysuru, Karnataka, India",
  status: "Third Year Computer Science & Engineering Student at Maharaja Institute of Technology, Mysore.",
  about:
    "I build full-stack web applications and integrate AI where it adds real value. My work spans React/TypeScript frontends, Node.js backends, and Python-based ML systems — from e-commerce platforms with real-time inventory to trajectory prediction models using PyTorch. I focus on writing code that scales, not just code that works.",
  skills: {
    frontend: ["React", "TypeScript", "Tailwind CSS"],
    backend: ["Node.js", "Express", "FastAPI", "PostgreSQL"],
    aiml: ["Python", "PyTorch", "Pandas", "NumPy"],
    tools: ["Git", "Docker", "Vite"],
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
  const sectionKey = sectionIds.join("|");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));
        if (visible[0]?.target?.id) setActive(visible[0].target.id);
      },
      {
        root: null,
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: "-80px 0px -50% 0px"
      },
    );

    const observed = new Set<Element>();

    const observeEls = () => {
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (observed.has(el)) continue;
        observer.observe(el);
        observed.add(el);
      }
    };

    observeEls();

    const mo = new MutationObserver(() => observeEls());
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      observer.disconnect();
    };
  }, [sectionKey]);

  return active;
}

// ─── Signature element: Cursor spotlight ─────────────────────────────
// A subtle radial gradient follows the cursor, adding depth and interactivity.
// GPU-composited via CSS custom properties — zero layout thrash.
function CursorSpotlight() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;

    // Only enable on devices with fine pointer (not touch)
    const mq = window.matchMedia("(pointer: fine)");
    if (!mq.matches) return;

    let rafId: number;
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        el.style.setProperty("--cx", `${e.clientX}px`);
        el.style.setProperty("--cy", `${e.clientY}px`);
        el.style.opacity = "1";
      });
    };

    const onLeave = () => {
      el.style.opacity = "0";
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-[1] transition-opacity duration-500"
      style={{ opacity: 0 }}
      aria-hidden="true"
    >
      <div
        className="h-full w-full"
        style={{
          background: "radial-gradient(650px circle at var(--cx, 50%) var(--cy, 50%), hsl(var(--accent) / 0.05), transparent 55%)",
        }}
      />
    </div>
  );
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function Container({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>;
}

// ─── Shared cubic-bezier easing (typed as tuple for framer-motion) ───
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ─── Staggered section reveal ────────────────────────────────────────
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
    <motion.div className="mb-12" variants={itemVariants}>
      <div
        className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-3.5 py-1.5 text-xs text-muted-foreground backdrop-blur"
        data-testid={`text-eyebrow-${eyebrow.toLowerCase().replace(/\s+/g, "-")}`}
      >
        <Sparkles className="h-3 w-3" />
        <span className="font-medium tracking-wider uppercase">{eyebrow}</span>
      </div>
      <h2
        className="mt-5 font-display text-3xl font-bold tracking-tight leading-[1.12] sm:text-4xl text-foreground"
        data-testid={`text-section-${title.toLowerCase().replace(/\s+/g, "-")}`}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground/80 sm:text-base"
          data-testid={`text-subtitle-${title.toLowerCase().replace(/\s+/g, "-")}`}
        >
          {subtitle}
        </p>
      ) : null}
    </motion.div>
  );
}

function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const resolved = theme === "system" ? systemTheme : theme;
  const isDark = resolved === "dark";

  return (
    <button
      type="button"
      className="ring-focus inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 text-foreground/80 shadow-sm backdrop-blur transition-all duration-200 hover:bg-background hover:scale-105"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      data-testid="button-theme-toggle"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
      <span className="text-sm font-medium hidden sm:inline">{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}

function TopNav() {
  const items = useMemo(
    () =>
      [
        { id: "about", label: "About" },
        { id: "skills", label: "Skills" },
        { id: "experience", label: "Experience" },
        { id: "projects", label: "Projects" },
        { id: "profiles", label: "Profiles" },
        { id: "contact", label: "Contact" },
      ] as const,
    [],
  );

  const active = useActiveSection(items.map((i) => i.id));

  return (
    <div className="sticky top-0 z-40 border-b border-border/40 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <button
            type="button"
            className="group inline-flex items-center gap-2.5 rounded-full px-2 py-1 ring-focus"
            onClick={() => scrollToId("hero")}
            data-testid="button-nav-home"
            aria-label="Scroll to top"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 ring-1 ring-border/60 transition-transform duration-200 group-hover:scale-110">
              <Code2 className="h-4.5 w-4.5 text-foreground/80" />
            </span>
            <span className="hidden text-sm font-semibold tracking-tight sm:inline">
              {PROFILE.name}
            </span>
          </button>

          <div className="hidden items-center gap-0.5 md:flex">
            {items.map((item) => {
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToId(item.id)}
                  className={cx(
                    "ring-focus relative rounded-full px-3.5 py-2 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  data-testid={`button-nav-${item.id}`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-full bg-foreground/[0.06]"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </Container>
    </div>
  );
}

function Hero() {
  const reduced = useReducedMotion();

  const stagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: EASE_OUT },
    },
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden" data-testid="section-hero">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 grid-fade opacity-[0.18]" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, hsl(var(--accent) / 0.06) 0%, hsl(var(--primary) / 0.03) 40%, transparent 70%)" }} />
      </div>

      <Container>
        <div className="relative py-20">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Hero Text - LEFT side */}
            <motion.div
              className="flex-1 text-center lg:text-left order-2 lg:order-1"
              variants={reduced ? undefined : stagger}
              initial={reduced ? false : "hidden"}
              animate={reduced ? undefined : "visible"}
            >
              <motion.div variants={reduced ? undefined : fadeUp}>
                <div
                  className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-xs backdrop-blur"
                  data-testid="status-current"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                  </span>
                  <span className="font-medium text-foreground/80">Open to Opportunities</span>
                </div>
              </motion.div>

              <motion.h1
                className="mt-6 font-display text-5xl font-bold tracking-tight leading-[1.06] sm:text-6xl lg:text-7xl"
                data-testid="text-hero-title"
                variants={reduced ? undefined : fadeUp}
              >
                I'm{" "}
                <span className="text-gradient">
                  {PROFILE.name}
                </span>
              </motion.h1>

              <motion.p
                className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:text-xl"
                data-testid="text-hero-subtitle"
                variants={reduced ? undefined : fadeUp}
              >
                Full Stack Developer building scalable web applications and integrating AI to solve real-world problems
              </motion.p>

              <motion.p
                className="mt-3 max-w-xl text-sm italic text-muted-foreground/60 sm:text-base"
                data-testid="text-hero-tagline"
                variants={reduced ? undefined : fadeUp}
              >
                Building real-world products, not just projects.
              </motion.p>

              <motion.div
                className="mt-5 flex items-center justify-center lg:justify-start gap-2 text-sm text-muted-foreground/70"
                variants={reduced ? undefined : fadeUp}
              >
                <MapPin className="h-3.5 w-3.5" />
                <span data-testid="text-hero-location">{PROFILE.location}</span>
              </motion.div>

              <motion.div
                className="mt-8 flex flex-wrap justify-center lg:justify-start gap-3"
                variants={reduced ? undefined : fadeUp}
              >
                <Button
                  className="rounded-full px-6 hover:shadow-[0_0_30px_hsl(var(--accent)_/_0.2)] hover:scale-[1.03]"
                  onClick={() => scrollToId("projects")}
                  data-testid="button-view-projects"
                >
                  View Projects
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  className="rounded-full px-6 hover:shadow-[0_0_26px_hsl(var(--accent)_/_0.15)] hover:scale-[1.03]"
                  asChild
                  data-testid="button-view-resume"
                >
                  <a href="https://drive.google.com/file/d/1nwAIP6sstRIElqE10fFSzR1lJ3y-qAXn/view" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Resume
                  </a>
                </Button>
                <Button
                  variant="secondary"
                  className="rounded-full px-6 hover:shadow-[0_0_26px_hsl(var(--accent)_/_0.15)] hover:scale-[1.03]"
                  onClick={() => scrollToId("contact")}
                  data-testid="button-contact"
                >
                  Contact Me
                </Button>
              </motion.div>
            </motion.div>

            {/* Profile Image - RIGHT side */}
            <motion.div
              className="order-1 lg:order-2"
              initial={reduced ? undefined : { opacity: 0, scale: 0.9 }}
              animate={reduced ? undefined : { opacity: 1, scale: 1 }}
              transition={
                reduced
                  ? undefined
                  : { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }
              }
            >
              <div className="profile-glow relative">
                <img
                  src="/profile.jpg"
                  alt={PROFILE.name}
                  className={cx(
                    "relative h-56 w-56 sm:h-64 sm:w-64 lg:h-80 lg:w-80 rounded-full object-cover",
                    "ring-2 ring-border/20 shadow-2xl",
                    "transition-all duration-500 hover:ring-accent/30 hover:shadow-[0_0_60px_hsl(var(--accent)_/_0.15)]",
                    reduced ? false : "float-slow",
                  )}
                  loading="eager"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="py-24 sm:py-28" data-testid="section-about">
      <Container>
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <SectionHeader
            eyebrow="About"
            title="About me"
            subtitle="Third-year Computer Science student building full-stack applications with AI integration."
          />

          <div className="grid gap-6 lg:grid-cols-2">
            <motion.div variants={itemVariants}>
              <Card className="glass shadow-premium rounded-2xl card-elevate gradient-border" data-testid="card-about">
                <div className="p-6 sm:p-8">
                  <p className="text-sm leading-[1.8] text-muted-foreground sm:text-base" data-testid="text-about-body">
                    {PROFILE.about}
                  </p>
                  <div className="mt-7 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-border/50 bg-background/50 p-4 backdrop-blur-sm" data-testid="card-about-status">
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground/60">Currently</p>
                      <p className="mt-1.5 text-sm font-semibold">Third Year CSE</p>
                    </div>
                    <div className="rounded-xl border border-border/50 bg-background/50 p-4 backdrop-blur-sm" data-testid="card-about-location">
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground/60">Based in</p>
                      <p className="mt-1.5 text-sm font-semibold">Mysuru, India</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="glass shadow-premium rounded-2xl card-elevate gradient-border" data-testid="card-about-strengths">
                <div className="p-6 sm:p-8">
                  <h3 className="font-display text-lg font-bold" data-testid="text-about-strengths-title">
                    What I bring
                  </h3>
                  <ul className="mt-5 space-y-4 text-sm text-muted-foreground" data-testid="list-about-strengths">
                    {[
                      "Built end-to-end web applications from database schema to deployed frontend using React, Express, and PostgreSQL",
                      "Integrated AI/ML pipelines into production systems — trajectory prediction, RL environments, NLP classifiers",
                      "Optimized frontend performance with code splitting, lazy loading, and memoized rendering patterns",
                      "Shipped projects with Docker, CI/CD workflows, and Git-based collaboration",
                    ].map((item, idx) => (
                      <li key={idx} className="flex gap-3" data-testid={`item-strength-${idx}`}>
                        <span className="mt-1.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-accent/10">
                          <span className="h-1.5 w-1.5 rounded-full bg-accent/70" />
                        </span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

function Skills() {
  const groups = [
    { label: "Frontend", items: PROFILE.skills.frontend },
    { label: "Backend", items: PROFILE.skills.backend },
    { label: "AI / ML", items: PROFILE.skills.aiml },
    { label: "Tools", items: PROFILE.skills.tools },
  ] as const;

  return (
    <section id="skills" className="py-24 sm:py-28" data-testid="section-skills">
      <Container>
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <SectionHeader
            eyebrow="Skills"
            title="Tools & technologies"
            subtitle="Technologies I use across the stack — from component-driven frontends to ML pipelines."
          />

          <div className="grid gap-5 md:grid-cols-2" data-testid="grid-skills">
            {groups.map((g) => (
              <motion.div key={g.label} variants={itemVariants}>
                <Card className="glass shadow-premium rounded-2xl card-elevate gradient-border" data-testid={`card-skill-${g.label.toLowerCase().replace(/\s+/g, "-")}`}>
                  <div className="p-6 sm:p-7">
                    <h3 className="font-display text-base font-bold" data-testid={`text-skill-title-${g.label.toLowerCase().replace(/\s+/g, "-")}`}>
                      {g.label}
                    </h3>
                    <div className="mt-4 flex flex-wrap gap-2" data-testid={`list-skill-badges-${g.label.toLowerCase().replace(/\s+/g, "-")}`}>
                      {g.items.map((item) => (
                        <Badge
                          key={item}
                          variant="secondary"
                          className="rounded-full border border-border/50 bg-foreground/[0.03] px-3 py-1 text-foreground/85 transition-colors duration-200 hover:bg-foreground/[0.08] hover:text-foreground"
                          data-testid={`badge-skill-${item.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                        >
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

function Experience() {
  const achievements = [
    {
      icon: Trophy,
      title: "Open Source",
      text: "Contributed to open source through Hacktoberfest with accepted pull requests across multiple repositories.",
    },
    {
      icon: Code2,
      title: "AI / ML Systems",
      text: "Developed trajectory prediction with PyTorch and reinforcement learning environments for automated support.",
    },
    {
      icon: Briefcase,
      title: "Full Stack Apps",
      text: "Built multiple production-ready applications using React, TypeScript, Express, and PostgreSQL — from concept to deployment.",
    },
  ];

  return (
    <section id="experience" className="py-24 sm:py-28" data-testid="section-experience">
      <Container>
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <SectionHeader
            eyebrow="Experience"
            title="Experience & achievements"
            subtitle="Key milestones and contributions."
          />

          <div className="grid gap-5 sm:grid-cols-1 lg:grid-cols-3" data-testid="grid-experience">
            {achievements.map((item, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <Card
                  className="glass shadow-premium rounded-2xl card-elevate gradient-border"
                  data-testid={`card-experience-${idx}`}
                >
                  <div className="p-6 sm:p-7">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 ring-1 ring-border/40">
                      <item.icon className="h-5 w-5 text-foreground/75" />
                    </div>
                    <h3 className="mt-4 font-display text-sm font-bold tracking-tight">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.text}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

function Projects() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<GitHubProjectsSkeleton />}>
        <GitHubProjectsLazy />
      </Suspense>
    </ErrorBoundary>
  );
}

function Profiles() {
  const items = [
    { label: "LinkedIn", href: PROFILE.links.linkedin, icon: Linkedin, sub: "" },
    { label: "GitHub", href: PROFILE.links.github, icon: Github, sub: "" },
    { label: "LeetCode", href: PROFILE.links.leetcode, icon: Code2, sub: "Problem-solving practice" },
    { label: "Instagram", href: PROFILE.links.instagram, icon: Instagram, sub: "" },
  ] as const;

  return (
    <section id="profiles" className="py-24 sm:py-28" data-testid="section-profiles">
      <Container>
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <SectionHeader
            eyebrow="Profiles"
            title="Find me online"
            subtitle="Connect with me on professional and social platforms."
          />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" data-testid="grid-profiles">
            {items.map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="group glass shadow-premium rounded-2xl p-6 card-elevate gradient-border"
                data-testid={`link-profile-${item.label.toLowerCase()}`}
                variants={itemVariants}
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 ring-1 ring-border/40 transition-transform duration-200 group-hover:scale-110">
                    <item.icon className="h-5 w-5 text-foreground/75" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground/50 transition-all duration-200 group-hover:translate-x-1 group-hover:text-foreground/70" />
                </div>
                <p className="mt-4 font-display text-base font-bold" data-testid={`text-profile-title-${item.label.toLowerCase()}`}>
                  {item.label}
                </p>
                <p className="mt-1 text-xs text-muted-foreground/70" data-testid={`text-profile-url-${item.label.toLowerCase()}`}>
                  {item.sub || item.href.replace(/^https?:\/\//, "")}
                </p>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const EMAILJS_SERVICE_ID =
    import.meta.env.VITE_EMAILJS_SERVICE_ID ?? "service_49ezxhd";
  const EMAILJS_TEMPLATE_ID =
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? "template_mag0esc";
  const EMAILJS_PUBLIC_KEY =
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? "iL5MZzoGE9p1T-pKr";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus("error");
      setErrorMessage("All fields are required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus("error");
      setErrorMessage("Enter a valid email address.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: name,
          from_email: email,
          reply_to: email,
          message: message,
          to_email: PROFILE.email,
        },
        EMAILJS_PUBLIC_KEY
      );

      setStatus("success");
      setTimeout(() => {
        setName("");
        setEmail("");
        setMessage("");
        setStatus("idle");
      }, 3000);
    } catch (error: unknown) {
      setStatus("error");
      const msg =
        error instanceof Error
          ? error.message
          : typeof error === "object" && error !== null && "text" in error
            ? String((error as Record<string, unknown>).text)
            : "Message could not be sent. Please try again.";
      setErrorMessage(msg);
    }
  };

  return (
    <section id="contact" className="py-24 sm:py-28" data-testid="section-contact">
      <Container>
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <SectionHeader
            eyebrow="Contact"
            title="Let's connect"
            subtitle="Open to internships, collaborations, and interesting projects."
          />

          <motion.div className="mx-auto max-w-2xl" variants={itemVariants}>
            <Card className="glass shadow-premium rounded-2xl card-elevate gradient-border" data-testid="card-contact-form">
              <div className="p-6 sm:p-8">
              <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground">
                  Have a project in mind or want to collaborate? Send me a message.
                </p>
                <p className="mt-2 text-xs text-muted-foreground/70">
                  Your message goes directly to my inbox.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="grid gap-4">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="rounded-xl border-border/50 bg-background/50 backdrop-blur-sm transition-all duration-200 focus:border-accent/40 focus:bg-background/70"
                  disabled={status === "loading"}
                  required
                  data-testid="input-name"
                />
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  type="email"
                  className="rounded-xl border-border/50 bg-background/50 backdrop-blur-sm transition-all duration-200 focus:border-accent/40 focus:bg-background/70"
                  disabled={status === "loading"}
                  required
                  data-testid="input-email"
                />
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Your message"
                  className="min-h-[160px] rounded-xl border-border/50 bg-background/50 backdrop-blur-sm transition-all duration-200 focus:border-accent/40 focus:bg-background/70"
                  disabled={status === "loading"}
                  required
                  data-testid="input-message"
                />

                {/* Reserved space to avoid layout shift */}
                <div className="min-h-[48px]" aria-live="polite">
                  {status === "success" ? (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.99 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.22 }}
                      className="flex items-center gap-2 rounded-xl bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-600 dark:text-green-400"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Message sent. I'll reply soon.</span>
                    </motion.div>
                  ) : null}

                  {status === "error" ? (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.99 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.22 }}
                      className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-600 dark:text-red-400"
                    >
                      <AlertCircle className="h-4 w-4" />
                      <span>{errorMessage}</span>
                    </motion.div>
                  ) : null}
                </div>

                <div className="mt-2 flex flex-wrap gap-3">
                  <Button
                    type="submit"
                    className="rounded-full px-6 hover:shadow-[0_0_30px_hsl(var(--accent)_/_0.2)] hover:scale-[1.03]"
                    disabled={status === "loading" || status === "success"}
                    data-testid="button-send-message"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : status === "success" ? (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Sent!
                      </>
                    ) : (
                      <>
                        Send Message
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="rounded-full px-6 hover:shadow-[0_0_26px_hsl(var(--accent)_/_0.15)] hover:scale-[1.03]"
                    onClick={() => {
                      setName("");
                      setEmail("");
                      setMessage("");
                      setStatus("idle");
                      setErrorMessage("");
                    }}
                    disabled={status === "loading"}
                    data-testid="button-clear-form"
                  >
                    Clear
                  </Button>
                </div>

                <p className="text-xs text-center text-muted-foreground/70" data-testid="text-contact-disclaimer">
                  Or email me directly at <a href={`mailto:${PROFILE.email}`} className="link-glow transition-colors duration-200 hover:text-foreground">{PROFILE.email}</a>
                </p>
              </form>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/40 py-8" data-testid="section-footer">
      <Container>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground/70" data-testid="text-footer-copy">
            © {new Date().getFullYear()} {PROFILE.name}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              className="rounded-full px-5 hover:shadow-[0_0_26px_hsl(var(--accent)_/_0.15)] hover:scale-[1.03]"
              onClick={() => scrollToId("contact")}
              data-testid="button-footer-contact"
            >
              Contact
              <ArrowRight className="h-4.5 w-4.5" />
            </Button>
          </div>
        </div>
      </Container>
    </footer>
  );
}

// ─── Section divider ─────────────────────────────────────────────────
function Divider() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8" aria-hidden="true">
      <div className="section-divider" />
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-dvh" data-testid="page-home">
      {/* Skip navigation links for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
      >
        Skip to main content
      </a>

      <Suspense fallback={<div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true" />}>
        <AnimatedBackgroundLazy />
      </Suspense>
      <CursorSpotlight />
      <TopNav />
      <main id="main-content">
        <Hero />
        <Divider />
        <About />
        <Divider />
        <Skills />
        <Divider />
        <Experience />
        <Divider />
        <Projects />
        <Divider />
        <Profiles />
        <Divider />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
