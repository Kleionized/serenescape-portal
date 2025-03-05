
import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import MoodStressorsTally from '../components/home/MoodStressorsTally';
import ActiveTodos from '../components/home/ActiveTodos';

const Index = () => {
  return (
    <PageContainer 
      title="Welcome to Your Safe Space" 
      subtitle="A place to reflect, manage stress, and track your progress"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <MoodStressorsTally />
        <ActiveTodos />
      </div>
      
      <div className="mt-10 glass-card rounded-xl p-6">
        <h2 className="heading-sm mb-4">Quick Add Stressor</h2>
        <div className="text-center py-4">
          <p className="text-gray-500 mb-3">
            Record a stressor to track in your mood stressors tally.
          </p>
          <a 
            href="/root-cause" 
            className="inline-block px-5 py-2.5 bg-safespace-primary text-white rounded-md hover:bg-safespace-primary/90 transition-colors"
          >
            Go to Root Cause Analysis
          </a>
        </div>
      </div>
    </PageContainer>
  );
};

export default Index;
