
import React, { ReactNode } from 'react';

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
        className={`mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-5 pb-24 ${
          hideHeader ? 'pt-24' : 'pt-28'
        } sm:px-8 lg:px-12`}
      >
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

        <main className="flex flex-1 flex-col gap-8 text-safespace-foreground dark:text-slate-100">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PageContainer;
