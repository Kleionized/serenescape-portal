
import React from 'react';
import MoodStressorsTally from '../components/home/MoodStressorsTally';
import ActiveTodos from '../components/home/ActiveTodos';

const Index = () => {
  return (
    <div className="min-h-screen bg-safespace-background pt-20">
      <div className="flex flex-col h-[calc(100vh-5rem)] px-6">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 pb-6">
          <MoodStressorsTally />
          <ActiveTodos />
        </div>
      </div>
    </div>
  );
};

export default Index;
