
import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import ActivityWheel from '../components/distraction/ActivityWheel';

const Distraction = () => {
  return (
    <PageContainer 
      title="Distraction Activities" 
      subtitle="Use these activities to break the cycle when you're feeling overwhelmed"
    >
      <ActivityWheel />
      
      <div className="mt-8 glass-card rounded-xl p-6 dark:bg-black/80 dark:border-gray-800">
        <h2 className="heading-sm mb-4">About Distractions</h2>
        <p className="text-gray-600 mb-3 dark:text-gray-300">
          Sometimes when we feel overwhelmed, a simple distraction can help break the cycle of stress and rumination. 
          The activities above are designed to give you a quick mental reset.
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          Spin the wheel to get a random activity suggestion, or customize the list with activities that work best for you.
        </p>
      </div>
    </PageContainer>
  );
};

export default Distraction;
