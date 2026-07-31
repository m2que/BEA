import React from 'react';
import type { AnalysisResult } from '../types.ts';
import { LayersIcon, SignalIcon } from './icons';

interface CompetitiveLandscapeProps {
  results: AnalysisResult[];
}

const getElementAverageScore = (element: unknown): number | null => {
  if (!element || typeof element !== 'object') return null;

  const scores = Object.entries(element)
    .filter(([key, value]) => key.endsWith('_score') && typeof value === 'number')
    .map(([, value]) => value as number);

  if (scores.length === 0) return null;
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
};

const elementKeys = ['name', 'logo_symbol', 'slogan_tagline', 'characters_mascots', 'sonic_assets', 'packaging', 'urls_domains'];

const formatElementLabel = (key: string) => key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

const CompetitiveLandscape: React.FC<CompetitiveLandscapeProps> = ({ results }) => {
  const successfulResults = results.filter((result) => result.inventoryData);
  if (successfulResults.length < 2) return null;

   const overviewRows = successfulResults.map((result) => {
    const entries = elementKeys
      .map((key) => getElementAverageScore(result.inventoryData?.brand_elements[key]))
      .filter((score): score is number => typeof score === 'number');

    const average = entries.length > 0 ? entries.reduce((sum, score) => sum + score, 0) / entries.length : null;
    const strongest = elementKeys
      .map((key) => ({ key, score: getElementAverageScore(result.inventoryData?.brand_elements[key]) }))
      .filter((item): item is { key: string; score: number } => typeof item.score === 'number')
      .sort((a, b) => b.score - a.score)[0];

    return {
      brandName: result.brandName,
      average,
      strongest: strongest ? formatElementLabel(strongest.key) : 'N/A'
    };
  });

  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Comparison</p>
          <h2>Competitive landscape</h2>
        </div>
        <div className="section-chip">
          <LayersIcon className="section-chip-icon" />
          <span>{successfulResults.length} brands compared</span>
        </div>
      </div>

      <div className="competitive-overview-grid">
        {overviewRows.map((item) => (
          <article key={item.brandName} className="competitive-summary-card">
            <div className="competitive-summary-topline">
              <SignalIcon className="competitive-summary-icon" />
              <span>{item.brandName}</span>
            </div>
            <strong>{item.average !== null ? `${item.average.toFixed(1)}/5 overall` : 'No score data'}</strong>
            <p>Strongest visible cue: {item.strongest}</p>
          </article>
        ))}
      </div>

      <div className="table-wrap">
        <table className="competitive-table">
          <thead>
            <tr>
              <th>Element</th>
              {successfulResults.map((result) => (
                <th key={result.brandName}>{result.brandName}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {elementKeys.map((key) => (
              <tr key={key}>
                <td>{formatElementLabel(key)}</td>
                {successfulResults.map((result) => (
                  <td key={`${result.brandName}-${key}`}>
                    {getElementAverageScore(result.inventoryData?.brand_elements[key])?.toFixed(1) || 'N/A'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default CompetitiveLandscape;
