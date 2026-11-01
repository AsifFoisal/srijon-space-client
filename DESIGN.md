---
name: Srijon Space
description: Creative studios, ready to book — a marketplace for photo, film, podcast, music, and art spaces.
colors:
  ivory: "#f7f3eb"
  paper: "#fffcf6"
  sand: "#ece4d5"
  stone: "#6f6a60"
  ink: "#171512"
  line: "#ddd3c3"
  accent: "#e8491d"
  accent-deep: "#c53a12"
  accent-soft: "#f9e1d5"
  dark: "#121110"
  dark-soft: "#1b1916"
  on-dark: "#f7f3eb"
typography:
  display:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.9rem, 6.5vw, 6.1rem)"
    fontWeight: 500
    lineHeight: 0.94
    letterSpacing: "-0.055em"
  headline:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.75rem"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: "0em"
  compact:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0em"
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.28em"
  micro:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.625rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.18em"
rounded:
  pill: "9999px"
  overlay: "1.5rem"
  card: "1rem"
  input: "0.75rem"
spacing:
  sm: "12px"
  md: "20px"
  lg: "32px"
  xl: "40px"
  section: "80px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.accent-deep}"
  button-secondary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ivory}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "48px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "48px"
  card-studio:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
  input-text:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.input}"
    height: "48px"
---

# Design System: Srijon Space

## Overview

**Creative North Star: "The Print Atelier"**

Srijon Space looks like a working print studio that happens to rent rooms. Surfaces are uncoated paper stock — warm ivory and soft paper white rather than clinical white — structured by honest 1px rules and set in ink, never pure black. Press-red-orange is the only loud voice in the room: the color of a stamp, a booking confirmation, a "Book now" you can't miss. A fine grain overlay on dark sections gives every surface the texture of stock rather than glass.

The system is editorial in its type and tactile in its controls. Display headlines are set in Space Grotesk with tight negative tracking, introduced by small letterspaced uppercase kickers like plate captions. Buttons are full pills with a springy circular-reveal hover; cards stay flat and bordered at rest, lifting softly only when touched. Density is generous — 80px+ section rhythm, roomy card padding — because the photography of real studios is the product and needs wall space.

This world rejects cool neutrals (no gray-blues, no pure `#000`/`#fff`), glassmorphism, neon gradients, and more than one accent hue.

**Key Characteristics:**

- Warm paper palette with a single press-red accent
- Space Grotesk display (tight tracking) over Inter body; script reserved for the wordmark
- Flat, border-structured surfaces; soft directional shadows only on interaction
- Pill controls with circular-reveal hover; 1rem-radius cards
- Grain texture and giant outlined display text on dark feature sections

## Colors

Uncoated warm paper stock with ink text and one press-red-orange accent; a parallel near-black world for hero and host-CTA sections.

### Primary
- **Press Red-Orange** (`#e8491d`, dark mode `#ff5a2a`): the only accent. Primary buttons, booking CTAs, focus rings, selection highlights, error text on paper. Its rarity is the point — roughly ≤10% of any screen.
- **Press Red-Orange, Deep** (`#c53a12`, dark mode `#ff7a45`): hover and pressed states of the accent; error text on paper.

### Secondary
- **Accent Tint** (`#f9e1d5`, dark mode `#3a2118`): the accent diluted into a wash — soft error surfaces, accent-tinted badges and backgrounds. Never used as a border or text color on light surfaces.

### Neutral
- **Ivory** (`#f7f3eb`, dark mode `#121110`): page background, text on dark sections.
- **Paper** (`#fffcf6`, dark mode `#1b1916`): cards, inputs, popovers, modals — one step brighter than the page.
- **Sand** (`#ece4d5`, dark mode `#26221d`): muted fills, skeletons, secondary chips; hover tints via ink at 4–6% alpha.
- **Stone** (`#6f6a60`, dark mode `#a9a196`): secondary text — descriptions, metadata, kickers, placeholders.
- **Ink** (`#171512`, dark mode `#f7f3eb`): primary text; also the `secondary` button fill.
- **Line** (`#ddd3c3`, dark mode `#34302a`): every 1px border and input stroke.
- **Dark** (`#121110` / `#0b0a09`): full-bleed dark sections (hero, host CTA, footer) with grain overlay.
- **Dark Soft** (`#1b1916`): elevated surfaces within dark sections.

