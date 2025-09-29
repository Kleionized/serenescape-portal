import React, { useEffect, useMemo, useState } from 'react';
import { getEntries, deleteEntry, deleteAllEntries } from '../lib/storage';
import { SavedEntry } from '../lib/types';
import { MessageSquare, Search, AlertTriangle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageContainer from '@/components/layout/PageContainer';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const SavedEntries = () => {
  const [entries, setEntries] = useState<SavedEntry[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedEntries, setSelectedEntries] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeEntry, setActiveEntry] = useState<SavedEntry | null>(null);

  const loadEntries = () => {
    const loadedEntries = getEntries();
    loadedEntries.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setEntries(loadedEntries);
  };

  useEffect(() => {
    loadEntries();
  }, []);

  useEffect(() => {
    if (activeEntry && !entries.find((entry) => entry.id === activeEntry.id)) {
      setActiveEntry(null);
    }
  }, [entries, activeEntry]);

  const toggleEditMode = () => {
    setIsEditMode((prev) => !prev);
    setSelectedEntries([]);
    setShowDeleteConfirm(false);
  };

  const toggleEntrySelection = (id: string) => {
    setSelectedEntries((prev) =>
      prev.includes(id) ? prev.filter((entryId) => entryId !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    selectedEntries.forEach((id) => deleteEntry(id));
    loadEntries();
    setSelectedEntries([]);
    setShowDeleteConfirm(false);

    if (selectedEntries.length > 0 && selectedEntries.length === entries.length) {
      setIsEditMode(false);
    }
  };

  const handleDeleteAll = () => {
    deleteAllEntries();
    loadEntries();
    setIsEditMode(false);
    setShowDeleteConfirm(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPreviewText = (entry: SavedEntry) => {
    if (entry.type === 'thought') {
      return formatDate(entry.createdAt);
    }

    const snippets = [entry.stressor, entry.worstCase, entry.resolution].filter(Boolean);
    return snippets[0] || 'Reflection';
  };

  const detailHeading = (entry: SavedEntry | null) => {
    if (!entry) return 'Entry details';
    return entry.type === 'thought' ? 'Thought entry' : 'Reflection entry';
  };

  const detailSubtitle = useMemo(() => {
    if (!activeEntry) return '';
    return `${detailHeading(activeEntry)} · ${formatDate(activeEntry.createdAt)}`;
  }, [activeEntry]);

  const entryTypeLabel = activeEntry
    ? activeEntry.type === 'reflection'
      ? 'Reflection'
      : 'Thought'
    : '';

  return (
    <PageContainer
      title="Saved Entries"
      subtitle="Your notes, ready whenever you are."
      showSubtitle
      hideHeader
    >
      <div className="flex flex-1 flex-col gap-10">
        <section className="page-hero">
          <div className="page-hero__header">
            <span className="page-hero__eyebrow">Archives</span>
            <h1 className="text-3xl font-semibold text-safespace-foreground dark:text-slate-100">
              Revisit what you’ve captured
            </h1>
            <p className="page-hero__description">
              Dip back into saved reflections or clear them out when they feel complete.
            </p>
          </div>
        </section>

        <div className="card-surface flex min-h-[27.4rem] flex-col p-6">
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-safespace-foreground/45 dark:text-slate-400">
                  stored moments
                </p>
                <p className="text-base font-semibold text-safespace-foreground dark:text-slate-100">
                  {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
                </p>
              </div>
              {entries.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleEditMode}
                    className="inline-flex items-center gap-2 rounded-full border border-safespace-muted px-5 py-2 text-sm font-semibold text-safespace-foreground/70 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-safespace-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white hover:border-safespace-primary/40 hover:text-safespace-primary dark:border-white/15 dark:text-slate-200 dark:focus-visible:ring-offset-slate-950"
                  >
                    {isEditMode ? 'Done selecting' : 'Select entries'}
                  </button>
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={selectedEntries.length === 0 && entries.length === 0}
                      className="inline-flex items-center gap-2 rounded-full bg-safespace-primary px-5 py-2 text-sm font-semibold text-safespace-primary-foreground shadow-sm transition hover:bg-safespace-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-safespace-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:bg-safespace-muted disabled:text-safespace-foreground/40 dark:focus-visible:ring-offset-slate-950"
                    >
                      {selectedEntries.length > 0 ? `Delete ${selectedEntries.length}` : 'Delete all'}
                    </button>
                  )}
                </div>
              )}
            </div>

            {showDeleteConfirm && (
              <div className="rounded-2xl border border-safespace-muted/60 bg-white/85 p-5 text-sm text-safespace-foreground/70 shadow-sm dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-200">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-safespace-primary" />
                  <div className="space-y-3">
                    <p className="font-semibold text-safespace-foreground dark:text-white">
                      {selectedEntries.length > 0
                        ? `Delete ${selectedEntries.length} entr${selectedEntries.length === 1 ? 'y' : 'ies'}?`
                        : 'Delete all entries?'}
                    </p>
                    <p>This can’t be undone.</p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="rounded-full border border-safespace-muted px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-safespace-foreground/60 transition hover:border-safespace-primary/40 hover:text-safespace-primary dark:border-white/15 dark:text-slate-200"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={selectedEntries.length > 0 ? handleDeleteSelected : handleDeleteAll}
                        className="rounded-full bg-safespace-primary px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-safespace-primary-foreground transition hover:bg-safespace-primary/90"
                      >
                        Confirm
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {entries.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-safespace-muted/60 bg-white/80 px-6 py-12 text-center text-sm text-safespace-foreground/60 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-300">
                Nothing saved yet. Once you write or reflect, it will appear here.
              </div>
            ) : (
              <ScrollArea className="max-h-[60vh] pr-4">
                <div className="space-y-3 pr-2">
                  {entries.map((entry) => {
                    const isReflection = entry.type === 'reflection';
                    const preview = getPreviewText(entry);
                    const isSelected = selectedEntries.includes(entry.id);

                    const entryClasses = cn(
                      'group relative flex w-full items-center justify-between rounded-3xl border border-safespace-muted/45 px-5 py-4 text-left shadow-sm transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-safespace-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/10 dark:bg-slate-950/70 dark:focus-visible:ring-offset-slate-950',
                      'bg-white hover:border-safespace-primary/40 dark:hover:border-safespace-primary/35',
                      isSelected && 'border-safespace-primary/50'
                    );

                    return (
                      <button
                        key={entry.id}
                        type="button"
                        onClick={() =>
                          isEditMode ? toggleEntrySelection(entry.id) : setActiveEntry(entry)
                        }
                        className={entryClasses}
                      >
                        <div className="flex flex-1 flex-col gap-1">
                          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-safespace-foreground/60 dark:text-slate-300">
                            {isReflection ? (
                              <Search className="h-4 w-4 text-safespace-primary" />
                            ) : (
                              <MessageSquare className="h-4 w-4 text-safespace-primary" />
                            )}
                            {isReflection ? 'reflection' : 'thought'}
                          </span>
                          <p className="text-sm leading-relaxed text-safespace-foreground/80 dark:text-slate-100">
                            {preview}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1 text-xs text-safespace-foreground/50 dark:text-slate-300">
                          <span>{formatDate(entry.createdAt)}</span>
                          {!isEditMode && (
                            <ChevronRight className="h-4 w-4 text-safespace-foreground/40 transition group-hover:text-safespace-primary dark:text-slate-400" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            )}

            {isEditMode && entries.length > 0 && selectedEntries.length === 0 && !showDeleteConfirm && (
              <p className="text-xs text-safespace-foreground/45 dark:text-slate-400">
                Tip: select one or more entries to enable delete, or choose “Delete all”.
              </p>
            )}
          </div>
        </div>

        <Dialog open={!!activeEntry} onOpenChange={(open) => !open && setActiveEntry(null)}>
          <DialogContent className="max-w-3xl border-none bg-transparent p-0 sm:p-2">
            <div className="card-surface flex flex-col gap-6 bg-white p-6 sm:gap-8 sm:p-8 dark:bg-slate-950">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-3">
                  {entryTypeLabel && (
                    <span className="page-hero__eyebrow">{entryTypeLabel}</span>
                  )}
                  <DialogTitle className="text-2xl font-semibold text-safespace-foreground dark:text-slate-100">
                    {detailHeading(activeEntry)}
                  </DialogTitle>
                  {detailSubtitle ? (
                    <DialogDescription className="text-sm text-safespace-foreground/60 dark:text-slate-300">
                      {detailSubtitle}
                    </DialogDescription>
                  ) : (
                    <DialogDescription className="sr-only">
                      Saved entry details
                    </DialogDescription>
                  )}
                </div>

              </div>

              <div className="space-y-4 text-sm leading-relaxed text-safespace-foreground/80 dark:text-slate-200">
                {activeEntry?.type === 'reflection' ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="card-section border-none bg-safespace-muted/40 px-5 py-4 dark:bg-white/10">
                      <p className="text-xs uppercase tracking-[0.3em] text-safespace-foreground/45 dark:text-slate-400">
                        Reflection focus
                      </p>
                      <p className="mt-2 text-sm text-safespace-foreground dark:text-slate-100">
                        {activeEntry.stressor || 'No reflection focus recorded.'}
                      </p>
                    </div>
                    <div className="card-section border-none bg-safespace-muted/40 px-5 py-4 dark:bg-white/10">
                      <p className="text-xs uppercase tracking-[0.3em] text-safespace-foreground/45 dark:text-slate-400">
                        What feels most worrying?
                      </p>
                      <p className="mt-2 text-sm text-safespace-foreground dark:text-slate-100">
                        {activeEntry.worstCase || 'No worries logged this time.'}
                      </p>
                    </div>
                    <div className="card-section border-none bg-safespace-muted/40 px-5 py-4 sm:col-span-2 dark:bg-white/10">
                      <p className="text-xs uppercase tracking-[0.3em] text-safespace-foreground/45 dark:text-slate-400">
                        What steps feel possible?
                      </p>
                      <p className="mt-2 text-sm text-safespace-foreground dark:text-slate-100">
                        {activeEntry.resolution || 'No action steps noted.'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="card-section border-none bg-safespace-muted/40 px-5 py-4 dark:bg-white/10">
                    <p className="text-xs uppercase tracking-[0.3em] text-safespace-foreground/45 dark:text-slate-400">
                      Thought entry
                    </p>
                    <p className="mt-2 whitespace-pre-line text-sm text-safespace-foreground dark:text-slate-100">
                      {activeEntry?.text || 'Empty note.'}
                    </p>
                  </div>
                )}
              </div>

              <p className="text-xs text-safespace-foreground/50 dark:text-slate-400">
                Revisit when you want to notice patterns or archive it once it feels complete.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PageContainer>
  );
};

export default SavedEntries;
