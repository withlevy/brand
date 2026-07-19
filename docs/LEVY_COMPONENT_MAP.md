# LEVY_COMPONENT_MAP.md

## Purpose

This document maps the Levy design system into a reusable Astro component architecture.

Its purpose is to help implementation stay disciplined as the site evolves. The goal is not to create a huge number of components for their own sake. The goal is to define a small, durable set of structural, typographic, and UI primitives that can be recombined into pages without visual drift.

The rule of thumb is simple:

- use **layouts** for page shells and repeated page-level structure
- use **components** for reusable visual and interactive building blocks
- use **CSS tokens and shared classes** for global consistency
- do not turn every piece of markup into its own precious component unless it meaningfully improves clarity or reuse

---

## Component Categories

The system is best understood in five groups:

1. **Global Shell Components**
2. **Layout Components**
3. **Typography & Metadata Components**
4. **UI Components**
5. **Behavior / Enhancement Components**

---

## 1. Global Shell Components

These define the persistent experience around pages.

### `BaseLayout.astro`

**Responsibility**  
The root page shell. Imports the global CSS, loads fonts, sets metadata scaffolding, and wraps all pages in the standard site chrome.

**What it should contain**
- `<html>`, `<head>`, `<body>`
- imported global stylesheets
- persistent grain layers
- header
- fullscreen menu
- main content slot
- footer
- small global scripts only where necessary

**Likely props**
- `title`
- `description`
- `bodyClass` (optional)
- `pageClass` (optional)

**Dependencies**
- global CSS files
- `GlobalGrain`
- `Header`
- `FullscreenMenu`
- `Footer`

**Notes**
This is where global behavior like the menu toggle, reveal observer, and section theme observer should live if they truly need to affect all pages.

Do not turn `BaseLayout` into a junk drawer for every script under the sun.

---

### `GlobalGrain.astro`

**Responsibility**  
Renders the persistent materiality layers used across the site.

**What it should contain**
- light grain layer
- dark grain layer

**Likely props**
- none

**Dependencies**
- token-driven CSS for blend modes, opacity, and transitions

**Notes**
This should sit outside the page content flow. It is infrastructural, not content.

---

### `Header.astro`

**Responsibility**  
The fixed top bar and brand anchor.

**What it should contain**
- brand mark
- logotype
- menu toggle
- optional small metadata line if later needed

**Likely props**
- none initially

**Dependencies**
- `MenuToggle`
- typography and nav CSS
- theme-aware text and border variables

**Notes**
The header should feel persistent, severe, and spatially economical.

---

### `FullscreenMenu.astro`

**Responsibility**  
The full-screen navigation overlay.

**What it should contain**
- primary site links
- optional metadata rail label
- dramatic but restrained menu presentation

**Likely props**
- `links` (optional if later data-driven)

**Dependencies**
- menu-open body state
- theme/color tokens
- Fraunces styling for large links

**Notes**
This should remain visually bold but structurally simple.

---

### `Footer.astro`

**Responsibility**  
The site’s bottom anchor and closing structural block.

**What it should contain**
- closing headline or CTA
- supporting copy
- email signup or input group
- legal / operational metadata

**Likely props**
- optional CTA content later

**Dependencies**
- `Grid`
- `InputGroup` or form styling
- typography utilities

**Notes**
The footer should feel like part of the system, not a generic “website footer.”

---

## 2. Layout Components

These help enforce macro structure.

### `Grid.astro`

**Responsibility**  
A wrapper for the main 5-column layout system.

**What it should contain**
- a simple wrapper element with `.nasa-grid`

**Likely props**
- `as` (optional element tag)
- `class` (optional extra classes)

**Dependencies**
- `grid.css`

**Notes**
This is a lightweight convenience wrapper, not a complicated abstraction.

---

### `SectionShell.astro` *(recommended)*

**Responsibility**  
A standardized section wrapper for consistent theme and spacing behavior.

**What it should contain**
- `<section>`
- optional `data-theme`
- slot content

**Likely props**
- `id`
- `theme` (`light` or `dark`)
- `class`

