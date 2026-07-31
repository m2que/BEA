import React from 'react';
import { LogoImage, PlayableAudio } from './MediaAsset';
import StrengthDial from './StrengthDial';
import { CompassIcon, SignalIcon, SwatchIcon } from './icons';
import type { BrandElements } from '../types.ts';

interface AnalysisTableProps {
  brandElements: BrandElements;
  brandName: string;
  industry?: string;
}

const getElementAverageScore = (element: unknown): number | null => {
  if (!element || typeof element !== 'object') return null;

  const scores = Object.entries(element)
    .filter(([key, value]) => key.endsWith('_score') && typeof value === 'number')
    .map(([, value]) => value as number);

  if (scores.length === 0) return null;
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
};

const formatLabel = (value: string) => value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

const getElementIntro = (key: string) => {
  switch (key) {
    case 'name':
      return 'How the brand name communicates fit, meaning, and memorability.';
    case 'logo_symbol':
      return 'The visual mark, symbol logic, and color signals tied to recognition.';
    case 'slogan_tagline':
      return 'Short-form brand language that clarifies the promise or positioning.';
    case 'characters_mascots':
      return 'Characters or mascots that build familiarity, warmth, or distinctiveness.';
    case 'sonic_assets':
      return 'Audio cues, jingles, mnemonics, or other memory-building sound assets.';
    case 'packaging':
      return 'Packaging features and premium cues visible in the purchase environment.';
    case 'urls_domains':
      return 'Domain naming clarity and supporting URL structure around the brand.';
    case 'brand_protection':
      return 'Trademark and patent signals that help defend brand assets.';
    default:
      return 'Structured analysis for this brand element.';
  }
};

const renderScoreList = (entries: Array<[string, number]>) => {
  if (entries.length === 0) return null;

  return (
    <div className="score-chip-row">
      {entries.map(([key, value]) => (
        <span key={key} className="score-chip">
          <span>{formatLabel(key.replace(/_score$/, ''))}</span>
          <strong>{value}/5</strong>
        </span>
      ))}
    </div>
  );
};

const renderArrayList = (label: string, items: unknown[]) => {
  if (items.length === 0) return null;

  return (
    <div className="detail-block">
      <span className="detail-label">{label}</span>
      <ul className="detail-list compact-list">
        {items.map((item, index) => (
          <li key={`${String(item)}-${index}`}>{String(item)}</li>
        ))}
      </ul>
    </div>
  );
};

const renderObjectEntries = (value: Record<string, unknown>) => (
  <div className="detail-grid">
    {Object.entries(value).map(([subKey, subValue]) => (
      <div key={subKey} className="detail-block">
        <span className="detail-label">{formatLabel(subKey)}</span>
        <p>{String(subValue)}</p>
      </div>
    ))}
  </div>
);

const hexToRgb = (hex: string): string | null => {
  const normalized = hex.trim().replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return null;

  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  return `RGB(${r}, ${g}, ${b})`;
};

const hexToCmyk = (hex: string): string | null => {
  const normalized = hex.trim().replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return null;

  const r = Number.parseInt(normalized.slice(0, 2), 16) / 255;
  const g = Number.parseInt(normalized.slice(2, 4), 16) / 255;
  const b = Number.parseInt(normalized.slice(4, 6), 16) / 255;
  const k = 1 - Math.max(r, g, b);

  if (k === 1) return 'CMYK(0, 0, 0, 100)';

  const c = ((1 - r - k) / (1 - k)) * 100;
  const m = ((1 - g - k) / (1 - k)) * 100;
  const y = ((1 - b - k) / (1 - k)) * 100;
  return `CMYK(${Math.round(c)}, ${Math.round(m)}, ${Math.round(y)}, ${Math.round(k * 100)})`;
};

