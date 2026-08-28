import React from 'react';
import type { CategorizedReferences, ReferenceCategory } from '../types.ts';
import { DocumentIcon, ExternalLinkIcon } from './icons';

const categoryLabels: Record<ReferenceCategory, string> = {
  official_brand: 'Official Brand',
  government: 'Government',
  industry_databases: 'Industry Databases',
  news_media: 'News Media',
  academic_research: 'Academic Research',
  marketing_reports: 'Marketing Reports'
};

interface ReferencesPanelProps {
  references: CategorizedReferences;
}

const ReferencesPanel: React.FC<ReferencesPanelProps> = ({ references }) => {
  const hasReferences = Object.values(references).some((items) => Array.isArray(items) && items.length > 0);
  if (!hasReferences) return null;

  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Sources</p>
          <h2>Referenced materials</h2>
        </div>
      </div>

      <div className="reference-grid">
        {Object.entries(references).map(([category, items]) => {
          const typedItems = items as Array<{ title: string; url: string }>;
          if (typedItems.length === 0) return null;

          return (
            <div key={category} className="reference-column">
              <h3>
                <DocumentIcon className="reference-icon" />
                {categoryLabels[category as ReferenceCategory]}
              </h3>
              <ul>
                {typedItems.map((reference, index) => (
                  <li key={`${reference.url}-${index}`}>
                    <a href={reference.url} target="_blank" rel="noopener noreferrer">
                      {reference.title}
                      <ExternalLinkIcon className="reference-link-icon" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ReferencesPanel;
