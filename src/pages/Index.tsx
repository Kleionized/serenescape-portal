
import React from 'react';
import MoodStressorsTally from '../components/home/MoodStressorsTally';
import ActiveTodos from '../components/home/ActiveTodos';

const Index = () => {
  return (
    <div className="min-h-screen bg-safespace-background pt-28">
      <div className="flex flex-col h-[calc(100vh-7rem)] px-6 max-w-6xl mx-auto">
        <div className="flex-1 flex flex-col gap-8 pb-6">
          <div className="flex-1">
            <MoodStressorsTally />
          </div>
          <div className="flex-1">
            <ActiveTodos />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
