
import React from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <PageContainer title="Page Not Found" subtitle="Sorry, we couldn't find the page you're looking for">
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-safespace-primary text-9xl font-bold mb-4">404</div>
        <p className="text-gray-500 mb-8 text-center">
          The page you requested doesn't exist or has been moved to a new location.
        </p>
        <Link 
          to="/" 
          className="flex items-center gap-2 px-5 py-2.5 bg-safespace-primary text-white rounded-md hover:bg-safespace-primary/90 transition-colors"
        >
          <Home className="w-5 h-5" />
          <span>Return Home</span>
        </Link>
      </div>
    </PageContainer>
  );
};

export default NotFound;
