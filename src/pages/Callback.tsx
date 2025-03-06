
import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PageContainer from '../components/layout/PageContainer';

const Callback = () => {
  const { loading } = useAuth();

  return (
    <PageContainer title="Authenticating" subtitle="Please wait while we complete your authentication">
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-safespace-primary mx-auto"></div>
          <p className="mt-4 text-lg">Completing authentication...</p>
        </div>
      </div>
    </PageContainer>
  );
};

export default Callback;
