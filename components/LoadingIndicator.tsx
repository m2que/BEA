import React from 'react';
interface LoadingIndicatorProps {
  brandCount: number;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ brandCount }) => {
  const [elapsedSeconds, setElapsedSeconds] = React.useState(0);

  React.useEffect(() => {
    const startTime = Date.now();
    const interval = window.setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const formattedElapsed = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
    <section className="panel panel-soft loading-panel" aria-live="polite">
      <div className="loading-orb" aria-hidden="true">
        <div className="loading-spinner"></div>
      </div>
      <h2>Analyzing...</h2>
      <p>
        Generating evidence-aware brand insights...
      </p>
      <p className="loading-elapsed">
        Elapsed time: {formattedElapsed}
      </p>
      <p>
        Be patient - analysis is running and needs a minute or so.
      </p>
    </section>
  );
};

export default LoadingIndicator;
