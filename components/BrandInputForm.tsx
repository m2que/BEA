import React, { useState } from 'react';
import type { GeminiModelOption, ModelOption } from '../types.ts';
import IconBadge from './IconBadge';
import { ChartBarIcon } from './icons';

interface BrandInputFormProps {
  isLoading: boolean;
  model: GeminiModelOption;
  models: ModelOption[];
  onModelChange: (model: GeminiModelOption) => void;
  onSubmit: (brandName: string, competitors: string) => void;
}

const BrandInputForm: React.FC<BrandInputFormProps> = ({ isLoading, model, models, onModelChange, onSubmit }) => {
  const [brandName, setBrandName] = useState('');
  const [competitors, setCompetitors] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedBrandName = brandName.trim();
    if (!trimmedBrandName) {
      setInputError('Please enter a brand name.');
      return;
    }

    if (trimmedBrandName.length > 200) {
      setInputError('Brand name must be 200 characters or fewer.');
      return;
    }

    setInputError(null);
    onSubmit(trimmedBrandName, competitors);
  };

  const preventEnterSubmit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  return (
    <div className="input-section-stack">
      <form onSubmit={handleSubmit} className="input-form-wrap">
        <div className="template-guide-input-card input-shell cbbe-style-input-shell">
          <div className="template-guide-card-head cbbe-style-input-intro">
            <div className="template-guide-card-title-wrap">
              <IconBadge label="Brand Elements Analyzer Input" className="input-badge-compact" />
            </div>
            <p className="cbbe-style-input-kicker">Enter a brand, choose a model, and generate the analysis.</p>
          </div>

          <div className="template-guide-form-grid cbbe-style-input-grid">
            <label className="template-guide-field template-guide-field-wide cbbe-style-field cbbe-style-field-main">
              <span>Brand Name</span>
              <div className="template-guide-input-wrap">
                <input
                  type="text"
                  value={brandName}
                  onChange={(event) => {
                    setBrandName(event.target.value);
                    setInputError(null);
                  }}
                  placeholder="Enter a brand name (e.g., Nike, Apple, Coca-Cola)"
                  maxLength={200}
                  disabled={isLoading}
                  onKeyDown={preventEnterSubmit}
                />
              </div>
            </label>

            <label className="template-guide-field cbbe-style-model-field">
              <span>Model</span>
              <select
                value={model}
                onChange={(event) => onModelChange(event.target.value as GeminiModelOption)}
                disabled={isLoading}
              >
                {models.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {!inputError ? <small className="template-guide-field-note">{models.find((option) => option.value === model)?.description}</small> : null}
            </label>

            <div className="template-guide-action-cell">
              <button type="submit" disabled={isLoading} className="cbbe-style-submit-button">
                <ChartBarIcon aria-hidden="true" />
                {isLoading ? 'Analyzing...' : 'Analyze'}
              </button>
            </div>
          </div>

          <label className="template-guide-field support-competitor-field support-competitor-field-dark">
            <span>Competitors</span>
            <div className="template-guide-input-wrap">
              <input
                type="text"
                value={competitors}
                onChange={(event) => setCompetitors(event.target.value)}
                onKeyDown={preventEnterSubmit}
                placeholder="Optional: Pepsi, Dr Pepper"
                disabled={isLoading}
              />
            </div>
            <small className="template-guide-field-note">Optional. Separate each competitor with a comma for a quick comparison table.</small>
          </label>

          {inputError ? <p className="cbbe-style-input-error">{inputError}</p> : null}
        </div>
      </form>

    </div>
  );
};

export default BrandInputForm;
