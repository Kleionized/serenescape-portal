
import React, { createContext, useState, useContext, useEffect } from 'react';
import { OAuth2AuthCodePKCE } from 'react-oauth2-code-pkce';
import { toast } from 'sonner';

// Define the Authentik configuration
const authentikConfig = {
  clientId: 'your-authentik-client-id', // Replace with your Authentik client ID
  authorizationEndpoint: 'https://your-authentik-instance.example.com/application/o/authorize/',
  tokenEndpoint: 'https://your-authentik-instance.example.com/application/o/token/',
  redirectUri: window.location.origin + '/callback',
  scope: 'openid profile email',
  onRefreshTokenExpire: (event) => window.confirm('Your session has expired. Do you want to re-login?') && event.login(),
};

// Create the OAuth client
const oauth = new OAuth2AuthCodePKCE(authentikConfig);

// Define the user type
interface User {
  id: string;
  email?: string;
  fullName?: string;
  profileImageUrl?: string;
}

// Define the authentication context
interface AuthContextProps {
  isAuthenticated: boolean;
  user: User | null;
  login: () => void;
  logout: () => void;
  loading: boolean;
}

// Create the context
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = localStorage.getItem('authentik_token');
        
        if (token) {
          const tokenData = JSON.parse(token);
          if (new Date(tokenData.expiresAt) > new Date()) {
            // Token is still valid
            oauth.setAccessToken(tokenData.accessToken);
            await fetchUserInfo();
          } else {
            // Token expired, try to refresh
            try {
              await oauth.refreshAccessToken();
              await fetchUserInfo();
            } catch (error) {
              console.error('Failed to refresh token:', error);
              localStorage.removeItem('authentik_token');
              setIsAuthenticated(false);
              setUser(null);
            }
          }
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  // Handle the OAuth callback
  useEffect(() => {
    const handleCallback = async () => {
      // Only run on the callback page
      if (window.location.pathname === '/callback') {
        try {
          setLoading(true);
          // Exchange code for token
          await oauth.exchangeCodeForTokens(window.location.href);
          
          // Save token to localStorage
          const token = {
            accessToken: oauth.getAccessToken(),
            refreshToken: oauth.getRefreshToken(),
            expiresAt: new Date(Date.now() + oauth.getTokensExpiresAt() * 1000).toISOString(),
          };
          localStorage.setItem('authentik_token', JSON.stringify(token));
          
          // Fetch user info
          await fetchUserInfo();
          
          // Redirect to saved entries page
          window.location.href = '/saved-entries';
        } catch (error) {
          console.error('Authorization failed:', error);
          toast.error('Authentication failed. Please try again.');
          window.location.href = '/sign-in';
        } finally {
          setLoading(false);
        }
      }
    };

    handleCallback();
  }, []);

  // Fetch user info from Authentik
  const fetchUserInfo = async () => {
    try {
      if (!oauth.getAccessToken()) return;
      
      const userInfoEndpoint = 'https://your-authentik-instance.example.com/application/o/userinfo/';
      const response = await fetch(userInfoEndpoint, {
        headers: {
          Authorization: `Bearer ${oauth.getAccessToken()}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }
      
      const userData = await response.json();
      
      const user: User = {
        id: userData.sub,
        email: userData.email,
        fullName: userData.name,
        profileImageUrl: userData.picture,
      };
      
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error fetching user info:', error);
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  // Login function
  const login = async () => {
    try {
      // Start the authorization flow
      const authUrl = await oauth.getAuthorizationUrl();
      window.location.assign(authUrl);
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to initiate login. Please try again.');
    }
  };

  // Logout function
  const logout = () => {
    // Clear tokens and state
    oauth.reset();
    localStorage.removeItem('authentik_token');
    setIsAuthenticated(false);
    setUser(null);
    toast.success('You have been signed out');
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
