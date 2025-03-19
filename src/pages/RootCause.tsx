
import React, { useState, useEffect } from 'react';
import { getStressors, addStressor, addReflectionEntry } from '../lib/storage';
import { MoodStressor } from '../lib/types';
import { Search, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

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
    const unresolvedStressors = loadedStressors.filter(s => !s.resolved);
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
    
    toast.success("Your reflection has been saved");
    
    setWorstCase('');
    setResolution('');
    setSelectedStressor('');
  };
  
  return (
    <div className="min-h-screen bg-safespace-background pt-28">
      <div className="max-w-6xl mx-auto px-6 pb-20 flex flex-col h-[calc(100vh-7rem)]">
        <header className="mb-10">
          <h1 className="heading-lg text-safespace-foreground">Root Cause Analysis</h1>
        </header>
        
        <div className="flex-1">
          {!selectedStressor ? (
            <div className="max-w-2xl mx-auto h-full flex flex-col">
              <div className="mb-10 text-center">
                <Search className="w-10 h-10 text-safespace-primary mx-auto mb-4 opacity-80" />
                <h2 className="heading-md mb-2">What's causing your stress today?</h2>
              </div>
              
              <div className="space-y-8 flex-1">
                {stressors.length > 0 && (
                  <div className="space-y-4 flex-1">
                    <div className="grid grid-cols-1 gap-3">
                      {stressors.map((stressor) => (
                        <button
                          key={stressor.id}
                          onClick={() => setSelectedStressor(stressor.name)}
                          className="p-4 text-left rounded-xl hover:bg-white/30 transition-all dark:hover:bg-gray-800/30"
                        >
                          <span className="font-medium">{stressor.name}</span>
                          <span className="ml-2 text-gray-500">({stressor.count} occurrences)</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="pt-4">
                  <div className="flex items-center my-6">
                    <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
                    <span className="mx-4 text-gray-400">or</span>
                    <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newStressor}
                        onChange={(e) => setNewStressor(e.target.value)}
                        placeholder="Enter what's stressing you out..."
                        className="flex-1 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-safespace-primary/40 dark:focus:ring-safespace-primary/60 dark:text-white dark:placeholder-gray-400 dark:bg-gray-800/50"
                      />
                      <button
                        onClick={handleAddStressor}
                        disabled={!newStressor.trim()}
                        className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl font-medium transition-all ${
                          !newStressor.trim()
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500'
                            : 'bg-safespace-primary text-white hover:bg-safespace-primary/90 dark:bg-safespace-primary/80 dark:hover:bg-safespace-primary/70'
                        }`}
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto animate-fade-in h-full flex flex-col">
              <form onSubmit={handleSubmit} className="space-y-10 flex-1 flex flex-col">
                <div className="mb-6">
                  <h2 className="heading-md mb-2 text-center">Reflecting on: <span className="text-safespace-primary">{selectedStressor}</span></h2>
                </div>
                
                <div className="space-y-10 flex-1 flex flex-col">
                  <div className="flex-1">
                    <label className="block text-lg font-medium mb-4">
                      What about the stressor worries you?
                    </label>
                    <textarea
                      value={worstCase}
                      onChange={(e) => setWorstCase(e.target.value)}
                      placeholder="Describe what specific aspects concern you the most..."
                      className="w-full h-[60%] min-h-[200px] p-6 rounded-2xl focus:outline-none focus:ring-2 focus:ring-safespace-primary/40 resize-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800/50 dark:focus:ring-safespace-primary/60 bg-transparent"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <label className="block text-lg font-medium mb-4">
                      What actionable steps can you take?
                    </label>
                    <textarea
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value)}
                      placeholder="List specific actions you can take to address this stressor..."
                      className="w-full h-[60%] min-h-[200px] p-6 rounded-2xl focus:outline-none focus:ring-2 focus:ring-safespace-primary/40 resize-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800/50 dark:focus:ring-safespace-primary/60 bg-transparent"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center pt-4">
                    <button
                      type="button"
                      onClick={() => setSelectedStressor('')}
                      className="px-6 py-3 rounded-xl text-safespace-foreground hover:bg-white/20 transition-all dark:hover:bg-gray-800/20 dark:text-white"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={!worstCase.trim() || !resolution.trim()}
                      className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                        !worstCase.trim() || !resolution.trim()
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500'
                          : 'bg-safespace-primary text-white hover:bg-safespace-primary/90 dark:bg-safespace-primary/80 dark:hover:bg-safespace-primary/70'
                      }`}
                    >
                      <span>Save Reflection</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RootCause;
