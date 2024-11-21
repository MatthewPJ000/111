// components/GradientWrapper.tsx
import React, { ReactNode } from 'react';

interface GradientWrapperProps {
  children: ReactNode;
}

const GradientWrapper: React.FC<GradientWrapperProps> = ({ children }) => {
  return (
    <div className="relative wrapper gradient">
      {children}
    </div>
  );
};

export default GradientWrapper;
