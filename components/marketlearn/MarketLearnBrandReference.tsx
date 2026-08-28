import React from 'react';
import MarketLearnIconBase from './MarketLearnIconBase';
import { CompassIcon, DocumentIcon, SparkIcon, SwatchIcon } from './marketlearn-icons';

const BrainIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <MarketLearnIconBase strokeWidth={1.8} {...props}>
    <path d="M9.25 4.5a3.25 3.25 0 0 0-3.25 3.25c0 .5.12.97.34 1.39A3.75 3.75 0 0 0 4.75 12c0 1.17.53 2.22 1.37 2.9A3.25 3.25 0 0 0 9.25 19.5H10" />
    <path d="M14.75 4.5A3.25 3.25 0 0 1 18 7.75c0 .5-.12.97-.34 1.39A3.75 3.75 0 0 1 19.25 12c0 1.17-.53 2.22-1.37 2.9a3.25 3.25 0 0 1-3.13 4.6H14" />
    <path d="M10 7.5c0-1.38.9-2.5 2-2.5s2 1.12 2 2.5" />
    <path d="M10 7.5v9" />
    <path d="M14 7.5v9" />
    <path d="M8.25 10.25c.6 0 1.13.24 1.52.63L10 11.1" />
    <path d="M15.75 10.25c-.6 0-1.13.24-1.52.63L14 11.1" />
    <path d="M8.75 14.25c.86 0 1.64.34 2.21.89L12 16.25l1.04-1.11a3.12 3.12 0 0 1 2.21-.89" />
  </MarketLearnIconBase>
);

const colorTokens = [
  {
    label: 'Foundation',
    name: 'Slate Mist',
    value: '#f8fafc',
    note: 'Primary page canvas inherited from ANMM.'
  },
  {
    label: 'Surface',
    name: 'Signal White',
    value: '#ffffff',
    note: 'Card, panel, and modular content surface.'
  },
  {
    label: 'Primary Accent',
    name: 'ANMM Indigo',
    value: '#4f46e5',
    note: 'Used by ANMM for anchor states, buttons, and key emphasis.'
  },
  {
    label: 'Secondary Accent',
    name: 'ANMM Teal',
    value: '#0d9488',
    note: 'Carries sub-brand/system support and brighter secondary emphasis.'
  },
  {
    label: 'Support Accent',
    name: 'ANMM Emerald',
    value: '#10b981',
    note: 'Used in the live app for positive supporting signals and attribute color coding.'
  },
  {
    label: 'Highlight Accent',
    name: 'ANMM Amber',
    value: '#f59e0b',
    note: 'Used in ANMM for benefit nodes and high-visibility highlight moments.'
  },
  {
    label: 'Association Accent',
    name: 'ANMM Purple',
    value: '#8b5cf6',
    note: 'Matches the live analysis color used for user imagery associations.'
  },
  {
    label: 'Association Accent',
    name: 'ANMM Red',
    value: '#ef4444',
    note: 'Matches the live analysis color used for attitude associations.'
  }
];

const icons = [
  { id: 'icon-marketlearn', name: 'MarketLearn', code: '#icon-marketlearn' },
  { id: 'icon-cbbe', name: 'CBBE Analyzer', code: '#icon-cbbe' },
  { id: 'icon-bpm', name: 'Brand Position Mapper', code: '#icon-bpm' },
  { id: 'icon-bea', name: 'Brand Elements Analyzer', code: '#icon-bea' },
  { id: 'icon-anmm', name: 'ANMM', code: '#icon-anmm', isLucide: true }
];

const guidance = [
  {
    label: 'Typography',
    title: 'Direct, academic, modern',
    copy: 'Use the existing ANMM sans system with dense weights, compact tracking, and short, high-signal headings.'
  },
  {
    label: 'Layout',
    title: 'Structured around panels',
    copy: 'Favor card stacks, bordered modules, and asymmetric hero sections instead of the older warm editorial landing-page treatment.'
  },
  {
    label: 'Icon Usage',
    title: 'Preserve source geometry',
    copy: 'Keep the original MarketLearn symbol files intact; only change container color, framing, and surrounding composition.'
  }
];

