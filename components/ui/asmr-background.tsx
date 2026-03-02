"use client";

import React, { useEffect, useRef } from "react";

/**
 * ASMRStaticBackground Component
 *
 * Features:
 * - High-density particle system using HTML5 Canvas.
 * - Reactive "magnetic vortex" effect on mouse hover.
 * - Visual "friction glow" when particles accelerate.
 * - Theme-aware colors.
 */
const ASMRStaticBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width: number;
    let height: number;
    let animationFrameId: number;
    let particles: Particle[] = [];
    const mouse = { x: -1000, y: -1000 };
    let resizeTimeout: ReturnType<typeof setTimeout>;

    // Mobile-responsive config
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
    const PARTICLE_COUNT = isMobile ? 300 : isTablet ? 500 : 800;
    const MAGNETIC_RADIUS = isMobile ? 150 : 280;
    const VORTEX_STRENGTH = 0.07;
    const PULL_STRENGTH = isMobile ? 0.08 : 0.12;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Cached colors
    let themeColors = {
      primary: "#00f2ff",
      secondary: "#a855f7",
      background: "#0a1212",
    };

    const updateThemeColors = () => {
      if (typeof window === "undefined") return;
      const style = getComputedStyle(document.documentElement);
      themeColors = {
        primary: style.getPropertyValue("--primary").trim() || "#00f2ff",
        secondary: style.getPropertyValue("--secondary").trim() || "#a855f7",
        background: style.getPropertyValue("--background").trim() || "#0a1212",
      };
    };

    class Particle {
      x: number = 0;
      y: number = 0;
      vx: number = 0;
      vy: number = 0;
      size: number = 0;
      alpha: number = 0;
      rotation: number = 0;
      rotationSpeed: number = 0;
      frictionGlow: number = 0;
      isPrimary: boolean = false;

      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = isMobile
          ? Math.random() * 1.2 + 0.4
          : Math.random() * 1.5 + 0.5;
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = (Math.random() - 0.5) * 0.2;
        this.isPrimary = Math.random() > 0.7;
        this.alpha = Math.random() * 0.4 + 0.1;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.05;
      }

      update() {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MAGNETIC_RADIUS) {
          const force = (MAGNETIC_RADIUS - dist) / MAGNETIC_RADIUS;
          this.vx += (dx / dist) * force * PULL_STRENGTH;
          this.vy += (dy / dist) * force * PULL_STRENGTH;
          this.vx += (dy / dist) * force * VORTEX_STRENGTH * 10;
          this.vy -= (dx / dist) * force * VORTEX_STRENGTH * 10;
          this.frictionGlow = force * 0.7;
        } else {
          this.frictionGlow *= 0.92;
        }

        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.95;
        this.vy *= 0.95;
        this.vx += (Math.random() - 0.5) * 0.04;
        this.vy += (Math.random() - 0.5) * 0.04;
        this.rotation +=
          this.rotationSpeed + (Math.abs(this.vx) + Math.abs(this.vy)) * 0.05;

        if (this.x < -20) this.x = width + 20;
        if (this.x > width + 20) this.x = -20;
        if (this.y < -20) this.y = height + 20;
        if (this.y > height + 20) this.y = -20;
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        const finalAlpha = Math.min(this.alpha + this.frictionGlow, 0.9);
        ctx.fillStyle = this.isPrimary
          ? themeColors.primary
          : themeColors.secondary;
        ctx.globalAlpha = finalAlpha;

        // Skip expensive shadow/glow on mobile for GPU savings
        if (!isMobile && this.frictionGlow > 0.3) {
          ctx.shadowBlur = 8 * this.frictionGlow;
          ctx.shadowColor = themeColors.primary;
        }

        ctx.beginPath();
        ctx.moveTo(0, -this.size * 2.5);
        ctx.lineTo(this.size, 0);
        ctx.lineTo(0, this.size * 2.5);
        ctx.lineTo(-this.size, 0);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }
    }

    const init = () => {
      // Use devicePixelRatio for crisp rendering on retina/mobile screens
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      updateThemeColors();
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
      }
    };

    const render = () => {
      ctx.fillStyle = themeColors.background;
      ctx.globalAlpha = 0.18;
      ctx.fillRect(0, 0, width, height);
      ctx.globalAlpha = 1.0;

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    };

    const observer = new MutationObserver(() => {
      updateThemeColors();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Debounce resize to avoid layout thrashing on mobile orientation changes
    const debouncedInit = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(init, 200);
    };
    window.addEventListener("resize", debouncedInit);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    init();
    render();

    return () => {
      observer.disconnect();
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", debouncedInit);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full -z-10 bg-background overflow-hidden pointer-events-none">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block w-full h-full"
      />
    </div>
  );
};

export default ASMRStaticBackground;
