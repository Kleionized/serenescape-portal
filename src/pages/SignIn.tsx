
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PageContainer from '../components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

const SignIn = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading } = useAuth();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/saved-entries');
    }
  }, [isAuthenticated, navigate, loading]);

  if (loading) {
    return (
      <PageContainer title="Sign In" subtitle="Welcome back to Your Safe Space">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-safespace-primary"></div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer 
      title="Sign In" 
      subtitle="Welcome back to Your Safe Space"
    >
      <div className="flex justify-center">
        <div className="glass-card rounded-xl p-8 w-full max-w-md">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center">Sign in with Authentik</h2>
            <p className="text-gray-500 dark:text-gray-400 text-center">
              Use your Authentik account to sign in to Your Safe Space
            </p>
            <Button 
              onClick={login}
              className="w-full flex items-center justify-center gap-2"
            >
              <LogIn className="h-5 w-5" />
              Sign in with Authentik
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-600 dark:text-gray-300">
          Don't have an account?{' '}
          <button 
            onClick={() => navigate('/sign-up')}
            className="text-safespace-primary hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </PageContainer>
  );
};

export default SignIn;