const MarketLearnBrandReference: React.FC = () => {
  return (
    <div className="brand-reference-page">
      <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }} aria-hidden="true">
        <symbol id="icon-marketlearn" viewBox="0 0 24 24">
          <path d="M12 20V10" />
          <path d="M18 20V4" />
          <path d="M6 20v-4" />
        </symbol>
        <symbol id="icon-cbbe" viewBox="0 0 24 24">
          <path d="M2.5 16.88a1 1 0 0 1-.32-1.43l9-13.02a1 1 0 0 1 1.64 0l9 13.01a1 1 0 0 1-.32 1.44l-8.51 4.86a2 2 0 0 1-1.98 0Z" />
          <path d="M12 2v20" />
        </symbol>
        <symbol id="icon-bpm" viewBox="0 0 24 24">
          <path d="M12 23V1" />
          <path d="M1 12h22" />
        </symbol>
        <symbol id="icon-bea" viewBox="0 0 24 24">
          <path d="M12 0.6c1.18 2.92 2.92 5.05 4.7 7.22 1.82 2.22 3.68 4.5 3.68 7.34A8 8 0 0 1 12 23a8 8 0 0 1-8-7.84c0-2.84 1.86-5.12 3.68-7.34C9.08 5.65 10.82 3.52 12 0.6Z" />
        </symbol>
      </svg>

      <header className="brand-reference-topbar">
        <div className="brand-reference-shell brand-reference-topbar-inner">
          <a className="brand-reference-lockup" href="/">
            <div className="brand-reference-logo">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 20V10" />
                <path d="M18 20V4" />
                <path d="M6 20v-4" />
              </svg>
            </div>
            <div>
              <p className="brand-reference-kicker">MarketLearn</p>
              <h1>Brand Assets Reference</h1>
            </div>
          </a>
          <nav className="brand-reference-nav" aria-label="Brand reference sections">
            <a href="#colors">Colors</a>
            <a href="#icons">Icons</a>
            <a href="#usage">Usage</a>
          </nav>
        </div>
      </header>

      <main className="brand-reference-shell brand-reference-main">
        <section className="brand-reference-hero">
          <div className="brand-reference-hero-copy">
            <span className="brand-reference-chip">Alternate Direction</span>
            <h2>MarketLearn, rebuilt to feel native inside ANMM.</h2>
            <p>
              This reference uses the copied MarketLearn asset content as source material, but shifts the identity into ANMM&apos;s sharper interface language: cool neutrals, indigo emphasis, dense typography, disciplined spacing, and analysis-first composition.
            </p>
            <div className="brand-reference-metrics">
              <div>
                <strong>01</strong>
                <span>Unified with ANMM surface and border system</span>
              </div>
              <div>
                <strong>02</strong>
                <span>Original icon geometry preserved without redraws</span>
              </div>
              <div>
                <strong>03</strong>
                <span>Responsive reference page for future brand work</span>
              </div>
            </div>
          </div>

          <div className="brand-reference-hero-panel">
            <div className="brand-reference-hero-card brand-reference-hero-card-strong">
              <SparkIcon className="w-5 h-5" />
              <h3>Identity direction</h3>
              <p>
                Less warm editorial landing page, more strategic learning product: crisp, credible, and visually aligned with ANMM&apos;s current interface behavior.
              </p>
            </div>
            <div className="brand-reference-hero-card">
              <CompassIcon className="w-5 h-5" />
              <h3>Source files kept intact</h3>
              <p>
                The copied references remain available in `assets copy/marketlearn-icons.svg`, `assets copy/brand.css`, and `brand-assets copy.html` for comparison and archival use.
              </p>
            </div>
          </div>
        </section>

        <section className="brand-reference-section" id="colors">
          <div className="brand-reference-section-head">
            <div>
              <p className="brand-reference-eyebrow">Color System</p>
              <h3>ANMM-led brand palette</h3>
            </div>
            <p>
              These tokens translate MarketLearn into ANMM&apos;s existing visual foundation instead of carrying over the old warm ivory landing-page styling.
            </p>
          </div>
          <div className="brand-reference-color-grid">
            {colorTokens.map((token) => (
              <article className="brand-reference-card" key={token.name}>
                <div className="brand-reference-swatch" style={{ background: token.value }} />
                <div className="brand-reference-card-body">
                  <span className="brand-reference-label">{token.label}</span>
                  <h4>{token.name}</h4>
                  <p>{token.note}</p>
                  <code>{token.value}</code>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="brand-reference-section" id="icons">
          <div className="brand-reference-section-head">
            <div>
              <p className="brand-reference-eyebrow">Icon Library</p>
              <h3>Original MarketLearn icons, reframed</h3>
            </div>
            <p>
              Icons stay structurally unchanged; only their presentation adapts to ANMM&apos;s panels, shadows, borders, and color hierarchy.
            </p>
          </div>
          <div className="brand-reference-icon-grid">
            {icons.map((icon) => (
              <article className="brand-reference-card brand-reference-icon-card" key={icon.id}>
                <div className="brand-reference-icon-stage">
                  {icon.isLucide ? (
                    <BrainIcon className="brand-reference-lucide-icon" aria-hidden="true" />
                  ) : (
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <use href={icon.code} />
                    </svg>
                  )}
                </div>
                <div className="brand-reference-card-body">
                  <span className="brand-reference-label">Asset</span>
                  <h4>{icon.name}</h4>
                  <code>{icon.code}</code>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="brand-reference-dual-grid">
          <article className="brand-reference-section brand-reference-section-tight" id="usage">
            <div className="brand-reference-section-head">
              <div>
                <p className="brand-reference-eyebrow">Usage Guidance</p>
                <h3>How the new identity behaves</h3>
              </div>
            </div>
            <div className="brand-reference-guidance-grid">
              {guidance.map((item) => (
                <div className="brand-reference-guidance-item" key={item.title}>
                  <span className="brand-reference-label">{item.label}</span>
                  <h4>{item.title}</h4>
                  <p>{item.copy}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="brand-reference-section brand-reference-section-tight">
            <div className="brand-reference-section-head">
              <div>
                <p className="brand-reference-eyebrow">Asset Locations</p>
                <h3>Files currently in the repo</h3>
              </div>
            </div>
            <div className="brand-reference-file-list">
              <div>
                <DocumentIcon className="w-4 h-4" />
                <span>`brand-assets copy.html`</span>
              </div>
              <div>
                <SwatchIcon className="w-4 h-4" />
                <span>`assets copy/brand.css`</span>
              </div>
              <div>
                <CompassIcon className="w-4 h-4" />
                <span>`assets copy/marketlearn-icons.svg`</span>
              </div>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
};

export default MarketLearnBrandReference;
