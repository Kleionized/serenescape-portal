
import React from 'react';
import PageContainer from '../components/layout/PageContainer';

const About = () => {
  return (
    <PageContainer 
      title="About Your Safe Space" 
      subtitle="Understanding the features and purpose of each section"
    >
      <div className="space-y-8">
        <div className="glass-card p-6 rounded-xl">
          <h2 className="heading-sm mb-4 text-safespace-primary">Home Page</h2>
          <p className="text-gray-700">
            The home page displays your Mood Stressors Tally, showing stressors you've identified and how frequently they occur. 
            It also shows your Active To-Dos, which are the three tasks you're currently focusing on from your overall to-do list.
          </p>
        </div>
        
        <div className="glass-card p-6 rounded-xl">
          <h2 className="heading-sm mb-4 text-safespace-primary">Mood Check-Ins</h2>
          <p className="text-gray-700">
            Every two hours, an overlay will appear prompting you to record your current mood. If you indicate any level of stress
            (Slightly, Moderately, or Very Stressed), you'll be invited to enter one or more stressors—detailing what's troubling you.
            These responses are stored and used to generate your Mood Stressors Tally on the home page, helping you track patterns
            in your stress triggers over time.
          </p>
        </div>
        
        <div className="glass-card p-6 rounded-xl">
          <h2 className="heading-sm mb-4 text-safespace-primary">Distraction Page</h2>
          <p className="text-gray-700">
            When feeling overwhelmed, visit the Distraction page for a wheel of activities designed to help break the cycle.
            You can customize these activities to suit your preferences.
          </p>
        </div>
        
        <div className="glass-card p-6 rounded-xl">
          <h2 className="heading-sm mb-4 text-safespace-primary">Thought Dump</h2>
          <p className="text-gray-700">
            A private space to record your thoughts and feelings. All entries are saved and can be reviewed later in the 
            Saved Entries page.
          </p>
        </div>
        
        <div className="glass-card p-6 rounded-xl">
          <h2 className="heading-sm mb-4 text-safespace-primary">Root Cause Analysis</h2>
          <p className="text-gray-700">
            This page helps you pinpoint specific stressors and reflect on them through guided prompts:
            "What will happen in the worst case scenario?" and "How can I resolve this stressor?"
            Your responses are saved as reflection entries for later review.
          </p>
        </div>
        
        <div className="glass-card p-6 rounded-xl">
          <h2 className="heading-sm mb-4 text-safespace-primary">Saved Entries</h2>
          <p className="text-gray-700">
            Review all your Thought Dump entries and Root Cause reflections. You can delete individual entries
            or clear all entries if needed.
          </p>
        </div>
        
        <div className="glass-card p-6 rounded-xl">
          <h2 className="heading-sm mb-4 text-safespace-primary">To-Do List</h2>
          <p className="text-gray-700">
            Manage your tasks organized by sections (Work, Personal, Social, etc.). Add tasks with importance ratings,
            create subtasks, and select up to three active to-dos to focus on. You can customize sections and mark tasks
            as complete.
          </p>
        </div>
        
        <div className="glass-card p-6 rounded-xl bg-safespace-accent/20">
          <h2 className="heading-sm mb-4">Privacy & Data</h2>
          <p className="text-gray-700">
            Your Safe Space stores all data locally in your browser using localStorage. Your entries, tasks, and settings
            persist across sessions but remain private to your device. No data is sent to any server.
          </p>
        </div>
        
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>© 2025 Kleiochild. All rights reserved.</p>
          <p className="mt-1">
            <a href="mailto:kleiochild@gmail.com" className="text-safespace-primary hover:underline transition-colors">
              kleiochild@gmail.com
            </a>
          </p>
        </div>
      </div>
    </PageContainer>
  );
};

export default About;
