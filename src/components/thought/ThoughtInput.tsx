
import React, { useState } from 'react';
import { addThoughtEntry } from '../../lib/storage';
import { MessageSquare, Send } from 'lucide-react';
import { Button } from '../ui/button';

const ThoughtInput = () => {
  const [thought, setThought] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!thought.trim()) return;
    
    // Save the thought
    addThoughtEntry(thought);
    
    // Show success message
    setIsSaved(true);
    
    // Clear the input
    setThought('');
    
    // Reset the success message after 3 seconds
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };
  
  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <MessageSquare className="w-5 h-5 text-safespace-primary" />
        <h2 className="heading-sm">Express Your Thoughts</h2>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <textarea
            value={thought}
            onChange={(e) => setThought(e.target.value)}
            placeholder="What's on your mind? Type freely..."
            className="w-full min-h-[200px] p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-safespace-primary resize-y dark:bg-black/80 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
          />
        </div>
        
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={!thought.trim()}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-md font-medium transition-colors ${
              !thought.trim()
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500'
                : 'bg-safespace-primary text-white hover:bg-safespace-primary/90 dark:bg-black/90 dark:hover:bg-black/70 dark:border dark:border-gray-700'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Save Thought</span>
          </Button>
        </div>
        
        {isSaved && (
          <div className="mt-4 bg-green-50 text-green-700 px-4 py-3 rounded-md flex items-center gap-2 animate-fade-in dark:bg-green-900/30 dark:text-green-300">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Your thought has been saved.</span>
          </div>
        )}
      </form>
    </div>
  );
};

export default ThoughtInput;
