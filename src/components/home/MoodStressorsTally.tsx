
import React from 'react';
import { MoodStressor } from '../../lib/types';
import { getStressors } from '../../lib/storage';

const MoodStressorsTally = () => {
  const [stressors, setStressors] = React.useState<MoodStressor[]>([]);
  
  React.useEffect(() => {
    const loadedStressors = getStressors();
    // Sort by count (highest first)
    loadedStressors.sort((a, b) => b.count - a.count);
    setStressors(loadedStressors);
  }, []);
  
  const getStressColor = (count: number): string => {
    if (count >= 5) return 'bg-safespace-stress-high text-white';
    if (count >= 3) return 'bg-safespace-stress-medium text-gray-900';
    return 'bg-safespace-stress-low text-gray-900';
  };
  
  return (
    <div className="glass-card rounded-xl p-6 animate-scale-in">
      <h2 className="heading-sm mb-4">Mood Stressors Tally</h2>
      
      {stressors.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-gray-500">No stressors recorded yet.</p>
          <p className="text-sm text-gray-400 mt-2">
            Your stressors from mood check-ins will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {stressors.map((stressor) => (
            <div key={stressor.id} className="flex items-center justify-between">
              <span className="text-gray-700">{stressor.name}</span>
              <span 
                className={`${getStressColor(stressor.count)} px-3 py-1 rounded-full text-sm font-medium`}
              >
                {stressor.count}
              </span>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-6 text-xs text-gray-500">
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
