import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface Bubble {
    x: number;
    y: number;
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

        // Set canvas size
        const updateSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        updateSize();
        window.addEventListener("resize", updateSize);

        // Check if reduced motion is preferred
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        // Reduce bubble count on mobile for performance
        const isMobile = window.innerWidth < 768;
        const bubbleCount = isMobile ? 8 : 15;

        // Create bubbles
        const bubbles: Bubble[] = [];
        for (let i = 0; i < bubbleCount; i++) {
            bubbles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 60 + 30, // 30-90px
                vx: (Math.random() - 0.5) * 0.3, // Slow horizontal movement
                vy: (Math.random() - 0.5) * 0.3, // Slow vertical movement
                opacity: Math.random() * 0.15 + 0.05, // 0.05-0.2
                blur: Math.random() * 30 + 10, // 10-40px blur for depth
            });
        }

        // Animation loop
        let animationId: number;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            bubbles.forEach((bubble) => {
                // Update position
                if (!prefersReducedMotion) {
                    bubble.x += bubble.vx;
                    bubble.y += bubble.vy;

                    // Bounce off edges
                    if (bubble.x < -bubble.radius || bubble.x > canvas.width + bubble.radius) {
                        bubble.vx *= -1;
                    }
                    if (bubble.y < -bubble.radius || bubble.y > canvas.height + bubble.radius) {
                        bubble.vy *= -1;
                    }
                }

                // Draw bubble with gradient
                const gradient = ctx.createRadialGradient(
                    bubble.x,
                    bubble.y,
                    0,
                    bubble.x,
                    bubble.y,
                    bubble.radius
                );

                // Color based on theme
                const isDark = resolvedTheme === "dark";
                if (isDark) {
                    // Dark mode: blue-purple gradient
                    gradient.addColorStop(0, `rgba(96, 165, 250, ${bubble.opacity * 0.8})`); // primary blue
                    gradient.addColorStop(0.5, `rgba(167, 139, 250, ${bubble.opacity * 0.5})`); // accent purple
                    gradient.addColorStop(1, `rgba(96, 165, 250, 0)`);
                } else {
                    // Light mode: softer blue-purple
                    gradient.addColorStop(0, `rgba(59, 130, 246, ${bubble.opacity * 0.6})`); // primary blue
                    gradient.addColorStop(0.5, `rgba(139, 92, 246, ${bubble.opacity * 0.4})`); // accent purple
                    gradient.addColorStop(1, `rgba(59, 130, 246, 0)`);
                }

                // Apply blur for depth
                ctx.filter = `blur(${bubble.blur}px)`;
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.filter = "none";
            });

            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", updateSize);
            cancelAnimationFrame(animationId);
        };
    }, [resolvedTheme]);

    return (
        <canvas
            ref={canvasRef}
            className="pointer-events-none fixed inset-0 z-0"
            style={{ opacity: 0.4 }}
            aria-hidden="true"
        />
    );
}
