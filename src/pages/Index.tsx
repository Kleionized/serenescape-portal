
import React from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import MoodStressorsTally from '../components/home/MoodStressorsTally';
import ActiveTodos from '../components/home/ActiveTodos';
import { Activity, MessageSquare, Search, Archive, ListTodo, Info } from 'lucide-react';

const Index = () => {
  const quickLinks = [
    { to: '/distraction', icon: <Activity className="w-5 h-5" />, label: 'Distraction' },
    { to: '/thought-dump', icon: <MessageSquare className="w-5 h-5" />, label: 'Thought Dump' },
    { to: '/root-cause', icon: <Search className="w-5 h-5" />, label: 'Root Cause' },
    { to: '/saved-entries', icon: <Archive className="w-5 h-5" />, label: 'Saved Entries' },
    { to: '/todo', icon: <ListTodo className="w-5 h-5" />, label: 'Todo List' },
    { to: '/about', icon: <Info className="w-5 h-5" />, label: 'About' }
  ];

  return (
    <PageContainer 
      title="Welcome to Your Safe Space" 
      subtitle="A place to reflect, manage stress, and track your progress"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <MoodStressorsTally />
        <ActiveTodos />
      </div>
      
      <div className="mt-10 glass-card rounded-xl p-6">
        <h2 className="heading-sm mb-4">Quick Add Stressor</h2>
        <div className="text-center py-4">
          <p className="text-gray-500 mb-3">
            Record a stressor to track in your mood stressors tally.
          </p>
          <Link 
            to="/root-cause" 
            className="inline-block px-5 py-2.5 bg-safespace-primary text-white rounded-md hover:bg-safespace-primary/90 transition-colors"
          >
            Go to Root Cause Analysis
          </Link>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="heading-sm mb-6">Quick Links</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="glass-card glass-card-hover rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2"
            >
              <div className="w-12 h-12 rounded-full bg-safespace-primary/10 flex items-center justify-center text-safespace-primary">
                {link.icon}
              </div>
              <span className="font-medium">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </PageContainer>
  );
};

export default Index;
