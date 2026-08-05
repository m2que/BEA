import { GoogleGenAI } from '@google/genai';
import type { AnalysisResult, AnalyzeBrandsPayload, CategorizedReferences, GeminiModelOption, InventoryData, Reference, ReferenceCategory } from '../types.ts';

type VercelRequest = {
  method?: string;
  body?: Partial<AnalyzeBrandsPayload>;
};

type VercelResponse = {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => {
    json: (body: unknown) => void;
  };
};

const VALID_CATEGORIES: ReferenceCategory[] = [
  'official_brand',
  'government',
  'industry_databases',
  'news_media',
  'academic_research',
  'marketing_reports'
];

const isGeminiModelOption = (value: unknown): value is GeminiModelOption => {
  return value === 'gemini-2.5-flash' || value === 'gemini-2.5-pro';
};

const sanitizeBrands = (payload: Partial<AnalyzeBrandsPayload>) => {
  const brandName = typeof payload.brandName === 'string' ? payload.brandName.trim() : '';
  const competitors = Array.isArray(payload.competitors)
    ? payload.competitors.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean)
    : [];

  return { brandName, competitors };
};

const buildBrandElementPrompt = (brandName: string) => `
You are a Brand Element Analyst. Your task is to find and analyze the core brand elements for a given brand name and create a dashboard-ready report.

OBJECTIVE: Return the "Top 10%" most authoritative insights using a "Positive Selection" strategy.
CRITICAL RULE: QUALITY > SPECIFICITY - It is better to provide high-quality "Industry Average" data than low-quality "Brand Specific" data.

STEP 1: CONTEXTUAL EXPANSION
If "${brandName}" is a specific brand, identify its broader industry (e.g., "The Giving Movement" -> "Sustainable Fashion").
SEARCH STRATEGY: Search for the specific brand first.
DECISION POINT: If the only sources for the brand are user-generated or low quality, YOU MUST DISCARD THEM and use data from the BROADER INDUSTRY instead.

STEP 2: FIND BRAND ELEMENTS
1. Using the identified high-quality sources, find the primary brand elements for the brand: "${brandName}". This includes brand protection elements like trademarks and key patents.
2. IMPORTANT: For the logo, find and provide direct URLs to the real, official logo image files (e.g., high-quality PNG with transparency, or SVG). Prioritize sources from official brand sites or Wikimedia Commons to ensure the links are stable. Do not provide links to web pages or search results. Retrieve multiple variations if possible.
3. Analyze each element based on the provided JSON schema. For the sonic asset, find a direct URL to a public audio file (e.g., MP3, WAV).
4. Provide scores from 0-5 for applicable elements.

STEP 3: SOURCE SELECTION & CATEGORIZATION (STRICT LIMIT)
You MUST use the Google Search tool. You MUST populate the 'references' object in the JSON output.
You MUST categorize every source into one of the 6 allowed categories:
1. official_brand: Official Company/Brand Websites (About Us, Brand Reports, Annual Reports, News, Press Releases).
2. government: Official Government sites (.gov, Census, UN, WHO).
3. industry_databases: Major Market Databases (Statista, McKinsey, Gartner, Deloitte).
4. news_media: Tier-1 News (Reuters, Bloomberg, NYT, FT).
5. academic_research: Academic papers (.edu, Google Scholar).
6. marketing_reports: Reputable industry/trade association reports.

FILTERING RULES:
1. CHECK RELEVANCE: Do NOT include "System" artifacts or generic search pages.
2. STRICT LIMIT: Include a MAXIMUM of 3 references per category.
3. VERIFICATION: Copy the URL exactly as provided by the Google Search tool.

STEP 4: OUTPUT
Return ONLY a single JSON object matching the schema below, wrapped in a markdown code block (00json ... 00). Do not include any other text or explanation.

Schema:
{
  "industry": "Identified Industry or Brand Niche",
  "brand_elements": {
    "name": {"value":"", "meaning":"", "memorability_score":0-5, "fit_score":0-5},
    "logo_symbol": {"description":"", "colors":[{"name":"Primary brand color","hex":"#RRGGBB","rgb":"RGB(0, 0, 0)","cmyk":"CMYK(0, 0, 0, 0)"}], "distinctiveness_score":0-5, "consistency_score":0-5, "logo_urls": ["URL to official logo file (PNG/SVG)", "URL to alternate logo file"]},
    "slogan_tagline": {"value":"", "message":"", "clarity_score":0-5, "ownability_score":0-5},
    "characters_mascots": {"exist": false, "role":"", "affinity_score":0-5},
    "sonic_assets": {"exist": false, "description":"", "recall_score":0-5, "audio_url": "URL to public MP3/WAV file if available, otherwise empty string"},
    "packaging": {"visuals":"", "functional_features":"", "premium_cues": "", "cue_strength_score":0-5},
    "urls_domains": {"primary":"", "alternates":[""], "clarity_score":0-5},
    "brand_protection": {
        "trademarks": {"status": "e.g., Registered, Unregistered", "details": "Key registered trademarks."},
        "patents": {"status": "e.g., Key patents held", "details": "Description of key patented technology."}
    }
  },
  "references": {
    "official_brand": [{"title": "Source Title", "url": "https://..."}],
    "government": [{"title": "Source Title", "url": "https://..."}],
    "industry_databases": [{"title": "Source Title", "url": "https://..."}],
    "news_media": [{"title": "Source Title", "url": "https://..."}],
    "academic_research": [{"title": "Source Title", "url": "https://..."}],
    "marketing_reports": [{"title": "Source Title", "url": "https://..."}]
  },
  "notes": ["Your assumptions, sources, or any gaps you identified."]
}
`;

