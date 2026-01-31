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
  Terminal,
  GraduationCap,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Download,
  Instagram,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import emailjs from "@emailjs/browser";

type Project = {
  id: string;
  name: string;
  description: string;
  techStack: string;
  githubUrl: string;
  liveUrl?: string;
};

const PROJECTS: Project[] = [
  {
    id: "ecofinds",
    name: "EcoFinds",
    description: "A modern web application focused on promoting sustainable shopping by showcasing eco-friendly products in a clean and responsive interface.",
    techStack: "React, TypeScript, Tailwind CSS",
    githubUrl: "https://github.com/rishanmenezes/EcoFinds",
  },
  {
    id: "skysmart",
    name: "SkySmart",
    description: "An AI-assisted flight booking platform designed to present flight options with a clean UI and intuitive filtering for better user experience.",
    techStack: "React, JavaScript, Tailwind CSS, API integration",
    githubUrl: "https://github.com/rishanmenezes/SkySmart",
  },
  {
    id: "college-news-portal",
    name: "College News Portal",
    description: "A centralized web portal for college announcements, events, and updates, improving communication across campus.",
    techStack: "HTML, CSS, JavaScript",
    githubUrl: "https://github.com/rishanmenezes/College-News-Portal",
  },
  {
    id: "mahadasara-auction",
    name: "Mahadasara Auction Arena",
    description: "A web-based auction platform concept inspired by traditional auction systems, designed to present items, bidding details, and structured listings clearly.",
    techStack: "HTML, CSS, JavaScript",
    githubUrl: "https://github.com/rishanmenezes/Mahadasara-Auction-Arena",
  },
  {
    id: "clearcity",
    name: "ClearCity",
    description: "A web application focused on promoting urban cleanliness and civic awareness through a simple and accessible interface.",
    techStack: "HTML, CSS, JavaScript",
    githubUrl: "https://github.com/rishanmenezes/ClearCity",
  },
  {
    id: "shivcloud",
    name: "ShivCloud",
    description: "A cloud-inspired frontend project demonstrating responsive layouts and modern UI design principles.",
    techStack: "HTML, CSS, JavaScript",
    githubUrl: "https://github.com/rishanmenezes/ShivCloud",
  },
];

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
      {
        root: null,
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: "-80px 0px -50% 0px"
      },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIds]);

  return active;
}



function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const navbarHeight = 80;
  const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
  const offsetPosition = elementPosition - navbarHeight;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth"
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
            <a
              href={PROFILE.links.linkedin}
              target="_blank"
              rel="noreferrer"
              className="ring-focus inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background/70 text-foreground/80 shadow-sm backdrop-blur transition hover:bg-background"
              aria-label="Open LinkedIn"
              data-testid="link-linkedin-top"
            >
              <Linkedin className="h-4.5 w-4.5" />
            </a>
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
            <div className="h-6 w-px bg-border/60 mx-1" aria-hidden="true" />
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
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16"
          >
            {/* Hero Text - LEFT side */}
            <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
              <div
                className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur"
                data-testid="status-current"
              >
                <GraduationCap className="h-3.5 w-3.5" />
                <span className="font-medium">Third Year CSE Student</span>
              </div>

              <h1
                className="mt-5 font-display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl"
                data-testid="text-hero-title"
              >
                I'm <span className="text-gradient">{PROFILE.name}</span>
              </h1>

              <p
                className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
                data-testid="text-hero-subtitle"
              >
                Building modern web applications with clean code and attention to detail.
              </p>

              <div className="mt-6 flex items-center justify-center lg:justify-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span data-testid="text-hero-location">{PROFILE.location}</span>
              </div>

              <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-3">
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
                  className="rounded-full"
                  onClick={() => scrollToId("contact")}
                  data-testid="button-contact"
                >
                  Contact Me
                </Button>
              </div>
            </div>

            {/* Profile Image - RIGHT side */}
            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 blur-2xl" />
                <img
                  src="/profile.jpg"
                  alt={PROFILE.name}
                  className="relative h-56 w-56 sm:h-64 sm:w-64 lg:h-72 lg:w-72 rounded-full object-cover ring-2 ring-border/30 shadow-[0_0_40px_rgba(96,165,250,0.2)]"
                  loading="eager"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="py-20 sm:py-24" data-testid="section-about">
      <Container>
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
                  "Clean, maintainable code with strong fundamentals",
                  "Responsive UI with attention to detail",
                  "Modern React + TypeScript development",
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
        <SectionHeader
          eyebrow="Skills"
          title="Tools & technologies"
          subtitle="Technologies I work with to build modern web applications."
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
      </Container>
    </section>
  );
}

