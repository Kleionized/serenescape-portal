
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
      <div className="flex flex-1 flex-col gap-10">
        <section className="page-hero">
          <div className="page-hero__header">
            <span className="page-hero__eyebrow">Unfiltered words</span>
            <h1 className="text-3xl font-semibold text-safespace-foreground dark:text-slate-100">
              Empty what’s buzzing inside
            </h1>
            <p className="page-hero__description">
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
