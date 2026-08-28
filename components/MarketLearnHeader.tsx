import React from 'react';
import { BrandElementIcon, ChartBarIcon } from './icons';
import IconTile from './IconTile';

interface MarketLearnHeaderProps {
  title: string;
  description: string;
}

const MarketLearnHeader: React.FC<MarketLearnHeaderProps> = ({
  title,
  description
}) => {
  return (
    <>
      <header className="template-guide-topbar marketlearn-topbar">
        <div className="template-guide-shell template-guide-topbar-inner marketlearn-topbar-inner">
          <a className="template-guide-marketlearn-link marketlearn-topbar-link" href="https://marketlearn.online" target="_blank" rel="noreferrer">
            <span className="template-guide-marketlearn-icon marketlearn-topbar-icon">
              <ChartBarIcon className="header-badge-icon" />
            </span>
            <span>MarketLearn</span>
          </a>
        </div>
      </header>

      <section className="template-guide-overview-card page-header">
        <div className="template-guide-overview-copy page-header-copy">
          <h1>{title}</h1>
          <p className="template-guide-lead">{description}</p>
        </div>

        <div className="page-header-aside">
          <article className="template-guide-how-card header-note-card">
            <div className="template-guide-how-header how-to-use-stack">
              <IconTile className="template-guide-how-icon header-note-icon"><BrandElementIcon /></IconTile>
              <p className="template-guide-eyebrow">How To Use It</p>
            </div>

            <div className="template-guide-instruction-copy">
              <p><strong>Primary Analysis:</strong> Enter a company or brand name to obtain an inventory of its brand elements and analysis.</p>
              <p><strong>Competitor Comparison:</strong> Optionally enter a rival brand to compare the inventory of elements side by side.</p>
              <p><strong>Deep Dive:</strong> Run a follow-up, standalone analysis to evaluate the competitor&apos;s elements.</p>
            </div>
          </article>
        </div>
      </section>
    </>
  );
};

export default MarketLearnHeader;
