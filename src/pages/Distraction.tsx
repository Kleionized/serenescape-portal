
import React from 'react';
import ActivityWheel from '../components/distraction/ActivityWheel';

const Distraction = () => {
  return (
    <div className="min-h-screen bg-safespace-background pt-28">
      <div className="max-w-6xl mx-auto px-6 pb-20 flex flex-col h-[calc(100vh-7rem)]">
        <header className="mb-10">
          <h1 className="heading-lg text-safespace-foreground">Distraction Activities</h1>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <ActivityWheel />
        </div>
      </div>
    </div>
  );
};

export default Distraction;
