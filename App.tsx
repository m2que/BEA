import React, { useCallback, useMemo, useState } from 'react';
import BrandInputForm from './components/BrandInputForm';
import BrandReport from './components/BrandReport';
import CompetitiveLandscape from './components/CompetitiveLandscape';
import ErrorDisplay from './components/ErrorDisplay';
import LoadingIndicator from './components/LoadingIndicator';
import MarketLearnHeader from './components/MarketLearnHeader';
import { AVAILABLE_MODELS, DEFAULT_MODEL, analyzeBrands } from './services/geminiService.ts';
import { buildAnalyzeBrandsPayload } from './lib/bea.ts';
import type { AnalysisResult, GeminiModelOption } from './types.ts';
import { SparkIcon } from './components/icons';

const App: React.FC = () => {
  const [requestedBrandName, setRequestedBrandName] = useState('');
  const [model, setModel] = useState<GeminiModelOption>(DEFAULT_MODEL);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [brandCount, setBrandCount] = useState(0);

  const handleSubmit = useCallback(async (brandName: string, competitors: string) => {
    const payload = buildAnalyzeBrandsPayload(brandName, competitors, model);

    setRequestedBrandName(payload.brandName);
    setBrandCount(1 + payload.competitors.length);
    setIsLoading(true);
    setError(null);
    setAnalysisResults([]);

    try {
      const results = await analyzeBrands(payload);
      setAnalysisResults(results);

      if (results.every((result) => result.inventoryData === null)) {
        setError('All brand analyses failed. Please check your inputs and try again.');
      }
    } catch (requestError) {
      console.error(requestError);
      const message = requestError instanceof Error ? requestError.message : 'An unknown error occurred.';
      setError(`An unexpected error occurred: ${message}`);
    } finally {
      setIsLoading(false);
    }
  }, [model]);

  const primaryBrandResult = useMemo(
    () => analysisResults.find((result) => result.brandName === requestedBrandName),
    [analysisResults, requestedBrandName]
  );

  const competitorErrors = analysisResults.filter((result) => result.error && result.brandName !== requestedBrandName);
  const hasResults = !isLoading && analysisResults.length > 0;

  return (
    <div className="app-shell">
      <div className="page-backdrop"></div>
      <main className="page-content">
        <MarketLearnHeader
          title="Brand Elements Analyzer"
          description="Evaluate brand elements with detailed analysis, strategic interpretation, and references. The linked brand sources, business coverage, and industry materials can support reports and business plans."
          howToTitle="Reports, case studies, and presentations"
          howToDescription="Start with one brand, see the element logic, then turn the findings into evidence for reports and business plans."
        />

        <BrandInputForm
          isLoading={isLoading}
          model={model}
          models={AVAILABLE_MODELS}
          onModelChange={setModel}
          onSubmit={handleSubmit}
        />

        {isLoading ? <LoadingIndicator brandCount={brandCount} /> : null}
        {error ? <ErrorDisplay message={error} /> : null}

        {!isLoading && !error && analysisResults.length === 0 ? (
          <section className="panel empty-state-panel">
            <div className="empty-state-icon"><SparkIcon /></div>
            <p className="eyebrow">Ready for analysis</p>
            <h2>Start with one brand, then expand to competitors when you need contrast.</h2>
            <p>
              A strong first test is a widely documented consumer brand with a clear website, visible packaging,
              and known competitors.
            </p>
          </section>
        ) : null}

        {hasResults ? (
          <div className="results-stack">
            <CompetitiveLandscape results={analysisResults} />
            <BrandReport result={primaryBrandResult} requestedBrandName={requestedBrandName} />
            {competitorErrors.map((result) => (
              <ErrorDisplay key={result.brandName} message={`Analysis failed for ${result.brandName}: ${result.error}`} />
            ))}
          </div>
        ) : null}

        <section className="panel support-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">What Is Included</p>
              <h2>Brand elements scan</h2>
            </div>
          </div>

          <div className="support-card-grid">
            <article className="support-card-item">
              <strong>Core identity</strong>
              <p>Name fit, logo direction, slogan clarity, and memorability cues.</p>
            </article>
            <article className="support-card-item">
              <strong>Sensory signals</strong>
              <p>Color systems, packaging cues, mascots, and sonic presence where available.</p>
            </article>
            <article className="support-card-item">
              <strong>Competitive readout</strong>
              <p>Side-by-side score snapshots to spot stronger and weaker brand assets fast.</p>
            </article>
          </div>

          <div className="support-reference-callout">
            <strong>Linked and verified references are included in the output.</strong>
            <p>Use the source links to trace findings back to official brand materials, business coverage, and industry references.</p>
          </div>
        </section>

        <footer className="page-footer">
          <p>
            &copy; 2026{' '}
            <a href="https://marketlearn.online">MarketLearn</a>
            . AI-assisted content &mdash; verify before implementation.
          </p>
          <p>
            Contact: <a href="mailto:marketlearn.online@gmail.com">marketlearn.online@gmail.com</a>
          </p>
        </footer>
      </main>
    </div>
  );
};

export default App;
