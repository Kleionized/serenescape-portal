
import React from 'react';
import ThoughtInput from '../components/thought/ThoughtInput';
import PageContainer from '../components/layout/PageContainer';

const ThoughtDump = () => {
  return (
    <PageContainer
      title="Thought Dump"
      subtitle="Let whatever surfaces land here—no editing needed."
      showSubtitle
      hideHeader
    >
      <div className="flex flex-col gap-10">
        <section className="rounded-3xl border border-safespace-muted/60 bg-white/80 p-6 shadow-sm backdrop-blur sm:p-8 dark:border-white/10 dark:bg-slate-900/80">
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-safespace-foreground/45">
              Unfiltered words
            </span>
            <h1 className="text-3xl font-semibold text-safespace-foreground dark:text-slate-100">
              Empty what’s buzzing inside
            </h1>
            <p className="text-sm leading-relaxed text-safespace-foreground/60 dark:text-slate-300">
              Capture a stream-of-consciousness note, then rest. Nothing needs to be polished.
            </p>
          </div>
        </section>

        <ThoughtInput />
      </div>
    </PageContainer>
  );
};

export default ThoughtDump;
