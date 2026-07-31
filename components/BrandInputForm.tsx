import React, { useState } from 'react';
import type { GeminiModelOption, ModelOption } from '../types.ts';
import IconBadge from './IconBadge';

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

  return (
    <div className="input-section-stack">
      <form onSubmit={handleSubmit} className="input-form-wrap">
        <div className="input-shell cbbe-style-input-shell">
          <div className="cbbe-style-input-intro">
            <div>
              <IconBadge label="Brand Elements Analyzer" className="input-badge-compact" />
              <p className="cbbe-style-input-kicker">Enter a brand, choose a model, and generate the analysis.</p>
            </div>
          </div>

          <div className="cbbe-style-input-grid">
            <label className="cbbe-style-field cbbe-style-field-main">
              <span>Brand Name</span>
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
              />
            </label>

            <label className="cbbe-style-model-field">
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
              {!inputError ? <small>{models.find((option) => option.value === model)?.description}</small> : null}
            </label>

            <button type="submit" disabled={isLoading} className="cbbe-style-submit-button">
              {isLoading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>

          <label className="support-competitor-field support-competitor-field-dark">
            <span>Competitors</span>
            <input
              type="text"
              value={competitors}
              onChange={(event) => setCompetitors(event.target.value)}
              placeholder="Optional: Pepsi, Dr Pepper"
              disabled={isLoading}
            />
            <small>Optional. Separate each competitor with a comma for a quick comparison table.</small>
          </label>

          {inputError ? <p className="cbbe-style-input-error">{inputError}</p> : null}
        </div>
      </form>

      <section className="panel support-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">What Is Included</p>
            <h2>Brand elements scan</h2>
          </div>
        </div>

        <div className="support-card-grid">
          <article className="support-card-item">
            <strong>Core identity</strong>
            <p>Name fit, logo direction, slogan clarity, and memorability cues.</p>
          </article>
          <article className="support-card-item">
            <strong>Sensory signals</strong>
            <p>Color systems, packaging cues, mascots, and sonic presence where available.</p>
          </article>
          <article className="support-card-item">
            <strong>Competitive readout</strong>
            <p>Side-by-side score snapshots to spot stronger and weaker brand assets fast.</p>
          </article>
        </div>

        <div className="support-reference-callout">
          <strong>Linked and verified references are included in the output.</strong>
          <p>Use the source links to trace findings back to official brand materials, business coverage, and industry references.</p>
        </div>
      </section>
    </div>
  );
};

export default BrandInputForm;