function Projects() {
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PROJECTS;
    return PROJECTS.filter((p) => {
      const hay = `${p.name} ${p.description} ${p.techStack}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query]);

  return (
    <section id="projects" className="py-20 sm:py-24" data-testid="section-projects">
      <Container>
        <SectionHeader
          eyebrow="Projects"
          title="Featured projects"
          subtitle="Projects showcasing my development skills and technical growth."
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground" data-testid="text-projects-meta">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              {visible.length} {visible.length === 1 ? 'project' : 'projects'}
            </span>
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
          {visible.length === 0 ? (
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
            visible.map((project) => (
              <Card
                key={project.id}
                className="group glass shadow-premium rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_1px_0_hsl(var(--foreground)_/_0.06),_0_26px_70px_hsl(var(--foreground)_/_0.12)]"
                data-testid={`card-project-${project.id}`}
              >
                <div className="p-6 sm:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3
                        className="font-display text-lg font-semibold tracking-tight"
                        data-testid={`text-project-name-${project.id}`}
                      >
                        {project.name}
                      </h3>
                      <p
                        className="mt-2 text-sm leading-relaxed text-muted-foreground"
                        data-testid={`text-project-desc-${project.id}`}
                      >
                        {project.description}
                      </p>
                      <p className="mt-3 text-xs text-muted-foreground">
                        <span className="font-medium">Tech:</span> {project.techStack}
                      </p>
                    </div>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="ring-focus inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-border/70 bg-background/60 text-foreground/80 transition hover:bg-background"
                      aria-label="Open GitHub repo"
                      data-testid={`link-project-github-${project.id}`}
                    >
                      <Github className="h-4.5 w-4.5" />
                    </a>
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
    { label: "LinkedIn", href: PROFILE.links.linkedin, icon: Linkedin, sub: "" },
    { label: "GitHub", href: PROFILE.links.github, icon: Github, sub: "" },
    { label: "LeetCode", href: PROFILE.links.leetcode, icon: Code2, sub: "Problem-solving practice" },
    { label: "Instagram", href: PROFILE.links.instagram, icon: Instagram, sub: "" },
  ] as const;

  return (
    <section id="profiles" className="py-20 sm:py-24" data-testid="section-profiles">
      <Container>
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

  // EmailJS configuration
  const EMAILJS_SERVICE_ID = "service_49ezxhd";
  const EMAILJS_TEMPLATE_ID = "template_mag0esc";
  const EMAILJS_PUBLIC_KEY = "iL5MZzoGE9p1T-pKr";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus("error");
      setErrorMessage("Please fill in all fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      // Send email using EmailJS
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
        error?.text || "Failed to send message. Please try again or email me directly."
      );
    }
  };

  const mailto = useMemo(() => {
    const subject = encodeURIComponent(`Portfolio contact — ${name || ""}`.trim());
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`.trim());
    return `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;
  }, [name, email, message]);

  return (
    <section id="contact" className="py-20 sm:py-24" data-testid="section-contact">
      <Container>
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

                {/* Success Message */}
                {status === "success" && (
                  <div className="flex items-center gap-2 rounded-xl bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-600 dark:text-green-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Message sent successfully! I'll get back to you soon.</span>
                  </div>
                )}

                {/* Error Message */}
                {status === "error" && (
                  <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="mt-2 flex flex-wrap gap-3">
                  <Button
                    type="submit"
                    className="rounded-full"
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
                    className="rounded-full"
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
            © {new Date().getFullYear()} {PROFILE.name}. All rights reserved.
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
    <div className="relative min-h-dvh" data-testid="page-home">
      <AnimatedBackground />
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
