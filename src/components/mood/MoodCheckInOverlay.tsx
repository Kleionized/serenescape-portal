import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MoodLevel } from '../../lib/types';
import { addMoodCheckIn, getStressors } from '../../lib/storage';
import { X, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const moodOptions: Array<{
  value: MoodLevel;
  label: string;
  emoji: string;
  helper: string;
}> = [
  {
    value: 'calm',
    label: 'Calm',
    emoji: '😌',
    helper: 'Steady and grounded'
  },
  {
    value: 'slightly-stressed',
    label: 'Slightly tense',
    emoji: '😕',
    helper: 'A little buzz beneath the surface'
  },
  {
    value: 'moderately-stressed',
    label: 'Stretched thin',
    emoji: '😟',
    helper: 'Mind is juggling a few worries'
  },
  {
    value: 'very-stressed',
    label: 'On edge',
    emoji: '😫',
    helper: 'Everything feels extra loud right now'
  }
];

interface MoodCheckInOverlayProps {
  onClose: () => void;
}

const MoodCheckInOverlay: React.FC<MoodCheckInOverlayProps> = ({ onClose }) => {
  const [step, setStep] = useState<'mood' | 'stressors'>('mood');
  const [selectedMood, setSelectedMood] = useState<MoodLevel | null>(null);
  const [stressors, setStressors] = useState<string[]>([]);
  const [currentStressor, setCurrentStressor] = useState('');
  const [recentStressors, setRecentStressors] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const closeTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const allStressors = getStressors();
    const activeStressorNames = allStressors
      .filter((stressor) => !stressor.resolved)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map((stressor) => stressor.name);
    setRecentStressors(activeStressorNames);
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setIsVisible(true));
    return () => {
      window.cancelAnimationFrame(frame);
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const activeMood = selectedMood
    ? moodOptions.find((option) => option.value === selectedMood)
    : null;

  const closeWithTransition = useCallback(() => {
    setIsVisible(false);
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = window.setTimeout(onClose, 300);
  }, [onClose]);

  const handleMoodSelect = (mood: MoodLevel) => {
    setSelectedMood(mood);
    if (mood === 'calm') {
      handleSubmit(mood);
    } else {
      setStep('stressors');
    }
  };

  const handleAddStressor = () => {
    const trimmed = currentStressor.trim();
    if (!trimmed) return;

    setStressors((prev) => [...prev, trimmed]);
    setCurrentStressor('');
  };

  const handleAddRecentStressor = (stressorName: string) => {
    setStressors((prev) =>
      prev.includes(stressorName) ? prev : [...prev, stressorName]
    );
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && currentStressor.trim()) {
      event.preventDefault();
      handleAddStressor();
    }
  };

  const handleRemoveStressor = (index: number) => {
    setStressors((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (moodOverride?: MoodLevel, overrideStressors?: string[]) => {
    const mood = moodOverride ?? selectedMood;
    if (!mood) return;

    const payload = overrideStressors ?? stressors;
    addMoodCheckIn(mood, payload);

    toast({
      title: 'Check-in saved',
      description:
        mood === 'calm'
          ? 'Logged how you’re arriving right now.'
          : payload.length > 0
            ? 'Captured what’s feeling loud so you can move gently.'
            : 'Noted your mood—come back if you want to capture details.'
    });

    window.dispatchEvent(new Event('mood-checkin-recorded'));
    closeWithTransition();
  };

  const handleSkip = () => {
    handleSubmit(undefined, []);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-stretch justify-center bg-safespace-background/85 backdrop-blur-xl transition-opacity duration-300 ease-out dark:bg-slate-950/90 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="safe-area-block--tight mx-auto flex w-full max-w-3xl flex-col justify-center gap-4 px-4 sm:gap-6 sm:px-6">
        <div
          className={`card-surface relative w-full overflow-hidden rounded-[2rem] border border-safespace-muted/50 bg-white/95 p-5 shadow-2xl transition-all duration-300 ease-out sm:p-7 lg:p-8 dark:border-white/10 dark:bg-slate-950/95 ${
            isVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-3 scale-[0.98] opacity-0'
          }`}
        >
          <button
            onClick={closeWithTransition}
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-2xl border border-transparent text-safespace-foreground/60 transition hover:border-safespace-muted/60 hover:text-safespace-foreground dark:text-slate-300"
            aria-label="Close mood check-in"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="max-h-[min(90dvh,38rem)] space-y-6 overflow-y-auto pr-0 sm:pr-1">
            <div className="space-y-2">
              <span className="page-hero__eyebrow">Quick check-in</span>
              <h2 className="text-2xl font-semibold text-safespace-foreground dark:text-slate-100">
                {step === 'mood' ? 'How are you arriving?' : 'Name what feels loud'}
              </h2>
              <p className="page-hero__description">
                {step === 'mood'
                  ? 'Choose the option that matches where your nervous system is landing.'
                  : 'Pick a couple of stressors or skip if nothing needs attention.'}
              </p>
            </div>

            {step === 'mood' && (
              <div className="grid gap-3 sm:grid-cols-2">
                {moodOptions.map((option) => {
                  const isSelected = selectedMood === option.value;
                  const accentHover =
                    option.value === 'calm'
                      ? 'hover:border-safespace-accent/50 hover:bg-safespace-accent/10'
                      : option.value === 'slightly-stressed'
                        ? 'hover:border-safespace-stress-low/50 hover:bg-safespace-stress-low/10'
                        : option.value === 'moderately-stressed'
                          ? 'hover:border-safespace-stress-medium/50 hover:bg-safespace-stress-medium/10'
                          : 'hover:border-safespace-stress-high/40 hover:bg-safespace-stress-high/10';

                  return (
                    <button
                      key={option.value}
                      onClick={() => handleMoodSelect(option.value)}
                      className={`card-section card-section-hover flex flex-col gap-3 px-5 py-6 text-left transition ${accentHover} ${
                        isSelected
                          ? 'border-safespace-primary/50 text-safespace-primary'
                          : 'text-safespace-foreground/80'
                      }`}
                      aria-pressed={isSelected}
                    >
                      <span className="text-4xl" aria-hidden>
                        {option.emoji}
                      </span>
                      <span className="text-base font-semibold text-safespace-foreground dark:text-slate-100">
                        {option.label}
                      </span>
                      <span className="text-sm text-safespace-foreground/60 dark:text-slate-300">
                        {option.helper}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {step === 'stressors' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setStep('mood')}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-safespace-muted/60 text-safespace-foreground/70 transition hover:border-safespace-primary/40 hover:text-safespace-primary dark:border-white/10 dark:text-slate-300"
                    aria-label="Back to mood options"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  {activeMood && (
                    <span className="text-sm text-safespace-foreground/65 dark:text-slate-300">
                      Checking in while feeling <span className="text-safespace-primary">{activeMood.label.toLowerCase()}</span>
                    </span>
                  )}
                </div>

                {recentStressors.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {recentStressors.map((stressorName) => {
                      const isActive = stressors.includes(stressorName);
                      return (
                        <button
                          key={stressorName}
                          onClick={() => handleAddRecentStressor(stressorName)}
                          className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm transition ${
                            isActive
                              ? 'bg-safespace-primary text-white shadow-sm'
                              : 'bg-white/70 text-safespace-foreground/70 ring-1 ring-safespace-muted/50 hover:text-safespace-foreground dark:bg-slate-900/70 dark:text-slate-200 dark:ring-white/15'
                          }`}
                        >
                          {stressorName}
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      type="text"
                      value={currentStressor}
                      onChange={(event) => setCurrentStressor(event.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Add a stressor"
                      className="input-surface flex-1 px-4 py-3"
                    />
                    <Button
                      type="button"
                      onClick={handleAddStressor}
                      disabled={!currentStressor.trim()}
                      size="sm"
                      className="rounded-full px-5 text-sm font-semibold disabled:bg-safespace-muted disabled:text-safespace-foreground/40 dark:bg-safespace-primary/70 dark:text-slate-950 dark:hover:bg-safespace-primary/60"
                    >
                      Add
                    </Button>
                  </div>

                  {stressors.length > 0 && (
                    <div className="flex flex-wrap gap-2 rounded-2xl border border-safespace-muted/45 bg-white/80 px-3 py-2 dark:border-white/10 dark:bg-slate-900/70">
                      {stressors.map((stressor, index) => (
                        <span
                          key={`${stressor}-${index}`}
                          className="inline-flex items-center gap-2 rounded-full bg-safespace-muted/60 px-3 py-1.5 text-sm text-safespace-foreground/75 dark:bg-white/10 dark:text-slate-200"
                        >
                          {stressor}
                          <button
                            type="button"
                            onClick={() => handleRemoveStressor(index)}
                            className="flex h-5 w-5 items-center justify-center rounded-full text-xs text-safespace-foreground/60 transition hover:bg-safespace-muted/40 hover:text-safespace-foreground"
                            aria-label={`Remove ${stressor}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Button
                    variant="ghost"
                    onClick={handleSkip}
                    size="sm"
                    className="self-start whitespace-nowrap rounded-full px-3 text-safespace-foreground/70 hover:text-safespace-primary dark:text-slate-300"
                  >
                    Skip for now
                  </Button>
                  <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                    <Button
                      variant="outline"
                      onClick={() => setStep('mood')}
                      size="sm"
                      className="rounded-full border-safespace-muted/60 px-4 text-sm font-semibold text-safespace-foreground/70 transition hover:border-safespace-primary/40 hover:text-safespace-primary dark:border-white/15 dark:text-slate-200"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={() => handleSubmit(undefined)}
                      disabled={stressors.length === 0}
                      size="sm"
                      className="rounded-full px-5 text-sm font-semibold disabled:bg-safespace-muted disabled:text-safespace-foreground/40"
                    >
                      Save check-in
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodCheckInOverlay;
