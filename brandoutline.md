# KasauliCoder Brand Outline

This document outlines the core brand identity, color palette, typography, and design system used across the KasauliCoder platform.

## 1. Brand Concept & Theme

- **Name**: KasauliCoder
- **Vibe / Aesthetic**: Modern tech, AI, Developer-focused, Cyberpunk-lite.
- **Visual Design**: Dark mode by default, utilizing glassmorphism, neon glows, subtle gradients, and sharp typography to create a premium, futuristic learning environment.

## 2. Color Palette

### Primary Colors

- **Cyan / Neon Accent (Primary)**: `#00f2ff`
  - _Usage_: Main brand color, buttons, highlighted text, primary borders, icons, neon glows.
- **Secondary Accent (Purple)**: `#a855f7` (Tailwind Purple 500)
  - _Usage_: Alternative neon glows and gradient mixes to pair with the primary cyan.

### Background Colors

- **App Background (Dark)**: `#0a1212` / `#0a0a0a` / `#0a1515`
  - _Usage_: The deep, dark base background. Keeps the contrast high for neon elements.
- **Glass / Surface Backgrounds**:
  - Dark Surface: `rgba(10, 18, 18, 0.7)`
  - Card Surface: `rgba(27, 39, 40, 0.6)`
  - Light Panel Surface: `rgba(39, 57, 58, 0.4)`
  - Subtle Overlay: `rgba(255, 255, 255, 0.03)` or `bg-white/5`

### Text Colors

- **Primary Text**: `#ededed` / `#ffffff` / Slate 100 (High contrast white for headings)
- **Secondary Text (Muted)**: Slate 400 (`#94a3b8`) for descriptions and paragraphs.
- **Tertiary Text (Very Muted)**: Slate 500 (`#64748b`) for microscopic text like uppercase tags or footers.

---

## 3. Typography

- **Display & Headings**: **Inter** (`var(--font-inter)`)
  - _Characteristics_: Used heavily weighted (`font-black`, `font-bold`), often with negative letter-spacing (`tracking-tighter`, `tracking-tight`).
- **Body & Sans-Serif Default**: **Geist Sans** (`var(--font-geist-sans)`)
  - _Characteristics_: Clean, legible for paragraphs and standard UI text.
- **Monospace**: **Geist Mono** (`var(--font-geist-mono)`)
  - _Characteristics_: Used for code snippets, versions (e.g., `system_architecture.v2`), or tech-focused labels. Often styled with `tracking-widest` and uppercase.

---

## 4. UI Design System & Utilities

### Glassmorphism

The UI heavily depends on glass panels overlaying intricate or dark backgrounds:

- **Properties**: `backdrop-filter: blur(12px)`
- **Borders**: Thin, semi-transparent borders: `border-white/10` or primary-tinted `border-primary/20` (`rgba(0, 242, 255, 0.1)`).

### Neon Glows

Used to draw attention and enforce the "cyber/tech" vibe:

- **Cyan Glow**: `box-shadow: 0 0 15px rgba(0, 242, 255, 0.3)`
- **Purple Glow**: `box-shadow: 0 0 15px rgba(168, 85, 247, 0.3)`
- Glows are applied to buttons, important containers, and text borders.

### Gradients

- **Text Gradients**: Flowing from Primary (`#00f2ff`) to `cyan-400`.
- **Radial Gradients**:
  - _Hero Gradient_: `radial-gradient(circle at 50% 50%, rgba(0, 242, 255, 0.15) 0%, rgba(10, 18, 18, 1) 70%)`
  - _Environment Blur_: Absolute elements with `blur-2xl` and `bg-gradient-to-r from-primary/30 to-cyan-500/30`.

### Interactions & Animation

- **Hover States**: Cards moving slightly upward (`hover:-translate-y-1` or `hover:y-[-5px]`), buttons scaling up slightly (`hover:scale-105`), border colors transitioning to a brighter primary.
- **Keyframes**: Slow pulsing (`animate-pulse-slow`) and gradient fluid flows (`animate-gradient`).

### Shapes & Radii

- **Rounding**: Standard UI elements use `rounded-lg` (0.5rem) to `rounded-xl` (0.75rem). Larger containers use `rounded-2xl` or `rounded-3xl`.

### Iconography

- **Material Symbols Outlined**: Clean, legible outline icons (e.g., `terminal`, `rocket_launch`, `schema`) used alongside the primary accent color.
