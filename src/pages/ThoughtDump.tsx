
import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import ThoughtInput from '../components/thought/ThoughtInput';
import { Link } from 'react-router-dom';
import { Archive } from 'lucide-react';

const ThoughtDump = () => {
  return (
    <PageContainer 
      title="Thought Dump" 
      subtitle="A private space to freely express your thoughts and feelings"
    >
      <ThoughtInput />
      
      <div className="mt-8 flex justify-center">
        <Link
          to="/saved-entries"
          className="inline-flex items-center gap-2 px-4 py-2 text-safespace-primary hover:underline"
        >
          <Archive className="w-5 h-5" />
          <span>View saved thoughts</span>
        </Link>
      </div>
      
      <div className="mt-4 glass-card rounded-xl p-6">
        <h2 className="heading-sm mb-4">Why Use a Thought Dump?</h2>
        <p className="text-gray-600 mb-3">
          A thought dump is a simple but powerful technique to clear your mind of racing thoughts,
          worries, and ideas that might be causing stress or anxiety.
        </p>
        <p className="text-gray-600">
          By writing down your thoughts without judgment or analysis, you externalize them,
          making them easier to process later. All your entries are saved for later reflection.
        </p>
      </div>
    </PageContainer>
  );
};

export default ThoughtDump;
