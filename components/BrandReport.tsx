import React from 'react';
import type { AnalysisResult } from '../types.ts';
import AnalysisTable from './AnalysisTable';
import ErrorDisplay from './ErrorDisplay';
import NotesPanel from './NotesPanel';
import ReferencesPanel from './ReferencesPanel';
import { CompassIcon, LayersIcon, SparkIcon } from './icons';

interface BrandReportProps {
  result: AnalysisResult | undefined;
  requestedBrandName: string;
}

const BrandReport: React.FC<BrandReportProps> = ({ result, requestedBrandName }) => {
  if (!result) return null;

  if (result.error) {
    return <ErrorDisplay message={`Analysis failed for ${requestedBrandName}: ${result.error}`} />;
  }

  if (!result.inventoryData) return null;

  const { brand_elements, notes = [], references, industry } = result.inventoryData;
  const displayName = brand_elements?.name && typeof brand_elements.name === 'object' && 'value' in brand_elements.name
    ? String(brand_elements.name.value || requestedBrandName)
    : requestedBrandName;
  const hasLogo = Array.isArray(brand_elements.logo_symbol?.logo_urls) && brand_elements.logo_symbol.logo_urls.length > 0;
  const hasColors = Array.isArray(brand_elements.logo_symbol?.colors) && brand_elements.logo_symbol.colors.length > 0;
  const hasSonic = typeof brand_elements.sonic_assets?.audio_url === 'string' && brand_elements.sonic_assets.audio_url.length > 0;

  return (
    <div className="report-stack">
      <section className="panel panel-intro">
        <p className="eyebrow">Primary report</p>
        <h2>{displayName}</h2>
        <p>Structured inventory of the assets shaping recognition, recall, category fit, and protection.</p>
        <div className="report-hero-grid">
          <article className="report-hero-card">
            <div className="report-hero-icon"><CompassIcon /></div>
            <div>
              <span>Industry frame</span>
              <strong>{industry || 'Not identified'}</strong>
            </div>
          </article>
          <article className="report-hero-card">
            <div className="report-hero-icon"><LayersIcon /></div>
            <div>
              <span>Visible assets found</span>
              <strong>{[hasLogo ? 'logo' : null, hasColors ? 'colors' : null, hasSonic ? 'audio' : null].filter(Boolean).join(' • ') || 'Text-only evidence'}</strong>
            </div>
          </article>
          <article className="report-hero-card">
            <div className="report-hero-icon"><SparkIcon /></div>
            <div>
              <span>Evidence pack</span>
              <strong>{notes.length} analyst note{notes.length === 1 ? '' : 's'}</strong>
            </div>
          </article>
        </div>
      </section>

      <AnalysisTable brandElements={brand_elements} brandName={requestedBrandName} industry={industry} />
      <NotesPanel notes={notes} />
      {references ? <ReferencesPanel references={references} /> : null}
    </div>
  );
};

export default BrandReport;
