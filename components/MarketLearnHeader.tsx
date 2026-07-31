import React from 'react';
import { ChartBarIcon, LayersIcon } from './icons';
import IconTile from './IconTile';

interface MarketLearnHeaderProps {
  title: string;
  description: string;
  howToTitle: string;
  howToDescription: string;
}

const MarketLearnHeader: React.FC<MarketLearnHeaderProps> = ({
  title,
  description,
  howToTitle,
  howToDescription
}) => {
  return (
    <header className="panel page-header">
      <div className="page-header-copy">
        <div className="header-badge">
          <ChartBarIcon className="header-badge-icon" />
          <span>MarketLearn Featured Tool</span>
        </div>
        <div>
          <a href="https://marketlearn.online" className="back-link-pill">
            Back to MarketLearn
          </a>
        </div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      <div className="page-header-aside">
        <article className="header-note-card">
          <IconTile className="header-note-icon"><LayersIcon /></IconTile>
          <div>
            <span>HOW TO USE IT</span>
            <strong>{howToTitle}</strong>
            <p>{howToDescription}</p>
          </div>
        </article>
      </div>
    </header>
  );
};

export default MarketLearnHeader;
