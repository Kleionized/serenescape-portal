
import React, { useState, useEffect } from 'react';
import PageContainer from '../components/layout/PageContainer';
import { getStressors, addStressor, addReflectionEntry } from '../lib/storage';
import { MoodStressor } from '../lib/types';
import { Link } from 'react-router-dom';
import { Search, PlusCircle, Archive } from 'lucide-react';

const RootCause = () => {
  const [stressors, setStressors] = useState<MoodStressor[]>([]);
  const [selectedStressor, setSelectedStressor] = useState<string>('');
  const [newStressor, setNewStressor] = useState<string>('');
  const [worstCase, setWorstCase] = useState<string>('');
  const [resolution, setResolution] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  
  useEffect(() => {
    loadStressors();
  }, []);
  
  const loadStressors = () => {
    const loadedStressors = getStressors();
    // Only show unresolved stressors for selection
    const unresolvedStressors = loadedStressors.filter(s => !s.resolved);
    setStressors(unresolvedStressors);
  };
  
  const handleAddStressor = () => {
    if (!newStressor.trim()) return;
    
    addStressor(newStressor);
    
    // Refresh stressors
    loadStressors();
    
    // Select the new stressor
    setSelectedStressor(newStressor);
    
    // Clear the input
    setNewStressor('');
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStressor || !worstCase.trim() || !resolution.trim()) return;
    
    // Add reflection entry
    addReflectionEntry(selectedStressor, worstCase, resolution);
    
    // Show success message
    setIsSubmitted(true);
    
    // Reset form
    setWorstCase('');
    setResolution('');
    setSelectedStressor('');
    
    // Reset success message after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };
  
  return (
    <PageContainer 
      title="Root Cause Analysis" 
      subtitle="Reflect on specific stressors to understand and address them better"
    >
      <div className="glass-card rounded-xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Search className="w-5 h-5 text-safespace-primary" />
          <h2 className="heading-sm">Identify Your Stressor</h2>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">Select a stressor from your tally:</label>
            <select
              value={selectedStressor}
              onChange={(e) => setSelectedStressor(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-safespace-primary"
            >
              <option value="">Select a stressor...</option>
              {stressors.map((stressor) => (
                <option key={stressor.id} value={stressor.name}>
                  {stressor.name} ({stressor.count})
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center">
            <span className="text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-300 mx-4"></div>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Add a new stressor:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newStressor}
                onChange={(e) => setNewStressor(e.target.value)}
                placeholder="Enter a new stressor..."
                className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-safespace-primary"
              />
              <button
                onClick={handleAddStressor}
                disabled={!newStressor.trim()}
                className={`inline-flex items-center gap-1 px-4 py-2 rounded-md font-medium transition-colors ${
                  !newStressor.trim()
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-safespace-primary text-white hover:bg-safespace-primary/90'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {selectedStressor && (
        <div className="glass-card rounded-xl p-6 animate-fade-in">
          <h2 className="heading-md mb-6">Reflect on: {selectedStressor}</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  What will happen in the worst case scenario?
                </label>
                <textarea
                  value={worstCase}
                  onChange={(e) => setWorstCase(e.target.value)}
                  placeholder="Describe the worst possible outcome..."
                  className="w-full min-h-[120px] p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-safespace-primary resize-y"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  How can you resolve this stressor?
                </label>
                <textarea
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  placeholder="What steps can you take to address this stressor?"
                  className="w-full min-h-[120px] p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-safespace-primary resize-y"
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!worstCase.trim() || !resolution.trim()}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-md font-medium transition-colors ${
                    !worstCase.trim() || !resolution.trim()
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-safespace-primary text-white hover:bg-safespace-primary/90'
                  }`}
                >
                  <span>Save Reflection</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      
      {isSubmitted && (
        <div className="mt-6 bg-green-50 text-green-700 px-6 py-4 rounded-xl flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Your reflection has been saved.</span>
          </div>
          
          <Link
            to="/saved-entries"
            className="text-green-700 hover:underline inline-flex items-center gap-1"
          >
            <span>View saved reflections</span>
            <Archive className="w-4 h-4" />
          </Link>
        </div>
      )}
    </PageContainer>
  );
};

export default RootCause;
