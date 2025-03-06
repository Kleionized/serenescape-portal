
import React from 'react';
import { SignUp as ClerkSignUp } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';

const SignUp = () => {
  const navigate = useNavigate();

  return (
    <PageContainer 
      title="Create an Account" 
      subtitle="Join Your Safe Space to save your progress"
    >
      <div className="flex justify-center">
        <div className="glass-card rounded-xl p-8 w-full max-w-md">
          <ClerkSignUp 
            routing="path" 
            path="/sign-up" 
            redirectUrl="/saved-entries"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none p-0",
                formButtonPrimary: "bg-safespace-primary hover:bg-safespace-primary/90 text-white",
                formFieldInput: "bg-background border border-gray-300 dark:border-gray-700 rounded-md p-2 w-full dark:bg-gray-800 dark:text-white",
                formFieldLabel: "text-safespace-foreground dark:text-white",
                footerActionText: "text-safespace-foreground dark:text-gray-300",
                footerActionLink: "text-safespace-primary",
                socialButtonsBlockButton: "border border-gray-300 dark:border-gray-700 bg-background hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white",
                socialButtonsProviderIcon: "dark:text-white",
                headerTitle: "text-xl font-semibold text-safespace-foreground dark:text-white",
                headerSubtitle: "text-gray-500 dark:text-gray-400",
              }
            }}
          />
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-600 dark:text-gray-300">
          Already have an account?{' '}
          <button 
            onClick={() => navigate('/sign-in')}
            className="text-safespace-primary hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </PageContainer>
  );
};

export default SignUp;
