# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Astro-based event landing page for "haloytech" deployed at https://haloy.tech. The site showcases a creative event (Creative Summit 2026) with modern animations and responsive design.

## Development Commands

All commands use npm and are run from the project root:

- `npm install` - Install dependencies
- `npm run dev` - Start development server at `localhost:4321`
- `npm run build` - Build production site to `./dist/`
- `npm run preview` - Preview the production build locally
- `npm run astro ...` - Run Astro CLI commands (e.g., `npm run astro add`, `npm run astro check`)

## Architecture

### Site Configuration

The site is configured in `astro.config.mjs`:
- `site: 'https://haloy.tech'` - Custom domain configuration for production
- No `base` path since the site serves from root
- Deployed via GitHub Actions to GitHub Pages (see `.github/workflows/deploy.yml`)

### Component Organization

Components are organized by feature area:
- `src/components/event/` - Event-specific components for the landing page
  - `EventHero.astro` - Hero section with animated background, title, and CTA buttons
  - `EventCTA.astro` - Call-to-action section
  - `EventFooter.astro` - Footer section

### Layout System

`src/layouts/Layout.astro` provides the base HTML structure accepting:
- `title` prop (default: "Creative Summit 2026")
- `description` prop for SEO meta tags
- Content is injected via `<slot />` mechanism

Pages compose these components (e.g., `src/pages/index.astro` combines EventHero, EventCTA, and EventFooter).

### Styling Approach

- Scoped styles within each `.astro` component using `<style>` tags
- CSS animations defined inline (fadeInUp, float, bounce, gradientShift)
- Responsive design with media queries for mobile (`@media screen and (max-width: 768px)`)
- Accessibility support with `prefers-reduced-motion` query
- Color scheme: Dark theme with purple/pink gradients (#8B5CF6, #A855F7, #FB7185)

### Astro Components

Astro components (`.astro` files) structure:
- Frontmatter section (between `---` delimiters) for imports and TypeScript logic
- Template section using HTML-like syntax with JSX-style expressions
- Optional `<style>` and `<script>` tags that are scoped by default

### TypeScript Configuration

- Uses Astro's strict TypeScript configuration (`astro/tsconfigs/strict`)
- Type definitions auto-generated in `.astro/types.d.ts`
- Interface Props pattern for component props (see `Layout.astro`)

## Deployment

Automatic deployment via GitHub Actions:
- Triggers on push to `main` branch or manual workflow dispatch
- Builds with Node.js 20 using `npm ci` and `npm run build`
- Deploys `./dist` output to GitHub Pages
- Accessible at custom domain https://haloy.tech