**Dependencies**
- section spacing rules
- theme observer logic in layout

**Notes**
This will help reduce repeated section boilerplate and keep page composition cleaner.

---

### `ContentBlock.astro` *(recommended)*

**Responsibility**  
A recurring narrative structure that places metadata in column 1 and main content in columns 2–4 or 2–5.

**What it should contain**
- optional metadata slot
- main content slot
- optional secondary slot

**Likely props**
- `variant` (`standard`, `wide`, `split`)
- `theme` (optional)
- `class`

**Dependencies**
- `Grid`
- grid span classes
- metadata components

**Notes**
This can be introduced later if repeated page structures become obvious.

---

## 3. Typography & Metadata Components

These enforce the distinctive Levy language.

### `VerticalLabel.astro`

**Responsibility**  
Renders the metadata rail label used in column 1.

**Likely props**
- `text`
- `class` (optional)

**Dependencies**
- typography classes
- responsive CSS that flips orientation on mobile

**Notes**
This is one of the signature visual elements. Keep it simple and reusable.

---

### `DimensionLabel.astro`

**Responsibility**  
Renders small technical metadata with the diagonal tick mark.

**Likely props**
- `text`
- `class` (optional)

**Dependencies**
- monospace metadata styling
- pseudo-element styling in CSS

**Notes**
This should be used for section markers, article metadata, module identifiers, and small operational labels.

---

### `HeadlineBlock.astro` *(recommended)*

**Responsibility**  
A recurring title/subtitle pattern for sections.

**Likely props**
- `eyebrow`
- `title`
- `body`
- `titleTag` (optional)

**Dependencies**
- headline and body text styles
- `DimensionLabel` optionally

**Notes**
Useful once repeated section intros appear across multiple pages.

---

## 4. UI Components

These are the reusable interaction and interface primitives.

### `MenuToggle.astro`

**Responsibility**  
The structural hamburger icon that toggles menu state.

**Likely props**
- `ariaLabel` (optional)

**Dependencies**
- global menu-open state
- CSS transforms for line morphing

**Notes**
This includes JS behavior indirectly via global layout logic.

---

### `Button.astro`

**Responsibility**  
Standard interactive button and CTA link styling.

**Likely props**
- `href`
- `type`
- `variant` (optional, though variants should remain few)
- `class`

**Dependencies**
- button CSS
- typography tokens

**Notes**
Use for both links and buttons, but keep semantics correct.

---

### `InputGroup.astro`

**Responsibility**  
Blueprint-style input field group.

**Likely props**
- `label`
- `type`
- `name`
- `placeholder`
- `required`
- `class`

**Dependencies**
- input CSS
- monospace label styling

**Notes**
This should feel infrastructural and spare.

---

### `DashboardWindow.astro`

**Responsibility**  
A container for simulated strategic UI or app-like content blocks.

**Likely props**
- `class`

**Dependencies**
- backdrop styling
- border rules
- spacing utilities

**Notes**
Use when visualizing systems, signals, or interface-like constructs.

---

### `DashboardCard.astro`

**Responsibility**  
A card row or data row inside `DashboardWindow`.

**Likely props**
- `label`
- `title`
- `meta`
- `class`

**Dependencies**
- dashboard window styling
- typography classes

**Notes**
This should feel more like a data slab than a consumer card.

---

### `RisoContainer.astro`

**Responsibility**  
A controlled atmospheric component with ink and grain behavior.

**Likely props**
- `interactive` (boolean)
- `class`

**Dependencies**
- ink tokens
- mask texture
- optional mouse interaction JS

**Notes**
Use sparingly. This is seasoning, not the meal.

---

## 5. Behavior / Enhancement Components

These improve experience but should remain lightweight.

### `Reveal.astro` *(optional wrapper)*

**Responsibility**  
A lightweight wrapper that applies reveal classes and optional delay classes.

**Likely props**
- `delay`
- `class`
- `as`

**Dependencies**
- reveal classes in utilities/global CSS
- intersection observer in layout

**Notes**
This is optional. You may also apply reveal classes directly in markup.

---

