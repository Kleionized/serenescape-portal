
import React, { useState, useEffect, useRef } from 'react';
import { getDistractions, saveDistractions } from '../../lib/storage';
import { DistractionActivity } from '../../lib/types';
import { RefreshCw, Plus, X, Save, Edit } from 'lucide-react';

const ActivityWheel = () => {
  const [activities, setActivities] = useState<DistractionActivity[]>([]);
  const [currentActivity, setCurrentActivity] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newActivity, setNewActivity] = useState('');
  
  const spinTimeout = useRef<number | null>(null);
  
  useEffect(() => {
    const loadedActivities = getDistractions();
    setActivities(loadedActivities);
  }, []);
  
  const spinWheel = () => {
    if (activities.length === 0 || isSpinning) return;
    
    setIsSpinning(true);
    setCurrentActivity(null);
    
    // Clear any existing timeout
    if (spinTimeout.current) {
      window.clearTimeout(spinTimeout.current);
    }
    
    // Set a timeout to stop spinning
    const spinningTime = 1500 + Math.random() * 1000;
    spinTimeout.current = window.setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * activities.length);
      setCurrentActivity(activities[randomIndex].text);
      setIsSpinning(false);
    }, spinningTime);
  };
  
  const addActivity = () => {
    if (!newActivity.trim()) return;
    
    const updatedActivities = [
      ...activities,
      { id: Date.now().toString(), text: newActivity.trim() }
    ];
    
    setActivities(updatedActivities);
    saveDistractions(updatedActivities);
    setNewActivity('');
  };
  
  const removeActivity = (id: string) => {
    const updatedActivities = activities.filter(activity => activity.id !== id);
    setActivities(updatedActivities);
    saveDistractions(updatedActivities);
  };
  
  const toggleEditMode = () => {
    if (isEditing) {
      // Save changes when exiting edit mode
      saveDistractions(activities);
    }
    setIsEditing(!isEditing);
  };

  return (
    <div>
      <div className="glass-card rounded-xl p-6 mb-8 dark:bg-black/80 dark:border-gray-800">
        <div className="flex justify-between mb-6">
          <h2 className="heading-sm">Activity Wheel</h2>
          <button
            onClick={toggleEditMode}
            className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              isEditing 
                ? 'bg-safespace-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4" />
                <span>Save</span>
              </>
            ) : (
              <>
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </>
            )}
          </button>
        </div>
        
        <div className="relative">
          <div 
            className={`w-48 h-48 md:w-64 md:h-64 mx-auto rounded-full bg-gradient-to-br from-safespace-primary/20 to-safespace-secondary/20 flex items-center justify-center mb-6 ${
              isSpinning ? 'animate-spin-slow' : ''
            } dark:from-safespace-primary/30 dark:to-safespace-secondary/30 dark:bg-gray-900/50`}
          >
            {currentActivity ? (
              <span className="text-center px-4 font-medium text-safespace-foreground animate-fade-in">
                {currentActivity}
              </span>
            ) : (
              <span className="text-center px-4 text-gray-500 dark:text-gray-400">
                {activities.length > 0 ? 'Spin for an activity' : 'Add activities first'}
              </span>
            )}
          </div>
          
          <div className="absolute top-0 inset-x-0 -mt-3 flex justify-center">
            <div className="w-4 h-4 bg-safespace-primary rotate-45 transform-gpu"></div>
          </div>
        </div>
        
        <div className="flex justify-center mt-6">
          <button
            onClick={spinWheel}
            disabled={activities.length === 0 || isSpinning}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all ${
              activities.length === 0 || isSpinning
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500'
                : 'bg-safespace-primary text-white hover:bg-safespace-primary/90'
            }`}
          >
            <RefreshCw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>Spin the Wheel</span>
          </button>
        </div>
      </div>
      
      {isEditing && (
        <div className="glass-card rounded-xl p-6 animate-slide-in dark:bg-black/80 dark:border-gray-800">
          <h3 className="heading-sm mb-4">Manage Activities</h3>
          
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={newActivity}
              onChange={(e) => setNewActivity(e.target.value)}
              placeholder="Add a new activity..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-safespace-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
            <button
              onClick={addActivity}
              disabled={!newActivity.trim()}
              className={`inline-flex items-center justify-center gap-1 px-4 py-2 rounded-md font-medium transition-colors ${
                !newActivity.trim()
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500'
                  : 'bg-safespace-primary text-white hover:bg-safespace-primary/90'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
          
          <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
            {activities.length === 0 ? (
              <p className="text-gray-500 text-center py-4 dark:text-gray-400">No activities yet.</p>
            ) : (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between bg-white p-3 rounded-md border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                >
                  <span className="flex-1">{activity.text}</span>
                  <button
                    onClick={() => removeActivity(activity.id)}
                    className="text-gray-400 hover:text-red-500 p-1 rounded-md dark:text-gray-500 dark:hover:text-red-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityWheel;
