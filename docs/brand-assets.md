# BEA Brand Assets

This file lists the current reusable visual assets for BEA.

## Colors

Defined in `index.html` under `:root`.

- `--bg-cream: #f6f0e5`
- `--bg-sand: #eadcc5`
- `--bg-panel: rgba(255, 250, 242, 0.88)`
- `--bg-panel-strong: rgba(255, 248, 237, 0.96)`
- `--ink: #1f2a24`
- `--muted: #5d685f`
- `--border: rgba(82, 68, 48, 0.16)`
- `--accent: #0f766e`
- `--accent-strong: #115e59`
- `--accent-warm: #c98b2e`
- `--error: #b42318`
- `--score-strong: #1f8a70`
- `--score-mid: #d08b2d`
- `--score-weak: #cb4b3f`

## Typography

Loaded in `index.html`.

- Heading serif: `Fraunces`
- Body sans-serif: `Manrope`

## Icons

Defined in `components/icons.tsx`.

Shared icon system:

- `components/AppIcon.tsx`
  - standard SVG wrapper for consistent viewBox, stroke, and line settings
- `components/IconTile.tsx`
  - standard square icon container for consistent size, padding, radius, and alignment
- `index.html`
  - icon tokens and shared rendering rules

- `ChartBarIcon`
  - use for the MarketLearn featured-tool badge
- `LayersIcon`
  - use as the BEA product icon
  - current use: how-to card and green input card badge
- `CompassIcon`
- `SearchSparkIcon`
- `SwatchIcon`
- `DocumentIcon`
- `SignalIcon`
- `AlertTriangleIcon`
- `ExternalLinkIcon`
- `SparkIcon`

## Current Icon Usage

- `App.tsx`
  - `ChartBarIcon` for `MarketLearn Featured Tool`
  - `LayersIcon` for the BEA how-to card
- `components/BrandInputForm.tsx`
  - `LayersIcon` in the dark green input card badge
- other icons are used in supporting analysis, notes, loading, and references views

## Visual Logic

- MarketLearn badge icon should match the CBBE-style badge treatment
- BEA product icon should stay consistent across major BEA-specific cards
- use inline SVG icons unless a dependency is explicitly approved

## Icon Template Rules

- new icons should be created in `components/icons.tsx` using `AppIcon`
- square icon containers should use `IconTile`
- avoid hand-tuning icon size per component unless there is a clear product reason
- default icon sizing should come from the shared CSS tokens in `index.html`
- keep line weights visually aligned with the existing icon system
