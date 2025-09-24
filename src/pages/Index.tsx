
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
      <div className="flex flex-col gap-10">
        <section className="rounded-3xl border border-safespace-muted/60 bg-white/80 p-6 shadow-sm backdrop-blur sm:p-8">
          <div className="flex flex-col gap-6">
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-safespace-foreground/45">
                Today
              </span>
              <h1 className="text-3xl font-semibold text-safespace-foreground dark:text-slate-100">
                Take a gentle checkpoint
              </h1>
              <p className="text-sm leading-relaxed text-safespace-foreground/60 dark:text-slate-300">
                Choose the flow that meets you where you are right now.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {quickActions.map(({ to, label, description, Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="group flex items-center gap-3 rounded-2xl border border-transparent bg-safespace-background/80 p-4 text-left transition hover:border-safespace-primary/30 hover:bg-white dark:bg-slate-900/70 dark:hover:bg-slate-900/90"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-safespace-muted/50 transition group-hover:ring-safespace-primary/40 dark:bg-slate-950">
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
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-3xl border border-safespace-muted/60 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/80">
            <MoodStressorsTally />
          </div>
          <div className="rounded-3xl border border-safespace-muted/60 bg-white/80 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/80">
            <ScrollArea className="h-full p-6">
              <ActiveTodos />
            </ScrollArea>
          </div>
        </section>
      </div>
    </PageContainer>
  );
};

export default Index;
