import { GoogleGenAI } from '@google/genai';
import { buildBrandElementPrompt, parseInventoryResponse } from '../lib/bea.ts';
import type { AnalysisResult, AnalyzeBrandsPayload, GeminiModelOption } from '../types.ts';

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

const extractJsonBlock = (text: string) => {
  const match = text.match(/```json\n([\s\S]*?)\n```|({[\s\S]*})/);
  if (!match || (!match[1] && !match[2])) {
    throw new Error("Could not find a valid JSON object in the model response.");
  }

  return match[1] || match[2];
};

const sanitizeJsonText = (text: string) => {
  return text
    .replace(/,\s*([}\]])/g, '$1')
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'");
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { brandName, competitors } = sanitizeBrands(req.body ?? {});
  const model = isGeminiModelOption(req.body?.model) ? req.body?.model : 'gemini-2.5-flash';

  if (!brandName) {
    return res.status(400).json({ error: 'Brand name is required.' });
  }

  if (brandName.length > 300) {
    return res.status(400).json({ error: 'Brand name must be 300 characters or fewer.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing GEMINI_API_KEY environment variable.' });
  }

  const ai = new GoogleGenAI({ apiKey });
  const allBrands = [brandName, ...competitors];

  try {
    const analysisPromises = allBrands.map(async (currentBrand) => {
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
    });

    const settled = await Promise.allSettled(analysisPromises);
    const results: AnalysisResult[] = settled.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      }

      const reason = result.reason instanceof Error ? result.reason.message : String(result.reason);
      return {
        brandName: allBrands[index],
        inventoryData: null,
        error: `Failed analysis: ${reason}`
      };
    });

    return res.status(200).json(results);
  } catch (error) {
    console.error('Brand element analysis failed:', error);
    return res.status(500).json({ error: 'Failed to analyze brands.' });
  }
}
