import React from 'react';
import MarketLearnIconBase from './MarketLearnIconBase';
import { BrandElementIcon, ChartBarIcon } from './marketlearn-icons';

const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <MarketLearnIconBase strokeWidth={1.8} {...props}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M16 16L21 21" />
  </MarketLearnIconBase>
);

const TemplateGuidePage: React.FC = () => {
  return (
    <div className="template-guide-page">
      <header className="template-guide-topbar">
        <div className="template-guide-shell template-guide-topbar-inner">
          <a className="template-guide-marketlearn-link" href="https://marketlearn.online" target="_blank" rel="noreferrer">
            <span className="template-guide-marketlearn-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 20V10" />
                <path d="M18 20V4" />
                <path d="M6 20v-4" />
              </svg>
            </span>
            <span>MarketLearn</span>
          </a>
          <span className="template-guide-topbar-label">TOOL INPUT TEMPLATE</span>
        </div>
      </header>

      <main className="template-guide-shell template-guide-main">
        <section className="template-guide-overview-card">
          <div className="template-guide-overview-copy">
            <h1>Customer-Based Brand Equity (CBBE) Model (replace with tool name)</h1>
            <p className="template-guide-lead">
              Template description: use this space to explain the tool&apos;s core value, what kind of output it generates, and why that output is useful for analysis, decision-making, learning, or reporting.
            </p>
          </div>

          <div className="template-guide-how-card">
            <div className="template-guide-how-header how-to-use-stack">
              <div className="template-guide-how-icon">
                <BrandElementIcon aria-hidden="true" />
              </div>
              <p className="template-guide-eyebrow">How To Use It</p>
            </div>

            <div className="template-guide-instruction-copy">
              <p>Use this card as a plain-language instruction area for the specific tool.</p>
              <p>Use short guidance to explain what users should enter, how they should interact with the tool, and how to interpret the first layer of results.</p>
              <p>Swap the icon above for the final tool icon while keeping the same card structure and spacing.</p>
            </div>
          </div>
        </section>

        <section className="template-guide-input-card">
          <div className="template-guide-card-head">
            <div className="template-guide-card-title-wrap">
              <div className="template-guide-input-icon">
                <BrandElementIcon aria-hidden="true" />
              </div>
              <div>
              <p className="template-guide-eyebrow">CBBE (replace with tool name) Input</p>
                <h2>Input card template</h2>
              </div>
            </div>
            <p>
              Template note: place the short explainer for this tool here so future pages show what the input controls generate, what scoring/output means, and what users should expect before they analyze.
            </p>
            <p>
              Template note: swap the icon for the final tool icon while keeping the same card structure and spacing.
            </p>
          </div>

          <div className="template-guide-form-grid">
            <label className="template-guide-field template-guide-field-wide">
              <span>Brand Name</span>
              <div className="template-guide-input-wrap">
                <SearchIcon aria-hidden="true" />
                <input type="text" value="" readOnly placeholder="Enter a brand name (e.g., Nike, Apple, Coca-Cola)" />
              </div>
            </label>

            <label className="template-guide-field">
              <span>Model</span>
              <select defaultValue="cbbe">
                <option value="cbbe">CBBE Model</option>
              </select>
              <small className="template-guide-field-note">
                Optional template field for added segmentation, alternate frameworks, or additional dimensions.
              </small>
            </label>

            <div className="template-guide-action-cell">
              <button type="button">
                <ChartBarIcon aria-hidden="true" />
                <span>Analyze</span>
              </button>
            </div>
          </div>
        </section>

        <section className="template-guide-ready-card">
          <div className="template-guide-ready-icon">
            <ChartBarIcon aria-hidden="true" />
          </div>
          <p className="template-guide-card-label">Empty state / pre-results guidance</p>
          <h2>Ready to Analyze</h2>
          <p>
            Use this area to guide users before results load. Explain what they should do next, what type of output will appear, and how the first response state will help them continue.
          </p>
        </section>

        <footer className="template-guide-footer">
          <p>`© 2026 MarketLearn. AI-assisted content — verify before implementation.`</p>
          <p>
            Contact: <a href="mailto:marketlearn.online@gmail.com">marketlearn.online@gmail.com</a>
          </p>
        </footer>
      </main>
    </div>
  );
};

export default TemplateGuidePage;
