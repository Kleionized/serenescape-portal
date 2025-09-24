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
      subtitle="Name what’s present and sketch gentle next steps."
      showSubtitle
      hideHeader
    >
      <div className="flex flex-col gap-10">
        <section className="rounded-3xl border border-safespace-muted/60 bg-white/80 p-6 shadow-sm backdrop-blur sm:p-8 dark:border-white/10 dark:bg-slate-900/80">
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-safespace-foreground/45">
              Gentle investigations
            </span>
            <h1 className="text-3xl font-semibold text-safespace-foreground dark:text-slate-100">
              Notice what keeps tugging at you
            </h1>
            <p className="text-sm leading-relaxed text-safespace-foreground/60 dark:text-slate-300">
              Pick a stressor, explore the story around it, and sketch a smaller next step.
            </p>
          </div>
        </section>

        {!selectedStressor ? (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <section className="flex flex-col gap-5 rounded-3xl border border-safespace-muted/60 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/80">
              <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-safespace-foreground/70">
                <Search className="h-4 w-4 text-safespace-primary" />
                Select something to explore
              </div>
              <p className="text-sm text-safespace-foreground/60 dark:text-slate-300">
                Pick a saved stressor or add one to begin.
              </p>
              <div className="space-y-2">
                {stressors.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-safespace-muted/60 bg-white/70 px-4 py-10 text-center text-sm text-safespace-foreground/60 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-300">
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

            <aside className="flex flex-col gap-4 rounded-3xl border border-safespace-muted/60 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/80">
              <h3 className="text-sm font-semibold text-safespace-foreground/75">Add a stressor</h3>
              <p className="text-sm text-safespace-foreground/60 dark:text-slate-300">Give it a short name you’ll recognise later. You can rephrase during reflection.</p>
              <input
                type="text"
                value={newStressor}
                onChange={(e) => setNewStressor(e.target.value)}
                placeholder="e.g. feedback chat"
                className="rounded-xl border border-safespace-muted/60 px-4 py-2 text-sm focus:border-safespace-primary/40 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-100"
              />
              <button
                onClick={handleAddStressor}
                disabled={!newStressor.trim()}
                className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  !newStressor.trim()
                    ? 'bg-safespace-muted text-safespace-foreground/40'
                    : 'bg-safespace-primary text-safespace-primary-foreground hover:bg-safespace-primary/90'
                }`}
              >
                <PlusCircle className="h-4 w-4" />
                Add stressor
              </button>
            </aside>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-safespace-muted/60 bg-white/80 p-4 text-sm text-safespace-foreground/70 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-200">
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
              <label className="flex flex-col gap-3 rounded-3xl border border-safespace-muted/60 bg-white/80 p-5 text-sm text-safespace-foreground/70 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-200">
                <span className="text-sm font-semibold text-safespace-foreground dark:text-slate-100">
                  What feels most worrying?
                </span>
                <textarea
                  value={worstCase}
                  onChange={(e) => setWorstCase(e.target.value)}
                  placeholder="Write the story your mind is telling without judgement."
                  className="min-h-[180px] resize-none rounded-xl border border-safespace-muted/60 px-3 py-2 text-sm text-safespace-foreground placeholder:text-safespace-foreground/40 focus:border-safespace-primary/40 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-100 dark:placeholder:text-slate-400"
                />
              </label>

              <label className="flex flex-col gap-3 rounded-3xl border border-safespace-muted/60 bg-white/80 p-5 text-sm text-safespace-foreground/70 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-200">
                <span className="text-sm font-semibold text-safespace-foreground dark:text-slate-100">
                  What gentle steps feel possible?
                </span>
                <textarea
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  placeholder="List small next steps or supports to lean on."
                  className="min-h-[180px] resize-none rounded-xl border border-safespace-muted/60 px-3 py-2 text-sm text-safespace-foreground placeholder:text-safespace-foreground/40 focus:border-safespace-primary/40 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-100 dark:placeholder:text-slate-400"
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
