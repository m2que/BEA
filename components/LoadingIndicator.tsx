import React from 'react';
import { SearchSparkIcon, SignalIcon } from './icons';

interface LoadingIndicatorProps {
  brandCount: number;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ brandCount }) => {
  return (
    <section className="panel panel-soft loading-panel" aria-live="polite">
      <div className="loading-orb" aria-hidden="true">
        <div className="loading-spinner"></div>
      </div>
      <h2>Analyzing brand elements</h2>
      <p>
        Searching reputable sources and evaluating {brandCount} brand{brandCount === 1 ? '' : 's'}.
      </p>
      <div className="status-steps" aria-hidden="true">
        <div className="status-step">
          <SearchSparkIcon className="status-step-icon" />
          <span>Finding source material</span>
        </div>
        <div className="status-step">
          <SignalIcon className="status-step-icon" />
          <span>Scoring brand elements</span>
        </div>
      </div>
    </section>
  );
};

export default LoadingIndicator;
