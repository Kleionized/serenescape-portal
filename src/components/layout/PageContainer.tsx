
import React, { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  showSubtitle?: boolean;
}

const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  title, 
  subtitle, 
  showSubtitle = false 
}) => {
  return (
    <div className="min-h-screen bg-safespace-background animate-fade-in">
      <div className="max-w-6xl mx-auto px-6 pb-20 pt-28">
        <header className="mb-10">
          <h1 className="heading-lg text-safespace-foreground">{title}</h1>
          {showSubtitle && subtitle && <p className="text-gray-500 text-lg">{subtitle}</p>}
        </header>
        <div className="animate-slide-in">{children}</div>
      </div>
    </div>
  );
};

export default PageContainer;
