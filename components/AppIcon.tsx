import React from 'react';

interface AppIconProps extends React.SVGProps<SVGSVGElement> {
  children: React.ReactNode;
  strokeWidth?: number;
}

const AppIcon: React.FC<AppIconProps> = ({
  children,
  strokeWidth = 2,
  viewBox = '0 0 24 24',
  fill = 'none',
  stroke = 'currentColor',
  strokeLinecap = 'round',
  strokeLinejoin = 'round',
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap={strokeLinecap}
      strokeLinejoin={strokeLinejoin}
      {...props}
    >
      {children}
    </svg>
  );
};

export default AppIcon;
