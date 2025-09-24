import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Archive, Heart, ListTodo, Menu, MessageSquare, Search, X } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

const NavBar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/thought-dump', label: 'Thought Dump' },
    { path: '/root-cause', label: 'Root Cause' },
    { path: '/todo', label: 'Focus' },
    { path: '/saved-entries', label: 'Saved Entries' }
  ];

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="fixed inset-x-0 top-0 z-40 border-b border-safespace-muted/40 bg-safespace-background/85 backdrop-blur dark:border-white/5 dark:bg-slate-950/80">
      <div className="mx-auto flex h-[4.5rem] w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
        <Link to="/" className="flex items-center gap-2 text-base font-semibold text-safespace-foreground dark:text-slate-100">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-safespace-primary/15 text-safespace-primary dark:bg-safespace-primary/25">
            <Heart className="h-4 w-4" />
          </span>
          <span>Your Safe Space</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-1 text-[15px] font-semibold transition ${
                  isActive
                    ? 'text-safespace-foreground dark:text-slate-100'
                    : 'text-safespace-foreground/55 hover:text-safespace-foreground dark:text-slate-300 dark:hover:text-slate-100'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute -bottom-2 left-1/2 h-[3px] w-3/5 -translate-x-1/2 rounded-full bg-safespace-primary" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-safespace-muted/60 text-safespace-foreground transition hover:border-safespace-primary/40 hover:text-safespace-primary dark:border-white/10 dark:text-slate-100 dark:hover:text-safespace-primary md:hidden"
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="border-t border-safespace-muted/40 bg-safespace-background/95 px-5 pb-6 pt-4 shadow-sm backdrop-blur dark:border-white/5 dark:bg-slate-950/95 md:hidden">
          <div className="flex flex-col gap-2 text-base">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon =
                item.path === '/thought-dump'
                  ? MessageSquare
                  : item.path === '/root-cause'
                    ? Search
                    : item.path === '/todo'
                      ? ListTodo
                      : item.path === '/saved-entries'
                        ? Archive
                        : Heart;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 rounded-2xl px-3 py-2 transition ${
                    isActive
                      ? 'bg-white text-safespace-foreground dark:bg-slate-900 dark:text-slate-100'
                      : 'text-safespace-foreground/70 hover:bg-white/80 hover:text-safespace-foreground dark:text-slate-200 dark:hover:bg-slate-900/80 dark:hover:text-slate-100'
                  }`}
                  onClick={closeMobileMenu}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
