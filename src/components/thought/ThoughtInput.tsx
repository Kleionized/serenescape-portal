
import React, { useState } from 'react';
import { addThoughtEntry } from '../../lib/storage';
import { Send } from 'lucide-react';
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
    <div className="w-full h-full flex flex-col">      
      <form onSubmit={handleSubmit} className="flex flex-col h-full space-y-4">
        <div className="flex-1">
          <textarea
            value={thought}
            onChange={(e) => setThought(e.target.value)}
            placeholder="What's on your mind? Type freely..."
            className="w-full h-full min-h-[450px] p-6 bg-transparent text-lg focus:outline-none resize-none dark:text-white dark:placeholder-gray-400 border border-gray-200 dark:border-gray-700 rounded-lg"
          />
        </div>
        
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={!thought.trim()}
            variant={!thought.trim() ? "outline" : "default"}
            size="lg"
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
