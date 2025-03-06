
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
    </PageContainer>
  );
};

export default Index;
