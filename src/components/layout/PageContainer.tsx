
import React, { ReactNode } from 'react';
import NavBar from './NavBar';

interface PageContainerProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  showSubtitle?: boolean;
  hideHeader?: boolean;
}

const PageContainer: React.FC<PageContainerProps> = ({
  children,
  title,
  subtitle,
  showSubtitle = false,
  hideHeader = false
}) => {
  return (
    <div className="bg-safespace-background dark:bg-slate-950">
      <div
        className={`page-shell ${hideHeader ? 'page-shell--compact' : 'page-shell--spacious'}`}
      >
        <NavBar />

        {!hideHeader && (
          <header className="flex flex-col gap-1">
            <h1 className="heading-lg text-safespace-foreground dark:text-slate-100">{title}</h1>
            {showSubtitle && subtitle && (
              <p className="text-sm font-medium text-safespace-foreground/55 dark:text-slate-300">
                {subtitle}
              </p>
            )}
          </header>
        )}

        <main className="flex flex-1 flex-col gap-8 pt-4 text-safespace-foreground dark:text-slate-100 sm:gap-10 lg:gap-12">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PageContainer;
