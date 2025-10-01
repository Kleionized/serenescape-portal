
import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck2, PenLine, Search } from 'lucide-react';
import MoodStressorsTally from '../components/home/MoodStressorsTally';
import ActiveTodos from '../components/home/ActiveTodos';
import { ScrollArea } from '@/components/ui/scroll-area';
import PageContainer from '../components/layout/PageContainer';

const quickActions = [
  {
    to: '/thought-dump',
    label: 'Journal',
    description: 'Clear a swirl',
    Icon: PenLine
  },
  {
    to: '/root-cause',
    label: 'Reflect',
    description: 'Spot a pattern',
    Icon: Search
  },
  {
    to: '/todo',
    label: 'Focus',
    description: 'Pick one next step',
    Icon: CalendarCheck2
  }
];

const Index = () => {
  return (
    <PageContainer
      title="Your Safe Space"
      subtitle="A soft corner to notice how you’re doing."
      showSubtitle
      hideHeader
    >
      <div className="flex flex-1 flex-col gap-10">
        <section className="page-hero page-hero--expanded">
          <div className="page-hero__header">
            <span className="page-hero__eyebrow">Today</span>
            <h1 className="text-2xl font-semibold text-safespace-foreground sm:text-3xl dark:text-slate-100">
              Take a gentle checkpoint
            </h1>
            <p className="page-hero__description">
              Choose the flow that meets you where you are right now.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {quickActions.map(({ to, label, description, Icon }) => (
              <Link
                key={to}
                to={to}
                className="card-section card-section-hover group flex w-full items-center gap-3 sm:flex-col sm:items-start sm:gap-4 lg:flex-row lg:items-center"
              >
                <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-safespace-muted/50 transition group-hover:ring-safespace-primary/40 dark:bg-slate-950">
                  <Icon className="h-5 w-5 text-safespace-primary dark:text-safespace-primary/90" />
                </span>
                <span className="flex flex-col">
                  <span className="text-sm font-semibold text-safespace-foreground dark:text-slate-100">
                    {label}
                  </span>
                  <span className="text-xs text-safespace-foreground/55 dark:text-slate-300">
                    {description}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="card-surface flex flex-col px-4 pt-5 pb-7 sm:px-6 sm:pt-6 sm:pb-8 lg:px-8 lg:pt-8 lg:pb-10">
            <MoodStressorsTally />
          </div>
          <div className="card-surface flex flex-col p-0">
            <ScrollArea className="flex-1 px-4 pt-5 pb-7 sm:px-6 sm:pt-6 sm:pb-8 lg:px-8 lg:pt-8 lg:pb-10">
              <ActiveTodos />
            </ScrollArea>
          </div>
        </section>
      </div>
    </PageContainer>
  );
};

export default Index;
