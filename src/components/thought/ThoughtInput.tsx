
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
            className="w-full min-h-[280px] p-6 bg-transparent backdrop-blur-sm border-0 border-b border-gray-200 shadow-sm focus:outline-none focus:border-safespace-primary/40 resize-none dark:border-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-safespace-primary/60"
          />
        </div>
        
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={!thought.trim()}
            variant={!thought.trim() ? "outline" : "default"}
          >
            <Send className="w-4 h-4 mr-2" />
            <span>Save Thought</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ThoughtInput;
