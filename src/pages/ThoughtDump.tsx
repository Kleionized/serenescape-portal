
import React from 'react';
import ThoughtInput from '../components/thought/ThoughtInput';
import PageContainer from '../components/layout/PageContainer';

const ThoughtDump = () => {
  return (
    <PageContainer title="Thought Dump">
      <div className="flex-1">
        <ThoughtInput />
      </div>
    </PageContainer>
  );
};

export default ThoughtDump;
