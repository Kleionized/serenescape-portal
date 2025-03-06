
import React, { useState } from 'react';
import { addThoughtEntry } from '../../lib/storage';
import { MessageSquare, Send } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';

const ThoughtInput = () => {
  const [thought, setThought] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!thought.trim()) return;
    
    // Save the thought
    addThoughtEntry(thought);
    
    // Show success message using toast
    toast.success("Your thought has been saved");
    
    // Clear the input
    setThought('');
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <MessageSquare className="w-10 h-10 text-safespace-primary mx-auto mb-4 opacity-80" />
        <h2 className="heading-md mb-2">Express Your Thoughts</h2>
        <p className="text-gray-500">Type freely without judgment or analysis</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <textarea
            value={thought}
            onChange={(e) => setThought(e.target.value)}
            placeholder="What's on your mind? Type freely..."
            className="w-full min-h-[280px] p-6 rounded-2xl bg-white/60 backdrop-blur-sm border-0 shadow-md focus:outline-none focus:ring-2 focus:ring-safespace-primary/40 resize-none dark:bg-gray-800/30 dark:text-white dark:placeholder-gray-400 dark:focus:ring-safespace-primary/60"
          />
        </div>
        
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={!thought.trim()}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              !thought.trim()
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500'
                : 'bg-safespace-primary text-white shadow-md hover:shadow-lg hover:bg-safespace-primary/90 dark:bg-safespace-primary/80 dark:hover:bg-safespace-primary/70'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Save Thought</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ThoughtInput;
