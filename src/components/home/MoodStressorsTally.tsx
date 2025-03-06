
import React from 'react';
import { MoodStressor } from '../../lib/types';
import { getStressors, resolveStressor } from '../../lib/storage';
import { Check } from 'lucide-react';
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
      if ((a.resolved && b.resolved) || (!a.resolved && !b.resolved)) {
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
      description: `You've resolved "${name}" as a stressor.`,
    });
    loadStressors();
  };
  
  const getStressColor = (count: number): string => {
    if (count >= 5) return 'bg-safespace-stress-high text-white';
    if (count >= 3) return 'bg-safespace-stress-medium text-gray-900';
    return 'bg-safespace-stress-low text-gray-900';
  };
  
  const filteredStressors = showResolved 
    ? stressors 
    : stressors.filter(stressor => !stressor.resolved);
  
  return (
    <div className="glass-card rounded-xl p-6 animate-scale-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="heading-sm">Mood Stressors Tally</h2>
        <button 
          onClick={() => setShowResolved(!showResolved)}
          className="text-xs px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 transition-colors"
        >
          {showResolved ? "Hide Resolved" : "Show Resolved"}
        </button>
      </div>
      
      {filteredStressors.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-safespace-foreground dark:text-white">
            {showResolved 
              ? "No stressors recorded yet." 
              : "No active stressors recorded yet."}
          </p>
          <p className="text-sm text-safespace-foreground dark:text-white/80 mt-2">
            Your stressors from mood check-ins will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredStressors.map((stressor) => (
            <div key={stressor.id} className="flex items-center justify-between group">
              <div className="flex items-center gap-2">
                {stressor.resolved && (
                  <Check className="w-4 h-4 text-green-500" />
                )}
                <span className={`text-safespace-foreground dark:text-white ${stressor.resolved ? 'line-through text-gray-400 dark:text-gray-500' : ''}`}>
                  {stressor.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span 
                  className={`${getStressColor(stressor.count)} px-3 py-1 rounded-full text-sm font-medium`}
                >
                  {stressor.count}
                </span>
                
                {!stressor.resolved && (
                  <button
                    onClick={() => handleResolveStressor(stressor.id, stressor.name)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    title="Mark as resolved"
                  >
                    <Check className="w-4 h-4 text-green-500" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-6 text-xs text-safespace-foreground dark:text-white/70">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-safespace-stress-low"></span>
            <span>1-2 occurrences</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-safespace-stress-medium"></span>
            <span>3-4 occurrences</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-safespace-stress-high"></span>
            <span>5+ occurrences</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodStressorsTally;
