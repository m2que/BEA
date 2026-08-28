import React from 'react';
import { BrandElementIcon } from './icons';
import IconTile from './IconTile';

interface IconBadgeProps {
  label: string;
  className?: string;
}

const IconBadge: React.FC<IconBadgeProps> = ({ label, className = '' }) => {
  return (
    <div className={`input-badge ${className}`.trim()}>
      <IconTile className="input-badge-tile">
        <BrandElementIcon />
      </IconTile>
      <span>{label}</span>
    </div>
  );
};

export default IconBadge;
