import React, { useCallback, useMemo, useState } from 'react';
import BrandInputForm from './components/BrandInputForm';
import BrandReport from './components/BrandReport';
import CompetitiveLandscape from './components/CompetitiveLandscape';
import ErrorDisplay from './components/ErrorDisplay';
import LoadingIndicator from './components/LoadingIndicator';
import MarketLearnHeader from './components/MarketLearnHeader';
import TemplateGuidePage from './components/marketlearn/MarketLearnToolTemplate';
import { AVAILABLE_MODELS, DEFAULT_MODEL, analyzeBrands } from './services/geminiService.ts';
import { buildAnalyzeBrandsPayload } from './lib/bea.ts';
import type { AnalysisResult, GeminiModelOption } from './types.ts';
import { ChartBarIcon } from './components/marketlearn/marketlearn-icons';

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
  const previewMode = new URLSearchParams(window.location.search).get('preview');

  const handleRunNewAnalysis = useCallback(() => {
    setRequestedBrandName('');
    setError(null);
    setAnalysisResults([]);
    setBrandCount(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (previewMode === 'template') {
    return <TemplateGuidePage />;
  }

  return (
    <div className="app-shell">
      <div className="page-backdrop"></div>
      <main className="page-content">
        <MarketLearnHeader
          title="Brand Elements Analyzer"
          description="Evaluate a company’s brand elements across offensive and defensive criteria to assess how effectively they work together to build recognition, meaning, distinction, and defensibility. Each output includes links to source materials and a detailed analysis with references that may be used as evidence in reports and business plans."
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
          <section className="template-guide-ready-card empty-state-panel">
            <div className="template-guide-ready-icon empty-state-icon"><ChartBarIcon /></div>
            <p className="template-guide-card-label eyebrow">Ready to Analyze</p>
            <p>
              Start with a brand with a clear website, visible packaging, and known competitors, then expand to competitors when you need contrast.
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
            <div className="results-reset-row">
              <button type="button" className="results-reset-button" onClick={handleRunNewAnalysis}>
                <ChartBarIcon aria-hidden="true" />
                <span>Run New Analysis</span>
              </button>
            </div>
          </div>
        ) : null}

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
