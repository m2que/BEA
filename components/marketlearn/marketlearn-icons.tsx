import React from 'react';
import MarketLearnIconBase from './MarketLearnIconBase';

export const CompassIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <MarketLearnIconBase strokeWidth={1.8} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M14.9 9.1l-1.8 5.8-5.8 1.8 1.8-5.8 5.8-1.8z" />
    <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" strokeWidth={0} />
  </MarketLearnIconBase>
);

export const LayersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <MarketLearnIconBase strokeWidth={2} {...props}>
    <path d="M12 2.75l9.75 4.9L12 12.55 2.25 7.65 12 2.75z" />
    <path d="M2.25 11.6L12 16.5l9.75-4.9" />
    <path d="M2.25 15.55L12 20.45l9.75-4.9" />
  </MarketLearnIconBase>
);

export const SearchSparkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <MarketLearnIconBase strokeWidth={1.8} {...props}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="M15.5 15.5L21 21" />
    <path d="M18 4v3" />
    <path d="M16.5 5.5h3" />
  </MarketLearnIconBase>
);

export const SwatchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <MarketLearnIconBase strokeWidth={1.8} {...props}>
    <path d="M7 4h7.5a3.5 3.5 0 0 1 0 7H12l-5.5 8H3.5L9 11" />
    <path d="M14 4l6 6" />
    <path d="M16.5 13.5a2.5 2.5 0 1 1 0 5 2 2 0 0 0 0-4 1 1 0 0 1 0-2z" />
  </MarketLearnIconBase>
);

export const DocumentIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <MarketLearnIconBase strokeWidth={1.8} {...props}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5" />
    <path d="M9 13h6" />
    <path d="M9 17h4" />
  </MarketLearnIconBase>
);

export const SignalIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <MarketLearnIconBase strokeWidth={1.8} {...props}>
    <path d="M4 18h2" />
    <path d="M8 14h2" />
    <path d="M12 10h2" />
    <path d="M16 6h2" />
    <path d="M5 18V9" />
    <path d="M9 14V7" />
    <path d="M13 10V5" />
    <path d="M17 6V3" />
  </MarketLearnIconBase>
);

export const AlertTriangleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <MarketLearnIconBase strokeWidth={1.8} {...props}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </MarketLearnIconBase>
);

export const ExternalLinkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <MarketLearnIconBase strokeWidth={1.8} {...props}>
    <path d="M14 5h5v5" />
    <path d="M10 14L19 5" />
    <path d="M19 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4" />
  </MarketLearnIconBase>
);

export const SparkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <MarketLearnIconBase strokeWidth={1.8} {...props}>
    <path d="M12 3l1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3z" />
    <path d="M19 3v3" />
    <path d="M20.5 4.5h-3" />
    <path d="M4 17v4" />
    <path d="M6 19H2" />
  </MarketLearnIconBase>
);

export const ChartBarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <MarketLearnIconBase strokeWidth={2} {...props}>
    <line x1="12" y1="20" x2="12" y2="10"></line>
    <line x1="18" y1="20" x2="18" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="16"></line>
  </MarketLearnIconBase>
);

export const BrandElementIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <MarketLearnIconBase strokeWidth={1.8} {...props}>
    <path d="M12 0.6c1.18 2.92 2.92 5.05 4.7 7.22 1.82 2.22 3.68 4.5 3.68 7.34A8 8 0 0 1 12 23a8 8 0 0 1-8-7.84c0-2.84 1.86-5.12 3.68-7.34C9.08 5.65 10.82 3.52 12 0.6Z" />
  </MarketLearnIconBase>
);
