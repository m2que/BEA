import React from 'react';

interface StrengthDialProps {
  score: number | null;
}

const StrengthDial: React.FC<StrengthDialProps> = ({ score }) => {
  if (score === null || Number.isNaN(score)) {
    return <div className="strength-fallback">N/A</div>;
  }

  const percentage = (score / 5) * 100;
  const radius = 25;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  let color = 'var(--score-weak)';
  if (score >= 4) color = 'var(--score-strong)';
  else if (score >= 2.5) color = 'var(--score-mid)';

  return (
    <div className="strength-dial" aria-label={`Average element strength ${score.toFixed(1)} out of 5`}>
      <svg viewBox="0 0 60 60" aria-hidden="true">
        <circle className="strength-dial-bg" cx="30" cy="30" r={radius} />
        <circle
          className="strength-dial-progress"
          cx="30"
          cy="30"
          r={radius}
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="strength-dial-text">{score.toFixed(1)}</span>
    </div>
  );
};

export default StrengthDial;
