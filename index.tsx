import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// --- TYPES ---
interface Reference {
  title: string;
  url: string;
}

interface CategorizedReferences {
  official_brand: Reference[];
  government: Reference[];
  industry_databases: Reference[];
  news_media: Reference[];
  academic_research: Reference[];
  marketing_reports: Reference[];
}

interface InventoryData {
  industry?: string;
  brand_elements: {
    [key: string]: any;
  };
  notes?: string[];
  references?: CategorizedReferences;
}

interface AnalysisResult {
  brandName: string;
  inventoryData: InventoryData | null;
  error?: string;
}

// --- MASTER PROMPT ---
const MASTER_PROMPT_TEMPLATE = `
You are a Brand Element Analyst. Your task is to find and analyze the core brand elements for a given brand name and create a dashboard-ready report.

OBJECTIVE: Return the "Top 10%" most authoritative insights using a "Positive Selection" strategy.
CRITICAL RULE: QUALITY > SPECIFICITY - It is better to provide high-quality "Industry Average" data than low-quality "Brand Specific" data.

STEP 1: CONTEXTUAL EXPANSION
If "[BRAND_NAME]" is a specific brand, identify its broader industry (e.g., "The Giving Movement" -> "Sustainable Fashion").
SEARCH STRATEGY: Search for the specific brand first.
DECISION POINT: If the only sources for the brand are user-generated or low quality, YOU MUST DISCARD THEM and use data from the BROADER INDUSTRY instead.

STEP 2: FIND BRAND ELEMENTS
1. Using the identified high-quality sources, find the primary brand elements for the brand: "[BRAND_NAME]". This includes brand protection elements like trademarks and key patents.
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
Return ONLY a single JSON object matching the schema below, wrapped in a markdown code block (\`\`\`json ... \`\`\`). Do not include any other text or explanation.

Schema:
{
  "industry": "Identified Industry or Brand Niche",
  "brand_elements": {
    "name": {"value":"", "meaning":"", "memorability_score":0-5, "fit_score":0-5},
    "logo_symbol": {"description":"", "colors":["#RRGGBB"], "distinctiveness_score":0-5, "consistency_score":0-5, "logo_urls": ["URL to official logo file (PNG/SVG)", "URL to alternate logo file"]},
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

// --- HELPER COMPONENTS ---
const Loader = ({ brandCount }: { brandCount: number }) => (
  <div className="loader">
    <div className="spinner"></div>
    <p>Searching reputable sources and analyzing {brandCount} brand(s)...</p>
  </div>
);

const StrengthDial = ({ score }: { score: number | null }) => {
    if (score === null || isNaN(score)) {
        return <div className="strength-dial-text">N/A</div>;
    }

    const percentage = (score / 5) * 100;
    const radius = 25;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    let color = 'var(--strength-weak)';
    if (score >= 4) color = 'var(--strength-strong)';
    else if (score >= 2.5) color = 'var(--strength-moderate)';

    return (
        <div className="strength-dial">
            <svg>
                <circle className="strength-dial-bg" cx="30" cy="30" r={radius} />
                <circle
                    className="strength-dial-progress"
                    cx="30"
                    cy="30"
                    r={radius}
                    stroke={color}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                />
            </svg>
            <div className="strength-dial-text">{score.toFixed(1)}</div>
        </div>
    );
};

const LogoImage: React.FC<{ src: string; alt: string; brandName: string }> = ({ src, alt, brandName }) => {
  const [error, setError] = useState(false);

  // Use Google's image proxy to bypass hotlinking protection.
  const proxiedSrc = `https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&url=${encodeURIComponent(src)}`;

  if (error) {
    const googleImagesSearchUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(brandName + ' logo')}`;
    return (
        <div className="image-error">
            <span>[Could not load logo]</span>
            <a href={googleImagesSearchUrl} target="_blank" rel="noopener noreferrer">
                Find logo
            </a>
        </div>
    );
  }

  // The referrerPolicy is kept as a fallback, though the proxy is the primary fix.
  return <img src={proxiedSrc} alt={alt} className="logo-image" onError={() => setError(true)} referrerPolicy="no-referrer" />;
};

const PlayableAudio = ({ src }: { src: string }) => {
  const [error, setError] = useState(false);

  if (error) {
    return <div className="audio-error">[Audio source not playable]</div>;
  }

  return <audio controls src={src} onError={() => setError(true)} />;
};


