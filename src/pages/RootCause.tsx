import React, { useState, useEffect } from 'react';
import { getStressors, addStressor, addReflectionEntry } from '../lib/storage';
import { MoodStressor } from '../lib/types';
import { Search, PlusCircle, NotebookPen, Undo2 } from 'lucide-react';
import { toast } from 'sonner';
import PageContainer from '../components/layout/PageContainer';

const RootCause = () => {
  const [stressors, setStressors] = useState<MoodStressor[]>([]);
  const [selectedStressor, setSelectedStressor] = useState<string>('');
  const [newStressor, setNewStressor] = useState<string>('');
  const [worstCase, setWorstCase] = useState<string>('');
  const [resolution, setResolution] = useState<string>('');

  useEffect(() => {
    loadStressors();
  }, []);

  const loadStressors = () => {
    const loadedStressors = getStressors();
    const unresolvedStressors = loadedStressors.filter((s) => !s.resolved);
    setStressors(unresolvedStressors);
  };

  const handleAddStressor = () => {
    if (!newStressor.trim()) return;
    addStressor(newStressor);
    loadStressors();
    setSelectedStressor(newStressor);
    setNewStressor('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStressor || !worstCase.trim() || !resolution.trim()) return;
    addReflectionEntry(selectedStressor, worstCase, resolution);
    toast.success('Your reflection has been saved');
    setWorstCase('');
    setResolution('');
    setSelectedStressor('');
  };

  return (
    <PageContainer
      title="Root Cause"
      subtitle="Name what’s present and sketch your next steps."
      showSubtitle
      hideHeader
    >
      <div className="flex flex-1 flex-col gap-10">
        <section className="page-hero">
          <div className="page-hero__header">
            <span className="page-hero__eyebrow">Pattern spotting</span>
            <h1 className="text-3xl font-semibold text-safespace-foreground dark:text-slate-100">
              Notice what keeps tugging at you
            </h1>
            <p className="page-hero__description">
              Pick a stressor, explore the story around it, and sketch a smaller next step.
            </p>
          </div>
        </section>

        {!selectedStressor ? (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <section className="card-surface flex min-h-[27.4rem] flex-col gap-5 p-6">
              <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-safespace-foreground/70">
                <Search className="h-4 w-4 text-safespace-primary" />
                Select something to explore
              </div>
              <p className="text-sm text-safespace-foreground/60 dark:text-slate-300">
                Pick a saved stressor or add one to begin.
              </p>
              <div className="flex-1 space-y-2">
                {stressors.length === 0 && (
                  <div className="flex h-full min-h-[12rem] items-center justify-center rounded-2xl border border-dashed border-safespace-muted/60 bg-white/70 px-4 text-center text-sm text-safespace-foreground/60 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-300">
                    No unresolved stressors yet. Add one to start a reflection.
                  </div>
                )}
                {stressors.map((stressor) => (
                  <button
                    key={stressor.id}
                    onClick={() => setSelectedStressor(stressor.name)}
                    className="flex w-full items-center justify-between rounded-2xl border border-safespace-muted/60 bg-white/80 px-4 py-3 text-left text-sm text-safespace-foreground/80 transition hover:border-safespace-primary/40 hover:text-safespace-primary dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-200 dark:hover:text-safespace-primary"
                  >
                    {stressor.name}
                    <span className="text-xs uppercase tracking-[0.3em] text-safespace-foreground/40">{stressor.count}</span>
                  </button>
                ))}
              </div>
            </section>

            <aside className="card-surface flex min-h-[24rem] flex-col gap-6 p-6">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-safespace-foreground/75">Add a stressor</h3>
                <p className="text-sm text-safespace-foreground/60 dark:text-slate-300">
                  Give it a short name you’ll recognise later. You can rephrase during reflection.
                </p>
              </div>

              <div className="flex-1">
                {stressors.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-safespace-muted/50 bg-white/85 px-5 py-8 text-center text-sm text-safespace-foreground/60 shadow-sm dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-300">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-safespace-accent/15 text-safespace-accent dark:bg-safespace-accent/20">
                      <PlusCircle className="h-6 w-6" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-safespace-foreground/80 dark:text-slate-100">
                        Nothing captured yet
                      </p>
                      <p className="text-xs leading-relaxed text-safespace-foreground/55 dark:text-slate-300">
                        Add the first stressor so it’s easy to spot when you want to reflect later.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-5 rounded-2xl border border-safespace-muted/40 bg-white/92 px-5 py-6 text-sm text-safespace-foreground/70 shadow-sm dark:border-white/10 dark:bg-slate-950/80 dark:text-slate-200">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-safespace-primary/15 text-safespace-primary dark:bg-safespace-primary/20">
                      <Search className="h-6 w-6" />
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                      {stressors.slice(0, 4).map((stressor) => (
                        <span
                          key={stressor.id}
                          className="pill-tag bg-safespace-muted/60 px-3 py-1 text-xs text-safespace-foreground/70 dark:bg-white/10 dark:text-slate-200"
                        >
                          {stressor.name}
                        </span>
                      ))}
                      {stressors.length > 4 && (
                        <span className="pill-tag bg-safespace-muted/40 px-3 py-1 text-xs text-safespace-foreground/60 dark:bg-white/10 dark:text-slate-300">
                          +{stressors.length - 4}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-safespace-foreground/55 dark:text-slate-300">
                      Pick from the list or add a new one below.
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  value={newStressor}
                  onChange={(e) => setNewStressor(e.target.value)}
                  placeholder="e.g. feedback chat"
                  className="input-surface w-full px-4 py-2"
                />
                <button
                  onClick={handleAddStressor}
                  disabled={!newStressor.trim()}
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    !newStressor.trim()
                      ? 'bg-safespace-muted text-safespace-foreground/40'
                      : 'bg-safespace-primary text-safespace-primary-foreground hover:bg-safespace-primary/90'
                  }`}
                >
                  <PlusCircle className="h-4 w-4" />
                  Add stressor
                </button>
              </div>
            </aside>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div className="card-section flex flex-wrap items-center justify-between gap-3 text-sm text-safespace-foreground/70 dark:text-slate-200">
              <div className="inline-flex items-center gap-2 font-semibold text-safespace-foreground dark:text-slate-100">
                <NotebookPen className="h-4 w-4 text-safespace-primary" />
                Reflecting on <span className="text-safespace-primary">{selectedStressor}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStressor('')}
                className="inline-flex items-center gap-2 text-xs font-semibold text-safespace-foreground/60 transition hover:text-safespace-primary dark:text-slate-300"
              >
                <Undo2 className="h-4 w-4" />
                choose different
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <label className="card-surface flex min-h-[22rem] flex-col gap-3 p-5 text-sm text-safespace-foreground/70 dark:text-slate-200">
                <span className="text-sm font-semibold text-safespace-foreground dark:text-slate-100">
                  What feels most worrying?
                </span>
                <textarea
                  value={worstCase}
                  onChange={(e) => setWorstCase(e.target.value)}
                  placeholder="Write the story your mind is telling without judgement."
                  className="my-3 flex-1 min-h-[22rem] resize-none rounded-2xl border border-safespace-muted/60 bg-white/85 px-3 py-2 text-sm leading-relaxed text-safespace-foreground placeholder:text-safespace-foreground/45 focus:border-safespace-primary/40 focus:outline-none dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-100 dark:placeholder:text-slate-400"
                />
              </label>

              <label className="card-surface flex min-h-[22rem] flex-col gap-3 p-5 text-sm text-safespace-foreground/70 dark:text-slate-200">
                <span className="text-sm font-semibold text-safespace-foreground dark:text-slate-100">
                  What steps feel possible?
                </span>
                <textarea
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  placeholder="List small next steps or supports to lean on."
                  className="my-2 flex-1 min-h-[14rem] resize-none rounded-2xl border border-safespace-muted/60 bg-white/85 px-3 py-2 text-sm leading-relaxed text-safespace-foreground placeholder:text-safespace-foreground/45 focus:border-safespace-primary/40 focus:outline-none dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-100 dark:placeholder:text-slate-400"
                />
              </label>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!worstCase.trim() || !resolution.trim()}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition ${
                  !worstCase.trim() || !resolution.trim()
                    ? 'bg-safespace-muted text-safespace-foreground/40'
                    : 'bg-safespace-primary text-safespace-primary-foreground hover:bg-safespace-primary/90'
                }`}
              >
                Save reflection
              </button>
            </div>
          </form>
        )}
      </div>
    </PageContainer>
  );
};

export default RootCause;
