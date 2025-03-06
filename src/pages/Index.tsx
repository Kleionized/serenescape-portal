
import React from 'react';
import MoodStressorsTally from '../components/home/MoodStressorsTally';
import ActiveTodos from '../components/home/ActiveTodos';

const Index = () => {
  return (
    <div className="min-h-screen bg-safespace-background pt-20">
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <header className="mb-10">
          <h1 className="heading-lg text-safespace-foreground">Welcome to Your Safe Space</h1>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <MoodStressorsTally />
          <ActiveTodos />
        </div>
      </div>
    </div>
  );
};

export default Index;
