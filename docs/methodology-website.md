# How BEA Produces a Brand Analysis

## What it analyzes

BEA generates a structured review of a brand's visible and protectable elements. In the current implementation, that includes the brand name, logo and color cues, slogan or tagline, characters or mascots, sonic assets, packaging, domains, and brand protection signals such as trademarks and patents.

It also adds industry context, source references, and notes on assumptions or gaps when the model provides them.

## What the user provides

Users submit a brand name, an optional list of competitors, and a Gemini model choice. Competitors are entered as a comma-separated list and then cleaned before analysis.

The server applies a small amount of validation:

- a brand name is required
- the brand name must be 300 characters or fewer
- the model must be `gemini-2.5-flash` or `gemini-2.5-pro`

If competitors are included, BEA runs the same process for each one alongside the main brand.

## How the prompt works

For each brand, BEA sends Gemini a fixed prompt that asks for a dashboard-ready brand element report in JSON.

The prompt tells the model to prioritize authoritative evidence over highly specific but weak evidence. It explicitly states:

> "QUALITY > SPECIFICITY - It is better to provide high-quality \"Industry Average\" data than low-quality \"Brand Specific\" data."

The prompt also tells Gemini to begin with the specific brand, but broaden to industry-level evidence when necessary:

> "If the only sources for the brand are user-generated or low quality, YOU MUST DISCARD THEM and use data from the BROADER INDUSTRY instead."

The requested JSON covers these categories:

- name
- logo and symbol
- slogan or tagline
- characters or mascots
- sonic assets
- packaging
- URLs and domains
- brand protection
- industry context
- references
- notes

It also sets source-handling rules. The model is instructed to use Google Search, place references into six predefined categories, exclude generic or irrelevant search artifacts, and keep references to a maximum of three per category.

For media assets, the prompt asks for direct logo-file URLs and, where available, a direct public audio-file URL.

## How the analysis is executed

The server sends the prompt to Google's Gemini API through `@google/genai`. The current implementation supports `gemini-2.5-flash` by default and `gemini-2.5-pro` as an alternative option.

Google Search is enabled during generation, and the request uses a low temperature setting (`0.1`) to keep outputs more constrained.

## How the response is cleaned and parsed

The app expects the model to return a single JSON object inside a fenced code block. Because model responses can still vary, the server uses several cleanup steps before parsing:

- it tries to extract either a fenced JSON block or a top-level JSON object
- it removes trailing commas that would break JSON parsing
- it converts curly quotation marks to straight quotes
- it strips outer code fences before calling `JSON.parse`

After parsing, the app normalizes several fields:

- references are limited to the six allowed categories only
- each category is capped at three references
- notes are kept only if they are plain strings
- hex colors can be expanded into RGB and CMYK values
- missing Pantone values default to `PMS (Pantone) Unknown`
- logo URLs are filtered, deduplicated with simple URL heuristics, and limited to two entries

If one brand fails during generation or parsing, that brand returns an error state while other brands in the same request can still complete.

## How the report is displayed

The main analysis view renders an element-by-element report. In the intended schema order, the sections are:

1. Name
2. Logo Symbol
3. Slogan Tagline
4. Characters Mascots
5. Sonic Assets
6. Packaging
7. URLs Domains
8. Brand Protection

Within each section, the interface can show:

- any available 0-5 scores
- a visual strength dial based on score fields
- logo images
- color details
- an audio player for sonic assets
- text details for the element
- alternate domains
- trademark and patent details

Industry context is shown at the top of the analysis view when present. References and notes are parsed and stored, but they are not rendered in `AnalysisTable.tsx`.

## What this means for interpretation

BEA is a structured AI-assisted analysis, not a fully verified research pipeline. Results can vary by run, by model, and by the sources surfaced through Google Search.

The current logic improves consistency by constraining the prompt, enforcing a schema, and cleaning model output before parsing. Even so, the app does not independently verify factual claims, confirm source quality, check whether asset URLs are still live, or validate that a categorized reference truly belongs in the category chosen by the model.

In practice, this means the analysis is best used as a fast, organized brand-element readout that may still require human review for important decisions.
