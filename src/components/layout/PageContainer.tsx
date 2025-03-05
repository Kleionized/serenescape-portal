
import React, { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, title, subtitle }) => {
  return (
    <div className="page-container mt-20 animate-fade-in">
      <header className="mb-8">
        <h1 className="heading-lg text-safespace-foreground mb-2">{title}</h1>
        {subtitle && <p className="text-gray-500 text-lg">{subtitle}</p>}
      </header>
      <div>{children}</div>
    </div>
  );
};

export default PageContainer;
