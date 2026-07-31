export type ReferenceCategory =
  | 'official_brand'
  | 'government'
  | 'industry_databases'
  | 'news_media'
  | 'academic_research'
  | 'marketing_reports';

export interface Reference {
  title: string;
  url: string;
}

export type CategorizedReferences = Record<ReferenceCategory, Reference[]>;

export interface ScoredElement {
  [key: string]: unknown;
}

export interface BrandProtectionDetail {
  status: string;
  details: string;
}

export interface BrandProtection {
  trademarks: BrandProtectionDetail;
  patents: BrandProtectionDetail;
}

export interface BrandElements {
  name?: ScoredElement;
  logo_symbol?: ScoredElement & { logo_urls?: string[]; colors?: Array<string | Record<string, unknown>> };
  slogan_tagline?: ScoredElement;
  characters_mascots?: ScoredElement;
  sonic_assets?: ScoredElement & { audio_url?: string };
  packaging?: ScoredElement;
  urls_domains?: ScoredElement & { alternates?: string[] };
  brand_protection?: BrandProtection;
  [key: string]: unknown;
}

export interface InventoryData {
  industry?: string;
  brand_elements: BrandElements;
  notes?: string[];
  references?: CategorizedReferences;
}

export interface AnalysisResult {
  brandName: string;
  inventoryData: InventoryData | null;
  error?: string;
}

export type GeminiModelOption = 'gemini-2.5-flash' | 'gemini-2.5-pro';

export interface AnalyzeBrandsPayload {
  brandName: string;
  competitors: string[];
  model: GeminiModelOption;
}

export interface ModelOption {
  value: GeminiModelOption;
  label: string;
  description: string;
}