// --- MAIN APP COMPONENT ---
const App = () => {
  const [brandName, setBrandName] = useState('');
  const [competitors, setCompetitors] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [brandCount, setBrandCount] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allBrands = [brandName, ...competitors.split(',').map(c => c.trim()).filter(Boolean)];
    setBrandCount(allBrands.length);
    setLoading(true);
    setError(null);
    setAnalysisResults([]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      const analysisPromises = allBrands.map(async (currentBrand) => {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-pro',
          contents: [{ parts: [{ text: MASTER_PROMPT_TEMPLATE.replace('[BRAND_NAME]', currentBrand) }] }],
          config: {
            tools: [{ googleSearch: {} }]
          }
        });

        const text = response.text;
        const match = text.match(/```json\n([\s\S]*?)\n```|({[\s\S]*})/);
        if (!match || (!match[1] && !match[2])) {
          throw new Error("Could not find a valid JSON object in the model's response.");
        }
        const jsonString = match[1] || match[2];
        const parsedData = JSON.parse(jsonString);

        return {
          brandName: currentBrand,
          inventoryData: parsedData,
        };
      });
      
      const results = await Promise.allSettled(analysisPromises);
      
      const processedResults: AnalysisResult[] = results.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          const reason = result.reason instanceof Error ? result.reason.message : String(result.reason);
          console.error(`Failed analysis for ${allBrands[index]}: ${reason}`);
          return {
            brandName: allBrands[index],
            inventoryData: null,
            error: `Failed analysis: ${reason}`,
          };
        }
      });

      setAnalysisResults(processedResults);
      if (processedResults.every(r => r.inventoryData === null)) {
        setError("All brand analyses failed. Please check your inputs and try again.");
      }

    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`An unexpected error occurred: ${errorMessage}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => (
    <div className="app-container">
      <h1>Brand Elements Analyzer</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="brandName">Enter a Brand Name</label>
          <input
            type="text"
            id="brandName"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            placeholder="e.g., Coca-Cola"
            required
          />
        </div>
         <div className="form-group">
          <label htmlFor="competitors">Enter Competitors (comma-separated)</label>
          <input
            type="text"
            id="competitors"
            value={competitors}
            onChange={(e) => setCompetitors(e.target.value)}
            placeholder="e.g., Pepsi, Dr Pepper"
          />
        </div>
        <div className="form-actions">
          <button type="submit" disabled={loading || !brandName}>
            {loading ? 'Analyzing...' : 'Analyze Brands'}
          </button>
        </div>
      </form>
    </div>
  );

  const getElementAverageScore = (element: any): number | null => {
    if (!element) return null;
    const scores = Object.entries(element)
      .filter(([key, value]) => key.endsWith('_score') && typeof value === 'number')
      .map(([, value]) => value as number);
    if (scores.length === 0) return null;
    const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    return avgScore;
  };


  const renderDetailedAnalysis = (brand_elements: any, brandName: string, industry?: string) => {
    const logoImageUrls = brand_elements?.logo_symbol?.logo_urls || [];

    return (
    <div className="tab-content">
      {industry && <p className="industry-tag"><strong>Industry Context:</strong> {industry}</p>}
      <table>
        <thead>
          <tr>
            <th style={{ width: '15%' }}>Strength</th>
            <th style={{ width: '25%' }}>Element</th>
            <th>Analysis</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(brand_elements).map(([key, element]: [string, any]) => (
            <tr key={key}>
              <td>
                {key !== 'brand_protection' ? 
                  <StrengthDial score={getElementAverageScore(element)} /> : 'N/A'
                }
              </td>
              <td><strong>{key.replace(/_/g, ' ')}</strong></td>
              <td>
                {key === 'logo_symbol' && logoImageUrls && logoImageUrls.length > 0 && (
                  <div className="logo-gallery">
                    {logoImageUrls.map((url, index) => (
                      <LogoImage key={index} src={url} alt={`${brandName} Logo variation ${index + 1}`} brandName={brandName} />
                    ))}
                  </div>
                )}
                {Object.entries(element).map(([prop, value]) => {
                  if (prop === 'logo_urls') return null; // Don't render the URLs as text
                   if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    return (
                      <div key={prop}>
                        <strong>{prop.replace(/_/g, ' ')}:</strong>
                        <ul>
                          {Object.entries(value).map(([subProp, subValue]) => (
                            <li key={subProp}>{subProp.replace(/_/g, ' ')}: {String(subValue)}</li>
                          ))}
                        </ul>
                      </div>
                    )
                  }
                  if (prop.endsWith('_score')) return <div key={prop}><strong>{prop.replace(/_/g, ' ')}:</strong> {String(value)}/5</div>;
                  if (prop === 'colors' && Array.isArray(value)) {
                    return (
                        <div key={prop}>
                          <strong>Colors:</strong>
                          <div className="color-swatches">
                            {value.map((colorCode, i) => (
                              <div key={i} className="color-item">
                                <span className="color-swatch" style={{ backgroundColor: colorCode }} title={colorCode}></span>
                                <code>{colorCode}</code>
                              </div>
                            ))}
                          </div>
                        </div>
                    );
                  }
                  if (prop === 'alternates' && Array.isArray(value)) {
                    return <div key={prop}><strong>Alternates:</strong> <ul>{value.map((v, i) => <li key={i}>{v}</li>)}</ul></div>;
                  }
                   if (prop === 'audio_url' && typeof value === 'string' && value) {
                    return (
                      <div key={prop}>
                        <strong>Listen:</strong>
                        <PlayableAudio src={value} />
                      </div>
                    );
                  }
                  if (prop === 'audio_url') return null; // Don't render the URL as text if it's empty
                  
                  return <div key={prop}><strong>{prop.replace(/_/g, ' ')}:</strong> {String(value)}</div>;
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )};
  
  const renderCompetitiveLandscape = (results: AnalysisResult[]) => {
    const successfulResults = results.filter(r => r.inventoryData);
    if(successfulResults.length < 2) return null;

    const elementKeys = ['name', 'logo_symbol', 'slogan_tagline', 'characters_mascots', 'sonic_assets', 'packaging', 'urls_domains'];

    return (
        <div className="app-container">
            <h2>Competitive Landscape</h2>
            <div className="tab-content">
                <table className="competitive-table">
                    <thead>
                        <tr>
                            <th>Element</th>
                            {successfulResults.map(r => <th key={r.brandName}>{r.brandName}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {elementKeys.map(key => (
                            <tr key={key}>
                                <td>{key.replace(/_/g, ' ')}</td>
                                {successfulResults.map(r => (
                                    <td key={r.brandName}>
                                        {getElementAverageScore(r.inventoryData.brand_elements[key])?.toFixed(1) || 'N/A'}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


  const renderReferences = (references: CategorizedReferences | undefined) => {
    if (!references) return null;
    
    const categories = {
        official_brand: "Official Brand",
        government: "Government",
        industry_databases: "Industry Databases",
        news_media: "News Media",
        academic_research: "Academic Research",
        marketing_reports: "Marketing Reports"
    };

    const hasRefs = Object.values(references).some(arr => arr && arr.length > 0);
    if (!hasRefs) return null;

    return (
      <div className="tab-content references-list">
        {Object.entries(references).map(([key, refs]) => {
           if (!refs || refs.length === 0) return null;
           return (
             <div key={key} className="reference-category">
               <h3>{categories[key as keyof typeof categories] || key.replace(/_/g, ' ')}</h3>
               <ul>
                 {refs.map((ref, index) => (
                   <li key={index}>
                     <a href={ref.url} target="_blank" rel="noopener noreferrer">{ref.title}</a>
                   </li>
                 ))}
               </ul>
             </div>
           );
        })}
      </div>
    );
  };

  const renderNotes = (notes: string[]) => (
    <div className="tab-content">
      <ul>
        {notes.map((note, index) => (
          <li key={index}>{note}</li>
        ))}
      </ul>
    </div>
  );

  const renderPrimaryBrandReport = () => {
    const primaryBrandResult = analysisResults.find(r => r.brandName === brandName);
    if (!primaryBrandResult) return null;

    if (primaryBrandResult.error) {
         return (
            <div className="app-container">
                <p className="error-message">Analysis failed for {brandName}: {primaryBrandResult.error}</p>
            </div>
         );
    }
    
    if (!primaryBrandResult.inventoryData) return null;

    const { inventoryData } = primaryBrandResult;
    const { brand_elements, notes, references, industry } = inventoryData;

    return (
      <div className="app-container">
        <h1>Analysis: {brand_elements?.name?.value || brandName}</h1>
        <div className="tab-content">
          <h2>Detailed Analysis</h2>
          {renderDetailedAnalysis(brand_elements, brandName, industry)}

          {references && (
            <>
              <h2>Referenced Sources</h2>
              {renderReferences(references)}
            </>
          )}

          {notes && notes.length > 0 && (
            <>
              <h2>Notes & Assumptions</h2>
              {renderNotes(notes)}
            </>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <>
      {renderForm()}
      {loading && <Loader brandCount={brandCount} />}
      {error && <p className="error-message">{error}</p>}
      {!loading && analysisResults.length > 0 && (
        <>
            {renderPrimaryBrandReport()}
            {analysisResults.map(result => result.error && result.brandName !== brandName ? 
                <div key={result.brandName} className="app-container">
                     <p className="error-message">{result.error}</p>
                </div>
                : null
            )}
            {renderCompetitiveLandscape(analysisResults)}
        </>
      )}
    </>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);