
import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-safespace-background pt-20">
      <div className="safe-area-block--tight mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="flex flex-col items-center justify-center py-14 sm:py-16">
          <div className="mb-4 text-7xl font-bold text-safespace-primary sm:text-8xl lg:text-9xl">404</div>
          <p className="mb-8 text-center text-gray-500">
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
      </div>
    </div>
  );
};

export default NotFound;
