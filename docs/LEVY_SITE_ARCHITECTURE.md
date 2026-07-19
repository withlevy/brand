# LEVY_SITE_ARCHITECTURE.md

## Purpose

This document defines the recommended architecture for building the Levy website in Astro.

It exists to keep implementation coherent as the site evolves from a prototype into a durable, content-forward, Netlify-hosted system. The goal is to preserve the Levy visual language while creating a repo structure that is understandable, extendable, and safe for iterative development by both humans and coding agents.

This is a static-first site. It should feel editorial and institutional, not application-heavy. Interactivity should be light, purposeful, and localized.

---

## Architectural Principles

### 1. Static-first by default

The site should be built as a static Astro site unless there is a strong reason otherwise. Most pages are content and layout problems, not app problems.

Use client-side JavaScript only where needed for:
- menu toggle behavior
- section theme observation
- reveal-on-scroll behavior
- localized atmospheric interactions like the Riso module

Do not introduce unnecessary app complexity.

### 2. Design system first, pages second

Pages should be composed from:
- global tokens
- shared layout rules
- reusable typography patterns
- small, durable components

Do not build each page as a one-off design experiment.

### 3. `/styles` is a living regression surface

The styles page should exist as a dedicated route that previews the design system and core UI patterns.

It is:
- a system manual
- a visual regression surface
- a testing ground for CSS changes

It is not the literal source of truth. The source of truth should live in tokens, shared stylesheets, and reusable components.

### 4. Grid governs macro layout

Use the 5-column NASA-inspired grid for page and section structure. Use flexbox internally where appropriate inside components.

### 5. Content architecture should be simple and editorial

The site should support:
- core brand and narrative pages
- an evolving newsroom
- future program or network pages

It should not over-engineer the content model at the start.

---

## Recommended Astro Folder Structure

```text
src/
  components/
    global/
      BaseHead.astro
      GlobalGrain.astro
      Header.astro
      MenuToggle.astro
      FullscreenMenu.astro
      Footer.astro
    layout/
      Grid.astro
      SectionShell.astro
      Reveal.astro
    typography/
      VerticalLabel.astro
      DimensionLabel.astro
      HeadlineBlock.astro
    ui/
      Button.astro
      InputGroup.astro
      DashboardWindow.astro
      DashboardCard.astro
      RisoContainer.astro

  content/
    config.ts
    newsroom/

  layouts/
    BaseLayout.astro
    ArticleLayout.astro

  pages/
    index.astro
    styles.astro
    about.astro
    network.astro
    studio.astro
    institute.astro
    newsroom/
      index.astro
      [slug].astro

  styles/
    tokens.css
    global.css
    grid.css
    typography.css
    components.css
    utilities.css

public/
  images/
  icons/
  textures/

astro.config.mjs
netlify.toml
package.json