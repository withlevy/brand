# LEVY_DESIGN_SYSTEM.md

## Design Intent

Levy’s visual system should feel like a strategic instrument, not a startup costume.

It draws from the severe structural clarity of the NASA 1976 Graphics Standards Manual, the editorial authority of archival institutional documents, and the spatial discipline of *Ma*—the use of intentional emptiness as a design element rather than a gap to be filled. The result should feel rigorous, composed, and slightly austere in the best way: a website built by serious people who know where the load-bearing beams are.

### What it should feel like

- An archival technical manual
- A strategic briefing document
- A brutalist but refined institutional system
- A field guide for operators, not a glossy ad
- Controlled, sharp, intelligent, and durable

### What it should not feel like

- Generic startup SaaS
- Soft, bubbly, friendly-by-default consumer UX
- Trend-chasing “modern web” polish
- Web3 chrome or neon futurism
- A marketing site trying too hard to be inspiring

### Governing tensions

The system works because it holds a few tensions at once:

- **Machine precision vs. human discernment**  
  Inter handles structure. Fraunces handles tension, humanity, and editorial emphasis.

- **Institutional authority vs. atmospheric materiality**  
  The grid and typography are strict; the grain and ink overlays add physicality and warmth.

- **Asymmetry vs. stability**  
  The layout is intentionally off-balance, but never chaotic.

- **Restraint vs. drama**  
  Drama comes from scale, emptiness, type, and contrast—not ornament.

### Role of whitespace

Whitespace is structural. Empty columns, large section paddings, and asymmetrical layouts are not unfinished areas. They are part of the composition. The system should resist the urge to “fill” unused space just because it exists.

---

## Core Principles

### 1. The grid is the primary organizing logic

All major layout sections should be built on a strict 5-column grid. This is the macro layout system. It should organize page rhythm, alignment, and hierarchy.

The grid is not decorative. It is the operating framework.

### 2. Column 1 is a metadata rail

The first column is reserved for technical labels, section identifiers, metadata, and navigational or contextual language. It creates the hanging-indent feel that distinguishes the layout from standard centered marketing pages.

Body copy and primary narrative content should not live in column 1.

### 3. Asymmetry is intentional

Long-form narrative content will often live in columns 2–4, leaving column 5 empty. That empty space is not a mistake. It creates tension, control, and a sense of editorial discipline.

### 4. Themes are section-driven

Light and dark themes should be applied at the section level using `data-theme="light"` and `data-theme="dark"` on structural sections. Theme changes should be handled through CSS variables and global logic, not repeated hardcoded colors.

### 5. Motion should feel physical, not decorative

Motion exists to:
- reveal structure
- reinforce transitions
- support responsiveness
- add tactility

It should never feel playful, floaty, or overly animated.

### 6. Materiality matters

The site should not feel digitally sterile. Grain, ink behavior, subtle overlays, and friction in the visual field are part of the brand language. These should remain restrained and infrastructural, not turn into texture theater.

### 7. Mobile preserves the system, it does not replace it

On mobile, the grid collapses to a single column, but the logic should remain intact:
- labels become horizontal
- spacing tightens
- the hierarchy stays severe
- the aesthetic stays recognizable

---

## Tokens

These tokens should be the basis of the system and centralized into `tokens.css`.

### Color Tokens

- `--mission-white: #F4F4F4;`
- `--midnight-navy: #0A111F;`
- `--violet-atmosphere: #6B21A8;`

### Ink / Material Tokens

- `--ink-base: rgba(107, 33, 168, 0.15);`
- `--ink-active: rgba(63, 0, 255, 0.25);`

### Theme Tokens

- `--bg-color: var(--mission-white);`
- `--text-color: var(--midnight-navy);`
- `--border-color: rgba(10, 17, 31, 0.15);`
- `--heavy-line: 1.5px solid var(--midnight-navy);`

Dark mode overrides:

