
import React, { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-safespace-background to-safespace-muted/30 animate-fade-in">
      <div className="max-w-6xl mx-auto px-6 pb-20 pt-20">
        <header className="mb-12">
          <h1 className="heading-lg text-safespace-foreground mb-3">{title}</h1>
          {subtitle && <p className="text-gray-500 text-lg">{subtitle}</p>}
        </header>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default PageContainer;