const renderColorEntries = (colors: Array<string | Record<string, unknown>>) => {
  if (colors.length === 0) return null;

  return (
    <div className="detail-block">
      <span className="detail-label with-icon"><SwatchIcon className="detail-inline-icon" /> Color Cues</span>
      <div className="color-swatches color-swatches-detailed">
        {colors.map((color, index) => {
          if (typeof color === 'string') {
            return (
              <div key={`${color}-${index}`} className="color-item color-item-detailed">
                <span className="color-swatch" style={{ backgroundColor: color }}></span>
                <div className="color-code-stack">
                  <strong>{color}</strong>
                  <code>HEX: {color}</code>
                  <code>RGB: {hexToRgb(color) || 'RGB Unknown'}</code>
                  <code>CMYK: {hexToCmyk(color) || 'CMYK Unknown'}</code>
                </div>
              </div>
            );
          }

          const name = typeof color.name === 'string' ? color.name : `Color ${index + 1}`;
          const hex = typeof color.hex === 'string' ? color.hex : 'Unknown';
          const rgb = typeof color.rgb === 'string' ? color.rgb : 'RGB Unknown';
          const cmyk = typeof color.cmyk === 'string' ? color.cmyk : 'CMYK Unknown';

          return (
            <div key={`${name}-${index}`} className="color-item color-item-detailed">
              <span className="color-swatch" style={{ backgroundColor: hex !== 'Unknown' ? hex : '#d6d3d1' }}></span>
              <div className="color-code-stack">
                <strong>{name}</strong>
                <code>HEX: {hex}</code>
                <code>RGB: {rgb}</code>
                <code>CMYK: {cmyk}</code>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const renderElementBody = (key: string, element: Record<string, unknown>, brandName: string) => {
  const scoreEntries = Object.entries(element).filter(([prop, value]) => prop.endsWith('_score') && typeof value === 'number') as Array<[string, number]>;

  const textEntries = Object.entries(element).filter(([prop, value]) => {
    return !prop.endsWith('_score') && prop !== 'logo_urls' && prop !== 'audio_url' && prop !== 'colors' && prop !== 'alternates'
      && (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean');
  });

  const objectEntries = Object.entries(element).filter(([prop, value]) => {
    return !prop.endsWith('_score') && prop !== 'logo_urls' && prop !== 'audio_url' && prop !== 'colors' && prop !== 'alternates'
      && typeof value === 'object' && value !== null && !Array.isArray(value);
  });

  const logoUrls = key === 'logo_symbol' && Array.isArray(element.logo_urls) ? element.logo_urls : [];
  const colors = key === 'logo_symbol' && Array.isArray(element.colors) ? element.colors : [];
  const alternates = key === 'urls_domains' && Array.isArray(element.alternates) ? element.alternates : [];
  const audioUrl = key === 'sonic_assets' && typeof element.audio_url === 'string' ? element.audio_url : '';

  return (
    <div className="element-card-body">
      {renderScoreList(scoreEntries)}

      {logoUrls.length > 0 ? (
        <div className="detail-block">
          <span className="detail-label">Logo Files</span>
          <div className="logo-gallery">
            {logoUrls.map((url, index) => (
              <LogoImage key={`${url}-${index}`} src={String(url)} alt={`${brandName} logo variation ${index + 1}`} brandName={brandName} />
            ))}
          </div>
        </div>
      ) : null}

      {colors.length > 0 ? renderColorEntries(colors as Array<string | Record<string, unknown>>) : null}

      {audioUrl ? (
        <div className="detail-block">
          <span className="detail-label with-icon"><SignalIcon className="detail-inline-icon" /> Audio Sample</span>
          <PlayableAudio src={audioUrl} />
        </div>
      ) : null}

      {textEntries.length > 0 ? (
        <div className="detail-grid">
          {textEntries.map(([prop, value]) => (
            <div key={prop} className="detail-block">
              <span className="detail-label">{formatLabel(prop)}</span>
              <p>{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}</p>
            </div>
          ))}
        </div>
      ) : null}

      {renderArrayList('Alternate Domains', alternates as unknown[])}

      {objectEntries.map(([prop, value]) => (
        <div key={prop} className="detail-block grouped-object-block">
          <span className="detail-label">{formatLabel(prop)}</span>
          {renderObjectEntries(value as Record<string, unknown>)}
        </div>
      ))}
    </div>
  );
};

const AnalysisTable: React.FC<AnalysisTableProps> = ({ brandElements, brandName, industry }) => {
  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Detailed analysis</p>
          <h2>Element-by-element readout</h2>
        </div>
        {industry ? <span className="industry-pill">Industry context: {industry}</span> : null}
      </div>

      <div className="elements-grid">
        {Object.entries(brandElements).map(([key, element]) => {
          const typedElement = typeof element === 'object' && element !== null ? element as Record<string, unknown> : {};

          return (
            <article key={key} className="element-card">
              <div className="element-card-top">
                <div>
                  <p className="element-card-kicker">{formatLabel(key)}</p>
                  <h3>{getElementIntro(key)}</h3>
                </div>
                <div className="element-score-wrap">
                  {key !== 'brand_protection' ? <StrengthDial score={getElementAverageScore(element)} /> : <div className="strength-fallback">N/A</div>}
                </div>
              </div>

              <div className="element-meta-row">
                <span className="element-meta-pill">
                  <CompassIcon className="element-meta-icon" />
                  {formatLabel(key)}
                </span>
              </div>

              {renderElementBody(key, typedElement, brandName)}
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default AnalysisTable;
