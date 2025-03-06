
import React from 'react';
import ThoughtInput from '../components/thought/ThoughtInput';
import { Link } from 'react-router-dom';
import { Archive } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';

const ThoughtDump = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-safespace-background to-safespace-muted/30 pt-20">
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <header className="mb-12">
          <h1 className="heading-lg text-safespace-foreground mb-3">Thought Dump</h1>
          <p className="text-gray-500 text-lg max-w-2xl">A private space to freely express your thoughts and feelings</p>
        </header>
        
        <ThoughtInput />
        
        <div className="mt-12 flex justify-start">
          <Link
            to="/saved-entries"
            className="inline-flex items-center gap-2 px-4 py-2 text-safespace-primary hover:underline dark:text-safespace-primary/90"
          >
            <Archive className="w-5 h-5" />
            <span>View saved thoughts</span>
          </Link>
        </div>
        
        <div className="mt-6 max-w-2xl">
          <h2 className="heading-sm mb-4">Why Use a Thought Dump?</h2>
          <p className="text-gray-600 mb-3 dark:text-gray-300">
            A thought dump is a simple but powerful technique to clear your mind of racing thoughts,
            worries, and ideas that might be causing stress or anxiety.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            By writing down your thoughts without judgment or analysis, you externalize them,
            making them easier to process later. All your entries are saved for later reflection.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThoughtDump;
