"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const AnoAI = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Helper to get current theme colors
    const getThemeColors = () => {
      const root = document.documentElement;
      const style = getComputedStyle(root);
      const primary = style.getPropertyValue("--primary").trim() || "#00f2ff";
      const secondary =
        style.getPropertyValue("--secondary").trim() || "#a855f7";
      const background =
        style.getPropertyValue("--background").trim() || "#0a1212";
      const isLight = root.classList.contains("theme-light");
      return { primary, secondary, background, isLight };
    };

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // Keep pixel ratio at 1 — aurora background doesn't need high-res, keeps GPU load low
    renderer.setPixelRatio(1);
    container.appendChild(renderer.domElement);

    const theme = getThemeColors();
    const primaryColor = new THREE.Color(theme.primary);
    const secondaryColor = new THREE.Color(theme.secondary);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
        uColorPrimary: { value: primaryColor },
        uColorSecondary: { value: secondaryColor },
        uBrightness: { value: theme.isLight ? 0.6 : 1.2 },
      },
      vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float iTime;
        uniform vec2 iResolution;
        uniform vec3 uColorPrimary;
        uniform vec3 uColorSecondary;
        uniform float uBrightness;

        #define NUM_OCTAVES 2

        float rand(vec2 n) {
          return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
        }

        float noise(vec2 p) {
          vec2 ip = floor(p);
          vec2 u = fract(p);
          u = u*u*(3.0-2.0*u);

          float res = mix(
            mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
            mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x), u.y);
          return res * res;
        }

        float fbm(vec2 x) {
          float v = 0.0;
          float a = 0.3;
          vec2 shift = vec2(100);
          mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
          for (int i = 0; i < NUM_OCTAVES; ++i) {
            v += a * noise(x);
            x = rot * x * 2.0 + shift;
            a *= 0.4;
          }
          return v;
        }

        void main() {
          vec2 shake = vec2(sin(iTime * 1.2) * 0.005, cos(iTime * 2.1) * 0.005);
          vec2 p = ((gl_FragCoord.xy + shake * iResolution.xy) - iResolution.xy * 0.5) / iResolution.y * mat2(6.0, -4.0, 4.0, 6.0);
          vec2 v;
          vec4 o = vec4(0.0);

          float f = 2.0 + fbm(p + vec2(iTime * 5.0, 0.0)) * 0.5;

          // Reduced from 35 → 18 iterations: ~2x GPU speedup, visually near-identical
          for (float i = 0.0; i < 18.0; i++) {
            v = p + cos(i * i + (iTime + p.x * 0.08) * 0.025 + i * vec2(13.0, 11.0)) * 3.5 + vec2(sin(iTime * 3.0 + i) * 0.003, cos(iTime * 3.5 - i) * 0.003);
            float tailNoise = fbm(v + vec2(iTime * 0.5, i)) * 0.3 * (1.0 - (i / 35.0));
            
            // Theme-based colors with some variance
            float colorMix = 0.5 + 0.5 * sin(i * 0.2 + iTime * 0.3);
            vec3 baseColor = mix(uColorPrimary, uColorSecondary, colorMix);
            
            // Add some dynamic shift to the color components for more depth
            baseColor.r += 0.1 * sin(i * 0.4 + iTime * 0.5);
            baseColor.g += 0.1 * cos(i * 0.3 + iTime * 0.4);
            baseColor.b += 0.1 * sin(i * 0.5 + iTime * 0.3);

            vec4 auroraColors = vec4(baseColor, 1.0);
            
            vec4 currentContribution = auroraColors * exp(sin(i * i + iTime * 0.8)) / length(max(v, vec2(v.x * f * 0.015, v.y * 1.5)));
            float thinnessFactor = smoothstep(0.0, 1.0, i / 18.0) * 0.6;
            o += currentContribution * (1.0 + tailNoise * 0.8) * thinnessFactor;
          }

          o = tanh(pow(o / 100.0, vec4(1.6)));
          gl_FragColor = o * uBrightness;
        }
      `,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Watch for theme changes
    const observer = new MutationObserver(() => {
      const newTheme = getThemeColors();
      material.uniforms.uColorPrimary.value.set(newTheme.primary);
      material.uniforms.uColorSecondary.value.set(newTheme.secondary);
      material.uniforms.uBrightness.value = newTheme.isLight ? 0.6 : 1.2;
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    let frameId: number;
    let lastTime = 0;
    const FPS_CAP = 30;
    const FRAME_INTERVAL = 1000 / FPS_CAP;

    const animate = (timestamp: number) => {
      frameId = requestAnimationFrame(animate);
      const delta = timestamp - lastTime;
      if (delta < FRAME_INTERVAL) return; // skip frame to cap FPS
      lastTime = timestamp - (delta % FRAME_INTERVAL);
      material.uniforms.iTime.value += 0.016;
      renderer.render(scene, camera);
    };
    requestAnimationFrame(animate);

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      material.uniforms.iResolution.value.set(
        window.innerWidth,
        window.innerHeight,
      );
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-screen h-screen overflow-hidden pointer-events-none"
      style={{
        zIndex: 0,
        // Isolate on its own GPU compositing layer so scroll doesn't trigger repaints
        willChange: "transform",
        transform: "translateZ(0)",
      }}
    />
  );
};

export default AnoAI;
