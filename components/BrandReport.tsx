import React from 'react';
import type { AnalysisResult } from '../types.ts';
import AnalysisTable from './AnalysisTable';
import ErrorDisplay from './ErrorDisplay';
import NotesPanel from './NotesPanel';
import ReferencesPanel from './ReferencesPanel';

interface BrandReportProps {
  result: AnalysisResult | undefined;
  requestedBrandName: string;
}

const BrandReport: React.FC<BrandReportProps> = ({ result, requestedBrandName }) => {
  if (!result) return null;

  if (result.error) {
    return <ErrorDisplay message={`Analysis failed for ${requestedBrandName}: ${result.error}`} />;
  }

  if (!result.inventoryData) return null;

  const { brand_elements, notes = [], references, industry } = result.inventoryData;
  const displayName = brand_elements?.name && typeof brand_elements.name === 'object' && 'value' in brand_elements.name
    ? String(brand_elements.name.value || requestedBrandName)
    : requestedBrandName;

  return (
    <div className="report-stack">
      <AnalysisTable brandElements={brand_elements} brandName={requestedBrandName} industry={industry} />
      <NotesPanel notes={notes} />
      {references ? <ReferencesPanel references={references} /> : null}
    </div>
  );
};

export default BrandReport;