- `--bg-color: var(--midnight-navy);`
- `--text-color: var(--mission-white);`
- `--border-color: rgba(244, 244, 244, 0.15);`
- `--heavy-line: 1.5px solid var(--mission-white);`

### Typography Tokens

- `--font-sans: 'Inter', -apple-system, sans-serif;`
- `--font-serif: 'Fraunces', serif;`
- `--font-mono: monospace;`

Recommended variable font settings for Fraunces:

- `font-variation-settings: "opsz" 100, "SOFT" 50, "WONK" 0;`

### Type Scale Tokens

- `--type-headline-l: clamp(2.5rem, 6vw, 4.5rem);`
- `--type-headline-m: clamp(2rem, 4vw, 3rem);`
- `--type-body: clamp(0.95rem, 2vw, 1.1rem);`
- `--type-micro: 0.5rem;`

### Spacing Tokens

These should be formalized instead of repeatedly improvised inline.

- `--space-0: 0;`
- `--space-1: 0.25rem;`
- `--space-2: 0.5rem;`
- `--space-3: 0.75rem;`
- `--space-4: 1rem;`
- `--space-6: 1.5rem;`
- `--space-8: 2rem;`
- `--space-12: 3rem;`
- `--space-16: 4rem;`
- `--space-24: 6rem;`
- `--space-layout-x: 4vw;`
- `--space-grid-gap: 4vw;`
- `--space-grid-gap-mobile: 3rem;`
- `--space-section-y: 20vh;`
- `--space-section-y-mobile: 12vh;`

### Motion Tokens

- `--ease-expo: cubic-bezier(0.16, 1, 0.3, 1);`
- `--ease-fluid: cubic-bezier(0.25, 1, 0.5, 1);`
- `--theme-fade: background-color 0.8s ease-in-out, color 0.8s ease-in-out, border-color 0.8s ease-in-out;`

### Z-Index Tokens

- `--z-layout: 10;`
- `--z-header: 10000;`
- `--z-grain: 9998;`
- `--z-menu: 9999;`
- `--z-ui: 10001;`

---

## Typography System

Typography is one of the main engines of the system. It must remain disciplined.

### Inter: the structural voice

Inter is the primary sans-serif and should carry the architectural load of the interface.

#### Use for:
- H1s and H2s
- navigation
- button text
- UI labels
- structural headings
- major page anchors

#### Recommended styling:
- weight: 500 for major headings
- uppercase for structural headings and UI
- tight tracking around `-0.03em`
- low line-height around `1.05`

This text should feel like engineered information.

### Fraunces: the editorial counterpoint

Fraunces should be used sparingly and intentionally. It introduces a more human, elegant, and reflective tone against the machine logic of the grid.

#### Use for:
- H3s
- pull quotes
- highlighted editorial lines
- large menu links
- occasional high-emphasis narrative moments

#### Recommended styling:
- low weight, around 150
- sentence case
- variable settings preserved
- slightly looser line-height than Inter

Fraunces should feel like a technical pen, not a literary flourish.

### Inter Light: body copy

Body copy should be clear, plainspoken, and subordinate to the structural hierarchy.

#### Use for:
- paragraph text
- explanatory copy
- descriptions
- article intros and supporting text

#### Recommended styling:
- weight: 300
- line-height: around 1.6
- no decorative tracking
- modest opacity where appropriate

### Monospace: metadata and signal

Monospace is reserved for technical labels and small metadata, not general prose.

#### Use for:
- section coordinates
- dimension labels
- tiny navigation metadata
- article metadata
- utility labels

#### Recommended styling:
- `0.5rem`
- uppercase
- wide tracking
- restrained opacity

---

## Layout Rules

### Grid behavior

Every major section should contain a grid wrapper. Child elements should map to clear span classes.

Recommended spans:
- `.span-col-1`
- `.span-col-2-5`
- `.span-col-2-4`
- `.span-col-2-3`
- `.span-col-4-5`
- `.span-all`

