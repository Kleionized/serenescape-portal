
import React, { useState } from 'react';
import { addThoughtEntry } from '../../lib/storage';
import { Send, Sparkles } from 'lucide-react';
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
    <form onSubmit={handleSubmit} className="card-surface flex min-h-[27.4rem] flex-col gap-6 p-6 sm:p-8">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.35em] text-safespace-primary dark:text-safespace-primary/80">
        <span className="inline-flex items-center gap-2 uppercase tracking-[0.35em] text-safespace-primary">
          <Sparkles className="h-3.5 w-3.5" />
          free write
        </span>
      </div>
      <textarea
        value={thought}
        onChange={(e) => setThought(e.target.value)}
        placeholder="Let anything surface. There’s no wrong way to begin."
        className="min-h-[14rem] w-full flex-1 resize-none rounded-2xl border border-safespace-muted/60 bg-white/90 p-6 text-base leading-relaxed text-safespace-foreground placeholder:text-safespace-foreground/45 focus:border-safespace-primary/40 focus:outline-none dark:border-white/10 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400"
      />
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={!thought.trim()}
          className="rounded-full bg-safespace-primary px-5 py-2 text-safespace-primary-foreground transition hover:bg-safespace-primary/90"
        >
          <Send className="mr-2 h-4 w-4" />
          Save thought
        </Button>
      </div>
    </form>
  );
};

export default ThoughtInput;
