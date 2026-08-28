import React from 'react';
import { BrandElementIcon } from './marketlearn/marketlearn-icons';
import MarketLearnIconTile from './marketlearn/MarketLearnIconTile';

interface IconBadgeProps {
  label: string;
  className?: string;
}

const IconBadge: React.FC<IconBadgeProps> = ({ label, className = '' }) => {
  return (
    <div className={`input-badge ${className}`.trim()}>
      <MarketLearnIconTile className="input-badge-tile">
        <BrandElementIcon />
      </MarketLearnIconTile>
      <span>{label}</span>
    </div>
  );
};

export default IconBadge;
