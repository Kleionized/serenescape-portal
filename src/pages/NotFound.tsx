
import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-safespace-background pt-20">
      <div className="max-w-6xl mx-auto px-6 pb-20">
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
      </div>
    </div>
  );
};

export default NotFound;
