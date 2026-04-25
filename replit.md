# Workspace

## Overview

Monorepo housing the **Mega Bags** marketing website — a 3-page (Home, Products, Contact) responsive React site for a Premier Industrial Paper Bag Manufacturer in Ankleshwar, Gujarat. Tagline: "Mega Bags - Carries your trust."

## Artifacts

- `artifacts/megabags` — main marketing site (React + Vite + Tailwind + Framer Motion + lucide-react). PreviewPath `/`.
- `artifacts/api-server` — scaffolded Express API (currently unused by megabags).
- `artifacts/mockup-sandbox` — design exploration sandbox.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React 18 + Vite 7 + Tailwind + shadcn/ui + Framer Motion + wouter
- **API framework**: Express 5 (scaffold)
- **Database**: PostgreSQL + Drizzle ORM (scaffold)

## Key Pages / Features (megabags)

- **Home** — Hero, Interactive 360° Customizer (`#customize`), Process timeline, Certifications, Why Us, About.
- **Products** — Product grid with details.
- **Contact** — Form + map.
- **Layout** — Navbar, mobile bottom tab bar, footer, floating WhatsApp + AI chatbot widgets.

## 360° Customizer

Located in `artifacts/megabags/src/pages/Home.tsx` (`ProductViewerSection`). Driven by `artifacts/megabags/src/data/products360.ts`.

- 5 selectable products via thumbnail chips.
- Frame-based rotation engine: each product has a `frames` array; rotation snaps to nearest frame.
  - `pom`: full 8-frame real 360 (AI-generated photoreal kraft sack from 8 angles).
  - `multiwall`: 2 generated frames + padded fallback.
  - `valve`, `hdpe`, `lstitched`: single product image (free-tier image-gen cap of 10 images per session prevented full sets).
- Drag-to-rotate with inertia decay; auto-rotate spin/pause toggle; degree readout; frame-pip indicator.
- Customization: company name, tagline, brand color, uploaded logo.
- Overlay is **draggable** (pointer drag on the artwork) and **resizable** (orange corner handle) plus X / Y / Size sliders for fine control. Front-face overlay opacity fades when bag is rotated past ~±60°.

## Image Assets

- `attached_assets/images/*` — base bag, hero, generated product images.
- `attached_assets/images/360/{pom,multiwall}/frame-NN.png` — 360 frame sets.
- Vite alias: `@assets` → `attached_assets/`, `@` → `src/`.

## Constraints / Notes

- **Free-tier image generation cap**: 10 images per run (session-wide). Plan around this when adding new generated assets.
- Logo asset alias works via `@assets/megabags-logo-cropped_*.webp`.
- Overlay coords stored as percent of bag bounding box (5–95 clamped) so layout is responsive.

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/megabags run dev` — run megabags locally
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure and package details.
