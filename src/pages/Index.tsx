
import React from 'react';
import MoodStressorsTally from '../components/home/MoodStressorsTally';
import ActiveTodos from '../components/home/ActiveTodos';
import { ScrollArea } from '@/components/ui/scroll-area';
import PageContainer from '../components/layout/PageContainer';

const Index = () => {
  return (
    <PageContainer title="Your Safe Space">
      <div className="flex flex-col gap-8 h-full">
        <div className="flex-1">
          <MoodStressorsTally />
        </div>
        <div className="flex-1">
          <ScrollArea className="h-full">
            <ActiveTodos />
          </ScrollArea>
        </div>
      </div>
    </PageContainer>
  );
};

export default Index;
