# MarketLearn BEA Template

This file is a BEA-safe reference for future MarketLearn app builds.

Purpose:
- preserve the MarketLearn-style shell and layout logic
- keep BEA as Brand Elements Analyzer
- improve accuracy for future rebuilds without copying CBBE product purpose

Do not use this template to:
- rename BEA into another framework or model
- expose API keys in frontend code
- overwrite product-specific copy without review

## Canonical Header Structure

Use this order for the top header block:

1. Featured tool badge
2. Back link to `https://marketlearn.online`
3. Product title
4. Product description paragraph
5. Right-side "How to use it" card

Target layout logic:
- two-column header
- left side holds badge, link, title, description
- right side holds one instructional card
- right card aligns to the lower edge of the left content block

## Canonical Header Copy Pattern

Left badge:
- label: `MarketLearn Featured Tool`
- icon: `ChartBarIcon`

Back link:
- label: `Back to MarketLearn`
- url: `https://marketlearn.online`

Right instructional card:
- eyebrow: uppercase `HOW TO USE IT`
- headline: short use-case grouping such as `Reports, case studies, and presentations`
- body: one sentence explaining how to start and how to use the output

## BEA Product Copy Pattern

Title:
- `Brand Elements Analyzer (BEA)`

Description should cover:
- naming
- logo direction
- color cues
- slogans/taglines
- packaging
- sonic assets
- domains
- protection signals

How-to copy should explain:
- start with one brand
- review element logic
- use findings in reports, audits, or business plans

## Component Reuse Targets

If a future MarketLearn build needs consistency, reuse or mirror these areas:

- `App.tsx`
  - overall page shell
  - header composition
  - empty state placement
- `components/BrandInputForm.tsx`
  - dark green input card structure
  - model selector placement
  - call-to-action treatment
- `index.html`
  - design tokens
  - panel styling
  - header sizing and spacing

## Layout Rules

- serif title, sans-serif body
- soft cream background with teal + warm amber accents
- rounded panels with subtle border and shadow
- one primary instructional card on the right side of the header
- form card may use the product icon in its badge
- avoid adding extra right-side cards unless the product specifically needs them

## Safety Rules

- API keys stay server-side only
- Gemini requests go through API routes such as `/api/bea`
- `_CBBE-safe-reference/` may be inspected but not edited
- product identity must remain BEA
