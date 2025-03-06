
import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-safespace-background pt-20">
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <header className="mb-10">
          <h1 className="heading-lg text-safespace-foreground">About Your Safe Space</h1>
        </header>
        
        <div className="space-y-12 max-w-3xl">
          <div>
            <h2 className="heading-sm mb-4 text-safespace-primary">Home Page</h2>
            <p className="text-safespace-foreground dark:text-white">
              Displays your Mood Stressors Tally and Active To-Dos.
            </p>
          </div>
          
          <div>
            <h2 className="heading-sm mb-4 text-safespace-primary">Mood Check-Ins</h2>
            <p className="text-safespace-foreground dark:text-white">
              Record your mood hourly and track stress patterns over time.
            </p>
          </div>
          
          <div>
            <h2 className="heading-sm mb-4 text-safespace-primary">Distraction Page</h2>
            <p className="text-safespace-foreground dark:text-white">
              A wheel of activities to help break the stress cycle.
            </p>
          </div>
          
          <div>
            <h2 className="heading-sm mb-4 text-safespace-primary">Thought Dump</h2>
            <p className="text-safespace-foreground dark:text-white">
              A private space to record thoughts and feelings.
            </p>
          </div>
          
          <div>
            <h2 className="heading-sm mb-4 text-safespace-primary">Root Cause Analysis</h2>
            <p className="text-safespace-foreground dark:text-white">
              Identify stressors and reflect on them through guided prompts.
            </p>
          </div>
          
          <div>
            <h2 className="heading-sm mb-4 text-safespace-primary">Saved Entries</h2>
            <p className="text-safespace-foreground dark:text-white">
              Review all your thought dumps and reflections.
            </p>
          </div>
          
          <div>
            <h2 className="heading-sm mb-4 text-safespace-primary">To-Do List</h2>
            <p className="text-safespace-foreground dark:text-white">
              Manage tasks organized by sections with importance ratings.
            </p>
          </div>
        </div>
        
        <div className="mt-12 text-center text-gray-500 dark:text-white/70 text-sm">
          <p>© 2025 Kleiochild. All rights reserved.</p>
          <p className="mt-1">
            <a href="mailto:kleiochild@gmail.com" className="text-safespace-primary hover:underline transition-colors">
              kleiochild@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
