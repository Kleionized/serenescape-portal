
import React, { useState, useEffect } from 'react';
import PageContainer from '../components/layout/PageContainer';
import { getStressors, addStressor, addReflectionEntry } from '../lib/storage';
import { MoodStressor } from '../lib/types';
import { Link } from 'react-router-dom';
import { Search, PlusCircle, Archive } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-b from-safespace-background to-safespace-muted/30 pt-20">
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <header className="mb-12">
          <h1 className="heading-lg text-safespace-foreground mb-3">Root Cause Analysis</h1>
          <p className="text-gray-500 text-lg max-w-2xl">Reflect on specific stressors to understand and address them better</p>
        </header>
        
        {!selectedStressor ? (
          <div className="max-w-2xl mx-auto">
            <div className="mb-10 text-center">
              <Search className="w-10 h-10 text-safespace-primary mx-auto mb-4 opacity-80" />
              <h2 className="heading-md mb-2">What's causing your stress today?</h2>
              <p className="text-gray-500 mb-8">Select an existing stressor or add a new one to begin your reflection</p>
            </div>
            
            <div className="space-y-8">
              {stressors.length > 0 && (
                <div className="space-y-4">
                  <label className="block text-lg font-medium text-center mb-4">Select a stressor:</label>
                  <div className="grid grid-cols-1 gap-3">
                    {stressors.map((stressor) => (
                      <button
                        key={stressor.id}
                        onClick={() => setSelectedStressor(stressor.name)}
                        className="p-4 text-left border border-gray-200 rounded-xl bg-white/40 backdrop-blur-sm hover:bg-white/70 transition-all shadow-sm hover:shadow dark:bg-gray-800/30 dark:border-gray-700 dark:hover:bg-gray-800/50"
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
                  <label className="block text-lg font-medium text-center">Add a new stressor:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newStressor}
                      onChange={(e) => setNewStressor(e.target.value)}
                      placeholder="Enter what's stressing you out..."
                      className="flex-1 p-4 rounded-xl border-0 bg-white/60 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-safespace-primary/40 dark:bg-gray-800/30 dark:focus:ring-safespace-primary/60 dark:text-white dark:placeholder-gray-400"
                    />
                    <button
                      onClick={handleAddStressor}
                      disabled={!newStressor.trim()}
                      className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl font-medium transition-all ${
                        !newStressor.trim()
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500'
                          : 'bg-safespace-primary text-white shadow-md hover:shadow-lg hover:bg-safespace-primary/90 dark:bg-safespace-primary/80 dark:hover:bg-safespace-primary/70'
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
          <div className="max-w-3xl mx-auto animate-fade-in">
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="mb-6">
                <h2 className="heading-md mb-2 text-center">Reflecting on: <span className="text-safespace-primary">{selectedStressor}</span></h2>
                <p className="text-gray-500 text-center">Take your time to think deeply about this stressor</p>
              </div>
              
              <div className="space-y-10">
                <div>
                  <label className="block text-lg font-medium mb-4">
                    What will happen in the worst case scenario?
                  </label>
                  <textarea
                    value={worstCase}
                    onChange={(e) => setWorstCase(e.target.value)}
                    placeholder="Describe the worst possible outcome..."
                    className="w-full min-h-[180px] p-6 rounded-2xl bg-white/60 backdrop-blur-sm border-0 shadow-md focus:outline-none focus:ring-2 focus:ring-safespace-primary/40 resize-none dark:bg-gray-800/30 dark:text-white dark:placeholder-gray-400 dark:focus:ring-safespace-primary/60"
                  />
                </div>
                
                <div>
                  <label className="block text-lg font-medium mb-4">
                    How can you resolve this stressor?
                  </label>
                  <textarea
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    placeholder="What steps can you take to address this stressor?"
                    className="w-full min-h-[180px] p-6 rounded-2xl bg-white/60 backdrop-blur-sm border-0 shadow-md focus:outline-none focus:ring-2 focus:ring-safespace-primary/40 resize-none dark:bg-gray-800/30 dark:text-white dark:placeholder-gray-400 dark:focus:ring-safespace-primary/60"
                  />
                </div>
                
                <div className="flex justify-between items-center pt-4">
                  <button
                    type="button"
                    onClick={() => setSelectedStressor('')}
                    className="px-6 py-3 rounded-xl text-safespace-foreground bg-white/40 hover:bg-white/70 transition-all dark:bg-gray-800/30 dark:hover:bg-gray-800/50 dark:text-white"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={!worstCase.trim() || !resolution.trim()}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                      !worstCase.trim() || !resolution.trim()
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500'
                        : 'bg-safespace-primary text-white shadow-md hover:shadow-lg hover:bg-safespace-primary/90 dark:bg-safespace-primary/80 dark:hover:bg-safespace-primary/70'
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
  );
};

export default RootCause;
