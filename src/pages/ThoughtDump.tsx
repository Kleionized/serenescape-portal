
import React from 'react';
import ThoughtInput from '../components/thought/ThoughtInput';

const ThoughtDump = () => {
  return (
    <div className="min-h-screen bg-safespace-background pt-20">
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <header className="mb-10">
          <h1 className="heading-lg text-safespace-foreground">Thought Dump</h1>
        </header>
        
        <ThoughtInput />
      </div>
    </div>
  );
};

export default ThoughtDump;