const extractJsonBlock = (text: string) => {
  const match = text.match(/```json\n([\s\S]*?)\n```|({[\s\S]*})/);
  if (!match || (!match[1] && !match[2])) {
    throw new Error('Could not find a valid JSON object in the model response.');
  }

  return match[1] || match[2];
};

const sanitizeJsonText = (text: string) => {
  return text
    .replace(/,\s*([}\]])/g, '$1')
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'");
};

const hexToRgb = (hex: string): string | null => {
  const normalized = hex.trim().replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return null;

  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  return `RGB(${r}, ${g}, ${b})`;
};

const rgbToCmyk = (r: number, g: number, b: number): string => {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const k = 1 - Math.max(red, green, blue);

  if (k === 1) return 'CMYK(0, 0, 0, 100)';

  const c = ((1 - red - k) / (1 - k)) * 100;
  const m = ((1 - green - k) / (1 - k)) * 100;
  const y = ((1 - blue - k) / (1 - k)) * 100;
  return `CMYK(${Math.round(c)}, ${Math.round(m)}, ${Math.round(y)}, ${Math.round(k * 100)})`;
};

const hexToCmyk = (hex: string): string | null => {
  const normalized = hex.trim().replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return null;

  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  return rgbToCmyk(r, g, b);
};

const normalizeColors = (colors: unknown): Array<string | Record<string, unknown>> => {
  if (!Array.isArray(colors)) return [];

  return colors.map((color, index) => {
    if (typeof color === 'string') {
      const rgb = hexToRgb(color);
      const cmyk = hexToCmyk(color);

      return {
        name: `Color ${index + 1}`,
        hex: color,
        rgb: rgb || 'RGB Unknown',
        cmyk: cmyk || 'CMYK Unknown',
        pms: 'PMS (Pantone) Unknown'
      };
    }

    if (!color || typeof color !== 'object') return color;

    const typedColor = color as Record<string, unknown>;
    const hex = typeof typedColor.hex === 'string' ? typedColor.hex : '';

    return {
      ...typedColor,
      rgb: typeof typedColor.rgb === 'string' ? typedColor.rgb : (hexToRgb(hex) || 'RGB Unknown'),
      cmyk: typeof typedColor.cmyk === 'string' ? typedColor.cmyk : (hexToCmyk(hex) || 'CMYK Unknown'),
      pms: typeof typedColor.pms === 'string' ? typedColor.pms : 'PMS (Pantone) Unknown'
    };
  });
};

const createEmptyReferences = (): CategorizedReferences => ({
  official_brand: [],
  government: [],
  industry_databases: [],
  news_media: [],
  academic_research: [],
  marketing_reports: []
});

const isReference = (value: unknown): value is Reference => {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as { title?: unknown; url?: unknown };
  return typeof candidate.title === 'string' && typeof candidate.url === 'string';
};

const normalizeCategory = (category: string): ReferenceCategory | null => {
  return VALID_CATEGORIES.includes(category as ReferenceCategory) ? (category as ReferenceCategory) : null;
};

