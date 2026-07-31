import type { AnalysisResult, AnalyzeBrandsPayload, GeminiModelOption } from '../types.ts';
import { AVAILABLE_MODELS, DEFAULT_MODEL } from '../lib/bea.ts';

export { AVAILABLE_MODELS, DEFAULT_MODEL };

export const analyzeBrands = async (payload: AnalyzeBrandsPayload): Promise<AnalysisResult[]> => {
  const response = await fetch('/api/bea', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null) as { error?: string } | null;
    throw new Error(errorBody?.error || 'Failed to analyze brands');
  }

  return response.json();
};

export const isGeminiModelOption = (value: unknown): value is GeminiModelOption => {
  return value === 'gemini-2.5-flash' || value === 'gemini-2.5-pro';
};
