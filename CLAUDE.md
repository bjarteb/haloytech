# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Astro-based project called "violet-visual". Astro is a modern static site generator that supports multiple UI frameworks and optimizes for performance by shipping minimal JavaScript to the client.

## Development Commands

All commands use npm and are run from the project root:

- `npm run dev` - Start development server at `localhost:4321`
- `npm run build` - Build production site to `./dist/`
- `npm run preview` - Preview the production build locally
- `npm run astro ...` - Run Astro CLI commands (e.g., `npm run astro add`, `npm run astro check`)

## Architecture

### Directory Structure

- `src/pages/` - File-based routing. Each `.astro` file becomes a route
- `src/layouts/` - Layout components that wrap page content
- `src/components/` - Reusable Astro components
- `src/assets/` - Static assets processed by Astro's asset pipeline
- `public/` - Static files served directly (not processed)
- `dist/` - Build output (generated, not committed)

### Astro Components

Astro components (`.astro` files) have a unique structure:
- Frontmatter section (between `---` delimiters) for component logic and imports
- Template section using HTML-like syntax with JSX-style expressions
- Optional `<style>` and `<script>` tags that are scoped by default

### TypeScript Configuration

The project uses Astro's strict TypeScript configuration (`astro/tsconfigs/strict`). Type definitions are auto-generated in `.astro/types.d.ts` based on the project structure.

### Layout Pattern

Pages use the Layout component pattern: `src/layouts/Layout.astro` provides the base HTML structure, and pages pass content via the `<slot />` mechanism.