const normalizeReferences = (value: unknown): CategorizedReferences => {
  const references = createEmptyReferences();

  if (!value || typeof value !== 'object') return references;

  for (const [category, items] of Object.entries(value as Record<string, unknown>)) {
    const normalizedCategory = normalizeCategory(category);
    if (!normalizedCategory || !Array.isArray(items)) continue;
    references[normalizedCategory] = items.filter(isReference).slice(0, 3);
  }

  return references;
};

const parseInventoryResponse = (jsonText: string): InventoryData => {
  let cleanedJsonText = jsonText.trim();

  if (cleanedJsonText.startsWith('```json')) {
    cleanedJsonText = cleanedJsonText.substring(7, cleanedJsonText.length - 3).trim();
  } else if (cleanedJsonText.startsWith('```')) {
    cleanedJsonText = cleanedJsonText.substring(3, cleanedJsonText.length - 3).trim();
  }

  const parsed = JSON.parse(cleanedJsonText) as InventoryData & { references?: unknown; notes?: unknown };

  return {
    industry: parsed.industry,
    brand_elements: {
      ...(parsed.brand_elements || {}),
      logo_symbol: parsed.brand_elements?.logo_symbol && typeof parsed.brand_elements.logo_symbol === 'object'
        ? {
            ...parsed.brand_elements.logo_symbol,
            colors: normalizeColors(parsed.brand_elements.logo_symbol.colors),
            logo_urls: Array.isArray(parsed.brand_elements.logo_symbol.logo_urls)
              ? Array.from(
                  new Map(
                    parsed.brand_elements.logo_symbol.logo_urls
                      .filter((url): url is string => typeof url === 'string' && url.trim().length > 0)
                      .map((url) => {
                        const normalized = url
                          .replace(/^https?:\/\//, '')
                          .replace(/\/thumb\//, '/')
                          .replace(/\/\d+px-[^/]+$/, '')
                          .replace(/\.png$/i, '')
                          .replace(/\.svg$/i, '');

                        return [normalized, url] as const;
                      })
                  ).values()
                ).slice(0, 2)
              : []
          }
        : parsed.brand_elements?.logo_symbol
    },
    notes: Array.isArray(parsed.notes) ? parsed.notes.filter((note): note is string => typeof note === 'string') : [],
    references: normalizeReferences(parsed.references)
  };
};

const getErrorCategory = (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes('GEMINI_API_KEY')) return 'missing_api_key';
  if (message.includes('JSON')) return 'invalid_model_json';
  if (message.includes('fetch') || message.includes('network')) return 'network_error';
  if (message.includes('429')) return 'rate_limited';
  if (message.includes('403') || message.includes('401')) return 'auth_error';
  return 'analysis_failed';
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { brandName, competitors } = sanitizeBrands(req.body ?? {});
  const model = isGeminiModelOption(req.body?.model) ? req.body.model : 'gemini-2.5-flash';

  if (!brandName) {
    console.error('[bea-api] invalid_request missing_brand_name');
    return res.status(400).json({ error: 'Brand name is required.' });
  }

  if (brandName.length > 300) {
    console.error('[bea-api] invalid_request brand_name_too_long', { length: brandName.length });
    return res.status(400).json({ error: 'Brand name must be 300 characters or fewer.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('[bea-api] config_error missing_gemini_api_key');
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  const ai = new GoogleGenAI({ apiKey });
  const allBrands = [brandName, ...competitors];

  try {
    const analysisPromises = allBrands.map(async (currentBrand) => {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: buildBrandElementPrompt(currentBrand),
          config: {
            tools: [{ googleSearch: {} }],
            temperature: 0.1
          }
        });

        const parsed = parseInventoryResponse(sanitizeJsonText(extractJsonBlock(response.text)));

        return {
          brandName: currentBrand,
          inventoryData: parsed
        } satisfies AnalysisResult;
      } catch (error) {
        const category = getErrorCategory(error);
        const detail = error instanceof Error ? error.message : String(error);
        console.error('[bea-api] brand_analysis_failed', {
          brand: currentBrand,
          model,
          category,
          detail
        });

        return {
          brandName: currentBrand,
          inventoryData: null,
          error: `Failed analysis: ${category}`
        } satisfies AnalysisResult;
      }
    });

    const results = await Promise.all(analysisPromises);
    return res.status(200).json(results);
  } catch (error) {
    const category = getErrorCategory(error);
    const detail = error instanceof Error ? error.message : String(error);
    console.error('[bea-api] request_failed', { model, brandCount: allBrands.length, category, detail });
    return res.status(500).json({ error: 'Failed to analyze brands.' });
  }
}