### `ThemeSection.astro` *(optional alias of SectionShell)*

**Responsibility**  
A convenience section wrapper that sets theme state via `data-theme`.

**Likely props**
- `theme`
- `id`
- `class`

**Dependencies**
- theme observer logic
- section spacing rules

**Notes**
This is only worth creating if it meaningfully reduces repetition.

---

## Presentational vs Behavioral Guidance

Some components should remain purely presentational. Others require light JavaScript support.

### Presentational
- `GlobalGrain`
- `Grid`
- `VerticalLabel`
- `DimensionLabel`
- `Button` (unless used as actual button interactions)
- `InputGroup`
- `DashboardWindow`
- `DashboardCard`

### Behavioral or behavior-adjacent
- `BaseLayout`
- `Header`
- `MenuToggle`
- `FullscreenMenu`
- `RisoContainer`
- `Reveal` (if wrapped)
- `SectionShell` / theme sections in relation to observer logic

Keep behavior centralized where possible. Do not distribute tiny redundant scripts across many components.

---

## Token and Utility Dependencies

Most components depend on a shared foundation rather than bespoke local styling.

### Strong dependencies on tokens
- `Header`
- `FullscreenMenu`
- `Footer`
- `Button`
- `InputGroup`
- `DashboardWindow`
- `RisoContainer`

### Strong dependencies on grid utilities
- `Grid`
- `Footer`
- section-level page compositions
- content blocks
- style guide previews

### Strong dependencies on typography utilities
- `VerticalLabel`
- `DimensionLabel`
- `HeadlineBlock`
- all section intros
- article metadata displays later

---

## Page Assembly Patterns

These patterns describe how components should combine into real pages.

### 1. Homepage Hero

**Structure**
- `SectionShell`
- `Grid`
- column 1: `VerticalLabel` and/or `DimensionLabel`
- columns 2–4: H1 + supporting paragraph
- optional CTA row below

**Likely components**
- `SectionShell`
- `Grid`
- `VerticalLabel`
- `DimensionLabel`
- `Button`

**Purpose**
Establish tone immediately: serious, asymmetric, exacting.

---

### 2. Editorial Content Section

**Structure**
- `SectionShell`
- `Grid`
- metadata rail in column 1
- main narrative block in columns 2–4
- optional supporting block in columns 4–5 or 2–5

**Likely components**
- `SectionShell`
- `Grid`
- `VerticalLabel`
- `DimensionLabel`

**Purpose**
Carry strategic text and framing without collapsing into generic content columns.

---

### 3. Split Narrative / Systems Block

**Structure**
- `SectionShell`
- `Grid`
- metadata in column 1
- left narrative in columns 2–3
- right supporting narrative or UI block in columns 4–5

**Likely components**
- `Grid`
- `DimensionLabel`
- `DashboardWindow` or plain text block

**Purpose**
Support contrast, comparison, or paired arguments.

---

### 4. System Demo / Interface Section

**Structure**
- `SectionShell`
- `Grid`
- intro block
- full-width or wide `RisoContainer` / `DashboardWindow`

**Likely components**
- `Grid`
- `DimensionLabel`
- `RisoContainer`
- `DashboardWindow`
- `DashboardCard`

**Purpose**
Break up text-heavy pages and visualize systems logic.

---

### 5. Footer CTA Block

**Structure**
- `Footer`
- metadata rail
- large closing statement
- supporting copy
- email field

**Likely components**
- `Footer`
- `Grid`
- `VerticalLabel`
- `InputGroup`

**Purpose**
End with authority and invitation, not noise.

---

### 6. Style Guide Preview Section

**Structure**
- `SectionShell`
- `Grid`
- metadata rail
- preview block for tokens, type, grid, or components

**Likely components**
- all typography and UI primitives as needed

**Purpose**
Support `/styles` as a regression surface and a living system manual.

---

## Initial Astro File Map

This is the recommended first-pass component file structure.

```text
src/
  components/
    global/
      GlobalGrain.astro
      Header.astro
      FullscreenMenu.astro
      Footer.astro
      MenuToggle.astro
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