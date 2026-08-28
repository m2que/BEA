# BEA Methodology

## 1. Construct

The BEA analysis measures the brand elements the app asks Gemini to identify for a brand: name, logo/symbol, slogan/tagline, characters/mascots, sonic assets, packaging, URLs/domains, and brand protection. It also asks Gemini to identify an industry context for the brand and attach categorized references and notes.

The analysis is not based on a separate scoring framework in code. Instead, the model is instructed to fill a fixed JSON schema and assign 0-5 scores only where the schema includes score fields.

## 2. Input

The client payload is built from a single `brandName`, a comma-separated competitor string, and a selected Gemini model in `lib/bea.ts`. The competitors string is split on commas, trimmed, and empty items are removed.

On the server, `api/bea.ts` trims `brandName`, keeps only string competitors, trims them, and removes blanks. The only explicit validation limits are:

- `brandName` is required.
- `brandName` must be 300 characters or fewer.
- `model` must be either `gemini-2.5-flash` or `gemini-2.5-pro`; otherwise the server falls back to `gemini-2.5-flash`.

Each analysis request runs once for the main brand and once for each competitor in the sanitized list.

## 3. Prompt logic

The prompt sent to Gemini is a single brand-specific instruction string built by `buildBrandElementPrompt`. It starts with the role and objective:

> "You are a Brand Element Analyst. Your task is to find and analyze the core brand elements for a given brand name and create a dashboard-ready report."

> "OBJECTIVE: Return the \"Top 10%\" most authoritative insights using a \"Positive Selection\" strategy."

> "CRITICAL RULE: QUALITY > SPECIFICITY - It is better to provide high-quality \"Industry Average\" data than low-quality \"Brand Specific\" data."

The prompt then tells Gemini to search the specific brand first, but to switch to broader industry evidence if brand-specific sources are weak:

> "DECISION POINT: If the only sources for the brand are user-generated or low quality, YOU MUST DISCARD THEM and use data from the BROADER INDUSTRY instead."

For requested output, the prompt asks Gemini to populate these brand-element categories in the JSON schema:

- `name`
- `logo_symbol`
- `slogan_tagline`
- `characters_mascots`
- `sonic_assets`
- `packaging`
- `urls_domains`
- `brand_protection` (`trademarks` and `patents`)
- top-level `industry`, `references`, and `notes`

The prompt includes several hard rules:

- "You MUST use the Google Search tool."
- "You MUST populate the 'references' object in the JSON output."
- Every source must be categorized into one of six allowed buckets: `official_brand`, `government`, `industry_databases`, `news_media`, `academic_research`, `marketing_reports`.
- "STRICT LIMIT: Include a MAXIMUM of 3 references per category."
- "VERIFICATION: Copy the URL exactly as provided by the Google Search tool."
- "Do NOT include \"System\" artifacts or generic search pages."

It also adds element-specific instructions, including direct asset URLs:

- For logos, Gemini should provide direct official image-file URLs, preferably PNG or SVG, and prioritize official sites or Wikimedia Commons.
- For sonic assets, Gemini should provide a direct public audio-file URL if available.
- For applicable elements, Gemini should "Provide scores from 0-5."

Finally, the prompt requires a single JSON object matching the embedded schema, wrapped in a fenced `json` code block, with no extra explanation text.

## 4. Execution

`api/bea.ts` executes the prompt with `@google/genai` via `GoogleGenAI`. The server calls `ai.models.generateContent` using the requested model, with `temperature: 0.1` and the Google Search tool enabled via `tools: [{ googleSearch: {} }]`.

The default model is `gemini-2.5-flash`, and the UI also allows `gemini-2.5-pro`.

Response parsing is defensive in several steps:

- `extractJsonBlock` tries to pull either a fenced ```json block or any top-level `{ ... }` object from the model text.
- `sanitizeJsonText` removes trailing commas before `}` or `]` and normalizes curly quotes to straight quotes before parsing.
- `parseInventoryResponse` strips outer code fences if present, then runs `JSON.parse`.

After parsing, the server normalizes parts of the result:

- `references` are rebuilt into the six allowed categories only; invalid categories are dropped.
- Each reference item must contain string `title` and `url` fields.
- References are capped again with `.slice(0, 3)` per category, even if the model returned more.
- `notes` are kept only if they are strings in an array.
- `logo_symbol.colors` are normalized so string hex colors become objects with derived `rgb`, derived `cmyk`, and fallback `pms: "PMS (Pantone) Unknown"`.
- Existing color objects keep their fields, but missing `rgb`, `cmyk`, or `pms` are filled in where possible.
- `logo_symbol.logo_urls` are filtered to non-empty strings, deduplicated by a normalized URL key that removes protocol and some Wikimedia-style thumbnail/file suffix differences, and then limited to 2 URLs.

If parsing or generation fails for one brand, the API returns that brand with `inventoryData: null` and an error string like `Failed analysis: invalid_model_json`; other brands in the same request can still succeed.

## 5. Output structure

`components/AnalysisTable.tsx` renders the report as an "Element-by-element readout" with an optional industry pill at the top.

The brand-element cards are rendered by iterating `Object.entries(brandElements)`, so the display order follows the object property order returned in `brand_elements`. Based on the prompt schema, the intended section order is:

1. `name`
2. `logo_symbol`
3. `slogan_tagline`
4. `characters_mascots`
5. `sonic_assets`
6. `packaging`
7. `urls_domains`
8. `brand_protection`

Within each card, the component renders, when present:

- average strength dial from all numeric `*_score` fields, except `brand_protection`, which always shows `N/A`
- score chips for each `*_score`
- logo files gallery for `logo_symbol.logo_urls`
- detailed color entries for `logo_symbol.colors`
- audio player for `sonic_assets.audio_url`
- text/boolean/number fields as labeled detail blocks
- alternate domain list for `urls_domains.alternates`
- nested object blocks, such as `brand_protection.trademarks` and `brand_protection.patents`

`references` and `notes` are part of the parsed analysis object, but they are not rendered by `AnalysisTable.tsx`.

## 6. Known limitations

- The analysis depends on model output and Google Search tool behavior, so results can vary across runs.
- The prompt explicitly allows substitution of broader industry data when brand-specific sources seem low quality, so some findings may describe the industry rather than the exact brand.
- The code asks for source verification, but it does not independently verify that claims are true, that URLs resolve, or that logo/audio files are actually official.
- The JSON repair is limited to extracting a likely JSON block, removing trailing commas, and normalizing curly quotes; malformed responses can still fail to parse.
- Reference enforcement is structural, not semantic: the code checks category names, item shape, and per-category count, but does not verify that a source truly belongs in its assigned category.
- Logo URL deduplication uses string normalization heuristics and then limits output to 2 URLs, so distinct files may be collapsed or additional valid variants omitted.
- Color enrichment only derives RGB and CMYK from valid 6-digit hex codes; Pantone values are never looked up and default to `PMS (Pantone) Unknown` when absent.
- `AnalysisTable.tsx` renders whatever `brand_elements` keys are present in object order, so display consistency depends on the model returning the expected schema shape and order.
