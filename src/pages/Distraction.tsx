
import React from 'react';
import ActivityWheel from '../components/distraction/ActivityWheel';

const Distraction = () => {
  return (
    <div className="min-h-screen bg-safespace-background pt-20">
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <header className="mb-10">
          <h1 className="heading-lg text-safespace-foreground">Distraction Activities</h1>
        </header>
        <ActivityWheel />
      </div>
    </div>
  );
};

export default Distraction;
