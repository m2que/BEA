import React from 'react';

interface IconTileProps {
  children: React.ReactNode;
  className?: string;
}

const IconTile: React.FC<IconTileProps> = ({ children, className = '' }) => {
  return <div className={`icon-tile ${className}`.trim()}>{children}</div>;
};

export default IconTile;
