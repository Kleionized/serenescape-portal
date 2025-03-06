
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Activity, MessageSquare, Search, Archive, ListTodo, Info, Menu, X, Heart, UserCircle, LogIn } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useUser();
  
  const navItems = [
    { path: '/', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { path: '/distraction', label: 'Distraction', icon: <Activity className="w-5 h-5" /> },
    { path: '/thought-dump', label: 'Thought Dump', icon: <MessageSquare className="w-5 h-5" /> },
    { path: '/root-cause', label: 'Root Cause', icon: <Search className="w-5 h-5" /> },
    { path: '/saved-entries', label: 'Saved Entries', icon: <Archive className="w-5 h-5" />, auth: true },
    { path: '/todo', label: 'Todo', icon: <ListTodo className="w-5 h-5" />, auth: true },
    { path: '/about', label: 'About', icon: <Info className="w-5 h-5" /> }
  ];
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-safespace-background backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-safespace-primary flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-medium text-safespace-foreground">Your Safe Space</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center">
            <div className="flex items-center space-x-1 mr-2">
              {navItems.map((item) => (
                <React.Fragment key={item.path}>
                  {item.auth ? (
                    <SignedIn>
                      <Link
                        to={item.path}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          location.pathname === item.path
                            ? 'bg-safespace-primary/10 text-safespace-primary'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {item.icon}
                          <span>{item.label}</span>
                        </div>
                      </Link>
                    </SignedIn>
                  ) : (
                    <Link
                      to={item.path}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        location.pathname === item.path
                          ? 'bg-safespace-primary/10 text-safespace-primary'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              <ThemeToggle />
              
              <SignedIn>
                <Link
                  to="/account"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === "/account"
                      ? 'bg-safespace-primary/10 text-safespace-primary'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <UserCircle className="w-5 h-5" />
                    <span>Account</span>
                  </div>
                </Link>
              </SignedIn>
              
              <SignedOut>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/sign-in')}
                  className="ml-2"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </SignedOut>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <ThemeToggle />
            
            <SignedIn>
              <Link
                to="/account"
                className="ml-2 p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <UserCircle className="w-5 h-5" />
              </Link>
            </SignedIn>
            
            <SignedOut>
              <Link
                to="/sign-in"
                className="ml-2 p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <LogIn className="w-5 h-5" />
              </Link>
            </SignedOut>
            
            <button
              type="button"
              className="ml-2 bg-safespace-background p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-safespace-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-safespace-primary"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-safespace-background/95 backdrop-blur-md animate-fade-in">
          <div className="pt-2 pb-3 space-y-1 px-4">
            {navItems.map((item) => (
              <React.Fragment key={item.path}>
                {item.auth ? (
                  <SignedIn>
                    <Link
                      to={item.path}
                      className={`block px-3 py-2 rounded-md text-base font-medium ${
                        location.pathname === item.path
                          ? 'bg-safespace-primary/10 text-safespace-primary'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                      onClick={closeMobileMenu}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  </SignedIn>
                ) : (
                  <Link
                    to={item.path}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      location.pathname === item.path
                        ? 'bg-safespace-primary/10 text-safespace-primary'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    onClick={closeMobileMenu}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                  </Link>
                )}
              </React.Fragment>
            ))}
            
            <SignedOut>
              <Link
                to="/sign-in"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={closeMobileMenu}
              >
                <div className="flex items-center gap-3">
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </div>
              </Link>
            </SignedOut>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