### Named Rules
**The One Press Rule.** Press-red is the single accent; it appears only on actions, active states, and the rare highlighted figure. If a second screen element competes with the primary CTA for orange, one of them is wrong.

## Typography

**Display Font:** Space Grotesk (with ui-sans-serif fallback) — headings, stat numerals, nav brand
**Body Font:** Inter (with ui-sans-serif fallback) — everything else
**Label/Script Font:** Playwrite IT Trad — the Srijon Space wordmark only

**Character:** A grotesk/management pairing that reads editorial but loads fast: Space Grotesk's tight, slightly engineered display voice against Inter's invisible efficiency. Micro-labels in tracked uppercase act as plate captions between them.

### Hierarchy
- **Display** (500, clamp(2.9rem→6.1rem), 0.94, −0.055em): hero headlines only, usually on dark, often paired with outlined ghost text.
- **Headline** (400, 3rem→44px, 1.05, −0.04em): section headings via `SectionHeading`; `text-balance`.
- **Title** (400, 1.25rem–xl, 1.2, −0.03em): card titles, modal headings, nav drawer items.
- **Body** (400, 15px/sm, 1.75): descriptions at `text-[15px]/leading-7`; UI copy at `text-sm`; metadata at `text-xs`.
- **Compact** (500, 13px, 1.4): compact interactive text — small buttons, dropdown items, card links ("View details").
- **Label** (500, 11px, 0.28em, uppercase): kickers (`.kicker`), field labels, stat labels.
- **Micro** (500, 10px, 0.16–0.24em, uppercase): card metadata, location labels, badge text, overlay captions — the system's smallest voice, always tracked uppercase in stone or on-dark tints.

### Named Rules
**The Two-Press Rule.** Space Grotesk sets display, Inter sets everything else, Playwrite sets only the wordmark. No fourth font, no script accents in body content.

## Layout

Single centered column model: `.shell` caps content at **1280px** (`.shell-wide` at 1440px for grids of studios) with responsive gutters 20px → 32px (sm) → 40px (lg). Section rhythm is **py-20 / lg:py-28** (80→112px); related content groups inside a section sit 24–48px apart.

Studio grids run 1 → 2 → 3 columns with ~24–32px gaps. Content pairs commonly split 7/5 on desktop (copy left, visual right). The page stack is: dark hero → paper content sections → dark host CTA → footer. Depth is organized by alternation of paper and dark full-bleed bands, not by nesting boxes.

## Elevation & Depth

**The Flat-At-Rest Rule.** Surfaces are flat at rest; 1px `line` borders carry all structure. Shadows answer interaction only — hover lifts a card with a large, soft, low-opacity ink shadow, overlays (modals, drawers) sit on the heaviest values, and the primary button carries a constant pressed-orange glow so it reads as raised ink.

### Shadow Vocabulary
- **Accent glow** (`0 12px 30px -14px rgba(232,73,29,0.85)`): constant under primary buttons — the CTA always reads raised.
- **Card lift** (`0 24px 60px -36px rgba(23,21,18,0.45)`): studio cards on hover, paired with border darkening.
- **Overlay** (`0 20px 50px -20px` / `0 28px 70px -28px rgba(23,21,18,0.35–0.45)`): modals, dropdowns, sticky bars.
- **Micro** (`0 1px 8px rgba(23,21,18,0.28)`): small floating controls, mobile toggles.

## Shapes