### Column usage

- **Column 1:** metadata, labels, structural context
- **Columns 2–4:** narrative content, type hierarchy, main page flow
- **Column 5:** often intentionally empty, or used for a secondary block

### Macro vs. micro layout

- Use **grid** for page and section structure
- Use **flexbox** inside components where appropriate

This matters. Flexbox is not forbidden. It is just not the governing macro layout system.

### Spacing

Spacing should come from a coherent token system and small utility layer. Do not leave repeated inline spacing values scattered across the codebase.

---

## Component Rules

### Header

The header is fixed, sharp, and infrastructural. It should feel like a persistent instrument panel, not a decorative nav bar.

### Fullscreen Menu

The fullscreen menu should feel imposing, editorial, and clean. Large Fraunces links are appropriate here because the menu is one of the few places where the system can become momentarily dramatic.

### Button

Buttons should be:
- border-based
- transparent by default
- uppercase monospace
- precise, not pillowy
- animated with restrained fill transitions

### Input Group

Inputs should look like forms in a blueprint, not like app widgets. Labels sit outside the field. Borders are minimal and severe.

### Dashboard Window / Card

These simulate interface panels within the system. They should feel analytical, layered, and sharp. No soft cards. No generic glassmorphism. Backdrop blur can be used carefully.

### Riso Container

This is a controlled atmospheric element. It should feel tactile and active, but not like a hero gimmick. Use sparingly.

### Footer

The footer should behave like a final systems block: structured, typographic, and coherent with the rest of the grid.

---

## Implementation Freedoms

The implementation should preserve the system’s visual logic and structural discipline, but the coding agent is allowed to make pragmatic improvements where needed.

### Allowed improvements

- replace repeated inline spacing with token-based utilities
- use flexbox for internal component alignment
- improve accessibility and semantic HTML
- reorganize CSS into maintainable files
- introduce a small, coherent utility layer
- improve brittle responsive behavior
- slightly rationalize repeated patterns into reusable components

### Not allowed

- redesigning the site into a generic startup aesthetic
- flattening the asymmetrical layout into centered blocks
- replacing the typography hierarchy
- removing the metadata rail concept
- converting the system to Tailwind
- over-rounding, over-shadowing, or over-softening the interface
- turning the visual austerity into blandness

---

## Anti-Patterns

Avoid these.

### 1. Generic SaaS polish
No glossy, soft, “premium startup” style language.

### 2. Centering major blocks
Do not center large content areas just because it feels conventional.

### 3. Overuse of rounded corners
Rounded corners should not become part of the system language by default.

### 4. Heavy shadows
Depth comes from contrast, lines, texture, overlays, and hierarchy—not shadows.

### 5. Arbitrary inline styles
The prototype used inline styles for speed. The implementation should migrate these to tokens, utilities, or component styles.

### 6. Broken metadata rail logic
Do not put major narrative content into column 1.

### 7. Over-animation
No floaty motion, no decorative parallax, no startup-tech nonsense.

### 8. Typography drift
Do not start mixing in random font weights, decorative styles, or alternative hierarchy logic.

### 9. Filling the void
If a column is empty on desktop, that may be correct. Resist the impulse to “fix” the composition.

### 10. Tailwind conversion
This system should remain legible as a designed system, not dissolve into a cloud of utilities.

---

## `/styles` Page Role

The `/styles` page should function as a living design system and regression surface.

It should:
- preview tokens
- show typography hierarchy
- demonstrate grid behavior
- display core UI components
- validate theme transitions
- serve as a visual testbed when changes are made globally

It is not the literal source of truth for styling. The source of truth should live in tokens, global CSS, and reusable components. The styles page simply exposes the system in one place.

---

## Final Implementation Principle

Levy should look like a serious operating framework for people trying to move systems, not a website trying to look important.

Precision matters. Restraint matters. Emptiness matters.

Do not sand off the weirdness. That is where the authority lives.