import React from 'react';
import { MoodStressor } from '../../lib/types';
import { getStressors, resolveStressor } from '../../lib/storage';
import { Check, Feather, Flame, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
const MoodStressorsTally = () => {
  const [stressors, setStressors] = React.useState<MoodStressor[]>([]);
  const [showResolved, setShowResolved] = React.useState(false);
  React.useEffect(() => {
    loadStressors();

    // Add event listener for mood check-ins
    window.addEventListener('mood-checkin-recorded', loadStressors);

    // Cleanup
    return () => {
      window.removeEventListener('mood-checkin-recorded', loadStressors);
    };
  }, []);
  const loadStressors = () => {
    const loadedStressors = getStressors();
    // Sort by resolved status first, then by count (highest first)
    loadedStressors.sort((a, b) => {
      if (a.resolved && b.resolved || !a.resolved && !b.resolved) {
        return b.count - a.count;
      }
      return a.resolved ? 1 : -1;
    });
    setStressors(loadedStressors);
  };
  const handleResolveStressor = (id: string, name: string) => {
    resolveStressor(id);
    toast({
      title: "Stressor Resolved",
      description: `You've resolved "${name}" as a stressor.`
    });
    loadStressors();
  };
  const getStressColor = (count: number): string => {
    if (count >= 5) return 'text-safespace-stress-high';
    if (count >= 3) return 'text-safespace-stress-medium';
    return 'text-safespace-stress-low';
  };
  const filteredStressors = showResolved ? stressors : stressors.filter(stressor => !stressor.resolved);
  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm font-medium text-safespace-foreground/70 dark:text-slate-200">
          <Feather className="h-4 w-4 text-safespace-primary dark:text-safespace-primary/80" />
          <span>Mood stressors</span>
        </div>
        <button
          onClick={() => setShowResolved((prev) => !prev)}
          className="button-muted px-3 py-1 text-xs font-medium"
        >
          {showResolved ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          {showResolved ? 'Hide resolved' : 'Show resolved'}
        </button>
      </div>

      {filteredStressors.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-safespace-muted p-8 text-center text-sm text-safespace-foreground/60 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-300">
          <Flame className="mb-3 h-6 w-6 text-safespace-primary/70 dark:text-safespace-primary/80" />
          {showResolved ? 'No stressors recorded yet.' : 'All clear for now.'}
        </div>
      ) : (
        <ul className="space-y-3">
          {filteredStressors.map((stressor) => (
            <li key={stressor.id} className="card-section card-section-hover">
              <div className="flex items-center gap-3">
                {stressor.resolved && <Check className="h-4 w-4 text-safespace-stress-low" />}
                <span className={`text-safespace-foreground dark:text-slate-100 ${stressor.resolved ? 'line-through opacity-60' : ''}`}>
                  {stressor.name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-semibold uppercase tracking-[0.25em] ${getStressColor(stressor.count)}`}>
                  {stressor.count}
                </span>
                {!stressor.resolved && (
                  <button
                    onClick={() => handleResolveStressor(stressor.id, stressor.name)}
                    className="text-xs font-medium text-safespace-primary transition hover:text-safespace-primary/70"
                  >
                    mark done
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default MoodStressorsTally;
