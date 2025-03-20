
import React, { useState, useEffect } from 'react';
import { MoodLevel } from '../../lib/types';
import { addMoodCheckIn, getStressors } from '../../lib/storage';
import { X, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface MoodCheckInOverlayProps {
  onClose: () => void;
}

const MoodCheckInOverlay: React.FC<MoodCheckInOverlayProps> = ({
  onClose
}) => {
  const [step, setStep] = useState<'mood' | 'stressors'>('mood');
  const [selectedMood, setSelectedMood] = useState<MoodLevel | null>(null);
  const [stressors, setStressors] = useState<string[]>([]);
  const [currentStressor, setCurrentStressor] = useState<string>('');
  const [recentStressors, setRecentStressors] = useState<string[]>([]);

  useEffect(() => {
    const allStressors = getStressors();
    const activeStressorNames = allStressors.filter(s => !s.resolved).sort((a, b) => b.count - a.count).slice(0, 5).map(s => s.name);
    setRecentStressors(activeStressorNames);
  }, []);

  const handleMoodSelect = (mood: MoodLevel) => {
    setSelectedMood(mood);
    if (mood === 'calm') {
      handleSubmit();
    } else {
      setStep('stressors');
    }
  };

  const handleAddStressor = () => {
    if (currentStressor.trim()) {
      setStressors([...stressors, currentStressor.trim()]);
      setCurrentStressor('');
    }
  };

  const handleAddRecentStressor = (stressorName: string) => {
    if (!stressors.includes(stressorName)) {
      setStressors([...stressors, stressorName]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentStressor.trim()) {
      e.preventDefault();
      handleAddStressor();
    }
  };

  const handleRemoveStressor = (index: number) => {
    const newStressors = [...stressors];
    newStressors.splice(index, 1);
    setStressors(newStressors);
  };

  const handleSubmit = () => {
    if (selectedMood) {
      addMoodCheckIn(selectedMood, stressors);
      toast({
        title: "Mood Check-In Recorded",
        description: "Your mood has been recorded successfully."
      });

      window.dispatchEvent(new Event('mood-checkin-recorded'));
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-card rounded-xl p-8 max-w-2xl w-full mx-4 shadow-xl animate-scale-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="heading-md text-safespace-primary">Mood Check-In</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {step === 'mood' && (
          <div className="space-y-6 animate-fade-in">
            <p className="text-gray-600 dark:text-gray-300">
              How are you feeling right now?
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleMoodSelect('calm')} 
                className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-safespace-accent/10 hover:border-safespace-accent dark:hover:bg-safespace-accent/5 transition-colors flex flex-col items-center gap-2"
              >
                <span className="text-4xl">😌</span>
                <span className="dark:text-white">Calm</span>
              </button>
              
              <button 
                onClick={() => handleMoodSelect('slightly-stressed')} 
                className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-safespace-stress-low/10 hover:border-safespace-stress-low dark:hover:bg-safespace-stress-low/5 transition-colors flex flex-col items-center gap-2"
              >
                <span className="text-4xl">😕</span>
                <span className="dark:text-white">Slightly Stressed</span>
              </button>
              
              <button 
                onClick={() => handleMoodSelect('moderately-stressed')} 
                className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-safespace-stress-medium/10 hover:border-safespace-stress-medium dark:hover:bg-safespace-stress-medium/5 transition-colors flex flex-col items-center gap-2"
              >
                <span className="text-4xl">😟</span>
                <span className="dark:text-white">Moderately Stressed</span>
              </button>
              
              <button 
                onClick={() => handleMoodSelect('very-stressed')} 
                className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-safespace-stress-high/10 hover:border-safespace-stress-high dark:hover:bg-safespace-stress-high/5 transition-colors flex flex-col items-center gap-2"
              >
                <span className="text-4xl">😫</span>
                <span className="dark:text-white">Very Stressed</span>
              </button>
            </div>
          </div>
        )}
        
        {step === 'stressors' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <button 
                onClick={() => setStep('mood')} 
                className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              <p className="text-gray-600 dark:text-gray-300">
                What's causing your stress right now? (Add one or more stressors)
              </p>
            </div>
            
            {recentStressors.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Recent stressors:</p>
                <div className="flex flex-wrap gap-2">
                  {recentStressors.map((stressorName, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => handleAddRecentStressor(stressorName)} 
                      className={`px-3 py-1 rounded-full text-sm ${stressors.includes(stressorName) ? 'bg-safespace-primary text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300'}`}
                    >
                      {stressorName}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={currentStressor} 
                  onChange={e => setCurrentStressor(e.target.value)} 
                  onKeyDown={handleKeyDown} 
                  placeholder="Enter a stressor..." 
                  className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-safespace-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" 
                />
                <button 
                  onClick={handleAddStressor} 
                  disabled={!currentStressor.trim()} 
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${!currentStressor.trim() ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500' : 'bg-safespace-primary text-white hover:bg-safespace-primary/90 dark:bg-safespace-primary/80 dark:hover:bg-safespace-primary/70'}`}
                >
                  Add
                </button>
              </div>
              
              {stressors.length > 0 && (
                <div className="space-y-2 mt-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Added Stressors:</p>
                  <div className="flex flex-wrap gap-2">
                    {stressors.map((stressor, index) => (
                      <div key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center gap-2">
                        <span className="dark:text-white">{stressor}</span>
                        <button 
                          onClick={() => handleRemoveStressor(index)} 
                          className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setStep('mood')} 
                className="border-gray-300 dark:border-gray-600 dark:text-white dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                Back
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={stressors.length === 0} 
                className="dark:bg-safespace-primary/80 dark:hover:bg-safespace-primary/70"
              >
                {stressors.length > 0 ? 'Submit' : 'Skip'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodCheckInOverlay;
