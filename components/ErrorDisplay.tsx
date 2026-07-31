import React from 'react';
import { AlertTriangleIcon } from './icons';

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <section className="panel error-panel" role="alert">
      <div className="error-icon-wrap" aria-hidden="true">
        <AlertTriangleIcon className="error-icon" />
      </div>
      <p className="eyebrow">Request issue</p>
      <h2>Analysis could not complete</h2>
      <p>{message}</p>
    </section>
  );
};

export default ErrorDisplay;