Two corner languages: **everything interactive is a pill** (`rounded-full` — buttons, badges, chips, pagination, toggles) and **everything containing is a 1rem rectangle** (`rounded-2xl` cards, `rounded-xl` inputs, `rounded-3xl` full-screen modals). Borders are always 1px `line` (often at 80% opacity), doubled to `ink/25` on hover or focus. Images are clipped to their container's radius; no independent image frames. Dark sections are square-cornered full-bleed bands.

## Components

### Buttons
- **Shape:** full pill (9999px); heights 40/48/56px, text 13/14/15px medium.
- **Primary:** Press Red-Orange fill, white text, constant accent glow; hover floods a deep-orange circle from center (before-element reveal, 500ms ease-out) plus a faint top-light gradient sheen.
- **Secondary:** ink fill, ivory text, hover to dark-soft. **Outline:** transparent, ink/20 border darkening to ink/50 with a 4% ink wash. **Ghost:** ink text, 6% ink hover. **Light:** on-imagery glass (white/10, white/25 border, blur) — the only translucent surface in the system. **Danger:** ink fill that reveals accent-deep on hover.
- **Loading:** spinner + optional label swap; disabled at 50% opacity.

### Chips / Badges
- **Style:** pill, 10–11px tracked uppercase or 12px text; category badges sit on dark/80 scrim over images; rating badges on paper with line borders; filter chips sand fill → ink fill when active.
- **State:** active/filled uses ink (never accent) — orange is saved for actions.

### Cards / Containers
- **Corner Style:** 1rem (rounded-2xl).
- **Background:** paper on ivory page; ink/[0.04] washes for inset rows.
- **Shadow Strategy:** none at rest; card-lift on hover per Elevation.
- **Border:** 1px line/80, darkening to ink/25 on hover.
- **Internal Padding:** 20px (p-5); 4:3 image head with overlaid pill badges.

### Inputs / Fields
- **Style:** 48px tall, rounded-xl, paper fill, 1px line border, Inter 14px, stone placeholders at 70%.
- **Focus:** accent border + 2px accent/20 ring (global focus-visible: 2px accent outline, 3px offset).
- **Error:** accent-deep text and accent-tinted toast surfaces; disabled at 60% opacity.

### Navigation
- Sticky top bar on paper with 1px bottom line; Space Grotesk wordmark (Playwrite script mark), tracked uppercase links, pill auth CTA. Mobile: full-screen drawer with large display-type items. Active page = ink text + accent underline offset; hover = accent-deep text.

### Signature: Studio Card
The system's workhorse: 4:3 image with pill category + rating badges scrimmed on top, location micro-label (10px tracked uppercase with map-pin), Space Grotesk title linking to details, two-line clamped description in stone, amenity/price footer row ending in a bolded `/hour` figure and an arrow-up-right affordance. The whole card lifts on hover.

## Do's and Don'ts

### Do:
- **Do** use pill shapes for every interactive control and 1rem rectangles for every container.
- **Do** structure surfaces with 1px `line` borders (often at 80% opacity) instead of shadows.
- **Do** introduce dark sections with `.grain` texture for hero, host CTA, and footer; alternate paper and dark bands to create depth.
- **Do** pair every display heading with a `.kicker` micro-label; keep headings `text-balance` and body `text-pretty`.
- **Do** keep the accent on actions and active booking moments — CTAs, focus, selection, status.

### Don't:
- **Don't** use pure black or pure white; ink is `#171512`, paper is `#fffcf6`.
- **Don't** introduce a second accent hue or gradient text; orange is the only loud voice (The One Press Rule).
- **Don't** shadow a resting surface; depth comes from borders and paper/dark alternation (The Flat-At-Rest Rule).
- **Don't** apply positive letter-spacing to Space Grotesk headings — tracking stays negative (−0.03em or tighter).
- **Don't** use the Playwrite script anywhere except the wordmark (The Two-Press Rule).
