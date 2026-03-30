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
  GraduationCap,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Instagram,
} from "lucide-react";
import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GitHubProjectsSkeleton } from "@/components/GitHubProjectsSkeleton";
import emailjs from "@emailjs/browser";

const GitHubProjectsLazy = lazy(() => import("@/components/GitHubProjects"));
const AnimatedBackgroundLazy = lazy(async () => {
  const mod = await import("@/components/AnimatedBackground");
  return { default: mod.AnimatedBackground };
});

const PROFILE = {
  name: "Rishan Menezes",
  title: "Aspiring Software Engineer | Full Stack Web Developer",
  email: "rishanmenezes05@gmail.com",
  location: "Mysuru, Karnataka, India",
  status: "Third Year Computer Science & Engineering Student at Maharaja Institute of Technology, Mysore.",
  about:
    "I am a third-year Computer Science Engineering student focused on frontend engineering and component-driven UI systems. I build performance-focused web experiences with React and TypeScript, and I enjoy turning product requirements into scalable, maintainable interfaces.",
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

    // If sections are lazy-loaded, DOM nodes might appear after initial mount.
    const mo = new MutationObserver(() => observeEls());
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      observer.disconnect();
    };
  }, [sectionKey]);

  return active;
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
      <h2
        className="mt-4 font-display text-2xl font-semibold tracking-tight leading-[1.15] sm:text-3xl text-foreground"
        data-testid={`text-section-${title.toLowerCase().replace(/\s+/g, "-")}`}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground/90 sm:text-base"
          data-testid={`text-subtitle-${title.toLowerCase().replace(/\s+/g, "-")}`}
        >
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
      className="ring-focus inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 text-foreground/80 shadow-sm backdrop-blur transition hover:bg-background"
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
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden" data-testid="section-hero">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 grid-fade opacity-20" />
      </div>

      <Container>
        <div className="relative py-20">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Hero Text - LEFT side */}
            <motion.div
              className="flex-1 text-center lg:text-left order-2 lg:order-1"
              initial={reduced ? false : { opacity: 0, y: 14 }}
              animate={reduced ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur"
                data-testid="status-current"
              >
                <GraduationCap className="h-3.5 w-3.5" />
                <span className="font-medium">Third Year CSE Student</span>
              </div>

              <h1
                className="mt-5 font-display text-4xl font-semibold tracking-tight leading-[1.06] sm:text-6xl lg:text-6xl"
                data-testid="text-hero-title"
              >
                I'm{" "}
                <span
                  className="text-gradient drop-shadow-[0_0_24px_hsl(var(--accent)_/_0.28)]"
                >
                  {PROFILE.name}
                </span>
              </h1>

              <p
                className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
                data-testid="text-hero-subtitle"
              >
                Frontend Developer specializing in React and modern UI systems
              </p>

              <div className="mt-6 flex items-center justify-center lg:justify-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span data-testid="text-hero-location">{PROFILE.location}</span>
              </div>

              <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-3">
                <Button
                  className="rounded-full hover:shadow-[0_0_26px_hsl(var(--accent)_/_0.18)] hover:scale-[1.02]"
                  onClick={() => scrollToId("projects")}
                  data-testid="button-view-projects"
                >
                  View Projects
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  className="rounded-full hover:shadow-[0_0_26px_hsl(var(--accent)_/_0.18)] hover:scale-[1.02]"
                  asChild
                  data-testid="button-view-resume"
                >
                  <a href="https://drive.google.com/file/d/1k7A80gIVIy24035rYflQM7nY95W816lW/view" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Resume
                  </a>
                </Button>
                <Button
                  variant="secondary"
                  className="rounded-full hover:shadow-[0_0_26px_hsl(var(--accent)_/_0.18)] hover:scale-[1.02]"
                  onClick={() => scrollToId("contact")}
                  data-testid="button-contact"
                >
                  Contact Me
                </Button>
              </div>
            </motion.div>

            {/* Profile Image - RIGHT side */}
            <motion.div
              className="order-1 lg:order-2"
              initial={reduced ? undefined : { opacity: 0, y: 10, scale: 0.98 }}
              animate={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
              transition={
                reduced
                  ? undefined
                  : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
              }
            >
              <div className="relative">
                <img
                  src="/profile.jpg"
                  alt={PROFILE.name}
                  className={cx(
                    "relative h-56 w-56 sm:h-64 sm:w-64 lg:h-72 lg:w-72 rounded-full object-cover ring-2 ring-border/30",
                    "shadow-[0_0_40px_rgba(96,165,250,0.2)] ring-accent/15 opacity-95 transition-opacity duration-300 hover:opacity-100",
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
    <section id="about" className="py-20 sm:py-24" data-testid="section-about">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <SectionHeader
            eyebrow="About"
            title="About me"
            subtitle="Third-year Computer Science student focused on building quality web applications."
          />

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="glass shadow-premium rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_1px_0_hsl(var(--foreground)_/_0.06),_0_26px_70px_hsl(var(--foreground)_/_0.12)]" data-testid="card-about">
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

            <Card className="glass shadow-premium rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_1px_0_hsl(var(--foreground)_/_0.06),_0_26px_70px_hsl(var(--foreground)_/_0.12)]" data-testid="card-about-strengths">
              <div className="p-6 sm:p-7">
                <h3 className="font-display text-lg font-semibold" data-testid="text-about-strengths-title">
                  What I bring
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground" data-testid="list-about-strengths">
                  {[
                    "Component-driven UI with strong fundamentals",
                    "Performance-focused frontend engineering",
                    "Scalable React + TypeScript development",
                    "Continuous learning through hands-on projects",
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
        </motion.div>
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
    <section id="skills" className="py-20 sm:py-24" data-testid="section-skills">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <SectionHeader
            eyebrow="Skills"
            title="Tools & technologies"
            subtitle="Technologies I use to build scalable, component-driven web experiences."
          />

          <div className="grid gap-6 md:grid-cols-2" data-testid="grid-skills">
            {groups.map((g) => (
              <Card key={g.label} className="glass shadow-premium rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_1px_0_hsl(var(--foreground)_/_0.06),_0_26px_70px_hsl(var(--foreground)_/_0.12)]" data-testid={`card-skill-${g.label.toLowerCase().replace(/\s+/g, "-")}`}>
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
        </motion.div>
      </Container>
    </section>
  );
}

function Projects() {
  return (
    <Suspense fallback={<GitHubProjectsSkeleton />}>
      <GitHubProjectsLazy />
    </Suspense>
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
    <section id="profiles" className="py-20 sm:py-24" data-testid="section-profiles">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <SectionHeader
            eyebrow="Profiles"
            title="Find me online"
            subtitle="Connect with me on professional and social platforms."
          />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" data-testid="grid-profiles">
            {items.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="group glass shadow-premium rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_1px_0_hsl(var(--foreground)_/_0.06),_0_26px_70px_hsl(var(--foreground)_/_0.12)]"
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

  // EmailJS configuration (prefer Vite env vars; keep local fallbacks to avoid breaking existing behavior).
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
      // Clear form after successful submission
      setTimeout(() => {
        setName("");
        setEmail("");
        setMessage("");
        setStatus("idle");
      }, 3000);
    } catch (error: any) {
      setStatus("error");
      setErrorMessage(
        error?.text || "Message could not be sent. Please try again."
      );
    }
  };

  return (
    <section id="contact" className="py-20 sm:py-24" data-testid="section-contact">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <SectionHeader
            eyebrow="Contact"
            title="Let's connect"
            subtitle="Open to internships, collaborations, and interesting projects."
          />

          <div className="mx-auto max-w-2xl">
            <Card className="glass shadow-premium rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_1px_0_hsl(var(--foreground)_/_0.06),_0_26px_70px_hsl(var(--foreground)_/_0.12)]" data-testid="card-contact-form">
              <div className="p-6 sm:p-8">
              <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground">
                  Have a project in mind or want to collaborate? Send me a message.
                </p>
                <p className="mt-2 text-xs text-muted-foreground/90">
                  Your message goes directly to my inbox.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="grid gap-4">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="rounded-xl"
                  disabled={status === "loading"}
                  required
                  data-testid="input-name"
                />
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  type="email"
                  className="rounded-xl"
                  disabled={status === "loading"}
                  required
                  data-testid="input-email"
                />
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Your message"
                  className="min-h-[160px] rounded-xl"
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
                    className="rounded-full hover:shadow-[0_0_26px_hsl(var(--accent)_/_0.18)] hover:scale-[1.02]"
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
                    className="rounded-full hover:shadow-[0_0_26px_hsl(var(--accent)_/_0.18)] hover:scale-[1.02]"
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

                <p className="text-xs text-center text-muted-foreground" data-testid="text-contact-disclaimer">
                  Or email me directly at <a href={`mailto:${PROFILE.email}`} className="underline hover:text-foreground">{PROFILE.email}</a>
                </p>
              </form>
              </div>
            </Card>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60 py-8" data-testid="section-footer">
      <Container>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground" data-testid="text-footer-copy">
            © {new Date().getFullYear()} {PROFILE.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              className="rounded-full hover:shadow-[0_0_26px_hsl(var(--accent)_/_0.18)] hover:scale-[1.02]"
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

export default function Home() {
  return (
    <div className="relative min-h-dvh" data-testid="page-home">
      <Suspense fallback={<div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true" />}>
        <AnimatedBackgroundLazy />
      </Suspense>
      <TopNav />
      <main>
        <Hero />
        <div className="mx-auto h-px w-full max-w-6xl bg-border/60" aria-hidden="true" />
        <About />
        <div className="mx-auto h-px w-full max-w-6xl bg-border/60" aria-hidden="true" />
        <Skills />
        <div className="mx-auto h-px w-full max-w-6xl bg-border/60" aria-hidden="true" />
        <Projects />
        <div className="mx-auto h-px w-full max-w-6xl bg-border/60" aria-hidden="true" />
        <Profiles />
        <div className="mx-auto h-px w-full max-w-6xl bg-border/60" aria-hidden="true" />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
