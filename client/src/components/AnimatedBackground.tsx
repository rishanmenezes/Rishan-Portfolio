import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface Bubble {
  x: number;
  y: number;
  z: number; // 0..1 depth
  layer: 0 | 1 | 2;
  radius: number;
  vx: number;
  vy: number;
  opacity: number;
  blur: number;
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme, systemTheme } = useTheme();
  const resolvedTheme = theme === "system" ? systemTheme : theme;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;
    const deviceMemory = (navigator as any).deviceMemory as number | undefined;
    const isLowEnd = typeof deviceMemory === "number" && deviceMemory <= 2;
    
    // Significantly reduce bubble count for better performance
    const bubbleCount = prefersReducedMotion ? 0 : isMobile ? 4 : isLowEnd ? 6 : 8;

    const scrollYRef = { current: 0 };
    const onScroll = () => {
      scrollYRef.current = window.scrollY || 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const updateSize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    // Create bubbles once per theme change.
    const bubbles: Bubble[] = [];
    for (let i = 0; i < bubbleCount; i++) {
      const z = Math.random(); // depth
      const layer = z < 0.34 ? 0 : z < 0.67 ? 1 : 2;
      const depthFactor = 0.55 + z * 0.85;
      const layerSpeedMul = layer === 0 ? 0.42 : layer === 1 ? 0.7 : 1.05;
      const layerBlurMul = layer === 0 ? 0.75 : layer === 1 ? 1 : 1.25;

      bubbles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z,
        layer,
        radius: (Math.random() * 70 + 25) * depthFactor, // depth scales size
        vx: (Math.random() - 0.5) * 0.08 * depthFactor * layerSpeedMul,
        vy: (Math.random() - 0.5) * 0.08 * depthFactor * layerSpeedMul,
        opacity: (Math.random() * 0.10 + 0.03) * (0.52 + z * 0.35),
        blur: (Math.random() * 20 + 10) * (0.7 + z * 0.6) * layerBlurMul,
      });
    }

    // Section-aware parallax intensity (subtle, performance-safe).
    const sectionParallaxMultRef = { current: 1 };
    const sectionIds = ["hero", "about", "skills", "experience", "projects", "profiles", "contact"] as const;
    const sectionMultipliers: Record<(typeof sectionIds)[number], number> = {
      hero: 0.94,
      about: 0.86,
      skills: 0.88,
      experience: 0.9,
      projects: 0.97,
      profiles: 0.9,
      contact: 0.84,
    };
    const observedSectionEls = new Set<Element>();
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));
        const top = visible[0]?.target as HTMLElement | undefined;
        if (!top?.id) return;
        if ((sectionMultipliers as Record<string, number>)[top.id] !== undefined) {
          sectionParallaxMultRef.current = sectionMultipliers[top.id as (typeof sectionIds)[number]];
        }
      },
      {
        root: null,
        threshold: [0, 0.15, 0.35, 0.55, 0.75],
        rootMargin: "-15% 0px -60% 0px",
      },
    );

    const observeSections = () => {
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (observedSectionEls.has(el)) continue;
        sectionObserver.observe(el);
        observedSectionEls.add(el);
      }
    };

    observeSections();
    const sectionsMo = new MutationObserver(() => observeSections());
    sectionsMo.observe(document.body, { childList: true, subtree: true });

    const cursorRef = { x: 0, y: 0 };
    const enableMouse = !prefersReducedMotion && !isMobile && !isLowEnd;
    let cleanupPointerMove = () => {};
    if (enableMouse) {
      const onPointerMove = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        cursorRef.x = Math.max(-0.5, Math.min(0.5, nx * 2));
        cursorRef.y = Math.max(-0.5, Math.min(0.5, ny * 2));
      };
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      cleanupPointerMove = () => {
        window.removeEventListener("pointermove", onPointerMove);
      };
    }

    const drawBubble = (bubble: Bubble, scrollParallax: number) => {
      const isDark = resolvedTheme === "dark";
      const sectionMult = sectionParallaxMultRef.current;
      const mouseMult = Math.max(0.88, Math.min(1.06, sectionMult));

      // Parallax offset: distant bubbles move less.
      const parallaxScale = 0.06 + bubble.z * 0.14;
      const dx = scrollParallax * parallaxScale * (bubble.z - 0.4);
      const mouseDx =
        cursorRef.x *
          (10 * dpr) *
          (0.12 + bubble.z * 0.22) *
          (bubble.layer === 0 ? 0.7 : bubble.layer === 1 ? 1 : 1.15) *
          mouseMult;
      const mouseDy =
        cursorRef.y *
          (10 * dpr) *
          (0.08 + bubble.z * 0.18) *
          (bubble.layer === 0 ? 0.7 : bubble.layer === 1 ? 1 : 1.15) *
          mouseMult;

      const drawX = bubble.x + dx + mouseDx;
      const drawY =
        bubble.y +
        scrollParallax * parallaxScale * (0.25 + bubble.z) +
        mouseDy;

      const g = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, bubble.radius);

      if (isDark) {
        g.addColorStop(0, `rgba(96, 165, 250, ${bubble.opacity * 0.85})`);
        g.addColorStop(0.5, `rgba(167, 139, 250, ${bubble.opacity * 0.55})`);
        g.addColorStop(1, `rgba(96, 165, 250, 0)`);
      } else {
        g.addColorStop(0, `rgba(59, 130, 246, ${bubble.opacity * 0.7})`);
        g.addColorStop(0.5, `rgba(139, 92, 246, ${bubble.opacity * 0.45})`);
        g.addColorStop(1, `rgba(59, 130, 246, 0)`);
      }

      // Cap blur for mobile so it doesn't tank performance.
      const blurPx = isMobile ? Math.min(bubble.blur * 0.85, 18) : Math.min(bubble.blur, 34);

      ctx.filter = `blur(${blurPx}px)`;
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(drawX, drawY, bubble.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.filter = "none";
    };

    // Disable animation on mobile and low-end devices for performance
    const shouldAnimate = !prefersReducedMotion && !isMobile && !isLowEnd;
    let raf = 0;
    let mounted = true;
    let lastDraw = 0;

    const drawFrame = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const scrollParallax =
        (Math.max(0, scrollYRef.current) / (isMobile ? 900 : 700)) *
        sectionParallaxMultRef.current;

      for (const bubble of bubbles) {
        if (shouldAnimate) {
          bubble.x += bubble.vx;
          bubble.y += bubble.vy;

          const margin = bubble.radius * 1.2;
          if (bubble.x < -margin || bubble.x > w + margin) bubble.vx *= -1;
          if (bubble.y < -margin || bubble.y > h + margin) bubble.vy *= -1;
        }

        drawBubble(bubble, scrollParallax);
      }
    };

    const animate = (t = performance.now()) => {
      if (!mounted) return;
      // Avoid wasted work when hidden.
      if (document.visibilityState !== "visible") return;

      // Throttle drawing to reduce scroll/jank on slower devices
      const targetFPS = shouldAnimate ? 30 : 1; // Minimal updates when disabled
      const frameInterval = 1000 / targetFPS;
      
      if (t - lastDraw > frameInterval) {
        drawFrame();
        lastDraw = t;
      }

      if (shouldAnimate) {
        raf = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      mounted = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateSize);
      cleanupPointerMove();
      sectionsMo.disconnect();
      sectionObserver.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [resolvedTheme]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-0"
        style={{ opacity: 0.22 }}
        aria-hidden="true"
      />
      <div className="pointer-events-none fixed inset-0 z-0 bg-gradient-to-b from-background/0 via-background/6 to-background/40" />
    </>
  );
}
