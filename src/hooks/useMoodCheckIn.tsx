
import { useState, useEffect } from 'react';
import { isTimeForMoodCheckIn } from '../lib/storage';

export const useMoodCheckIn = () => {
  const [showMoodCheckIn, setShowMoodCheckIn] = useState(false);
  
  useEffect(() => {
    // Check immediately when the app loads
    const checkIfTimeForMoodCheckIn = () => {
      if (isTimeForMoodCheckIn()) {
        setShowMoodCheckIn(true);
      }
    };
    
    // Run the check on mount
    checkIfTimeForMoodCheckIn();
    
    // Set up an interval to check every 5 minutes (300000ms)
    // We don't check exactly every 2 hours to avoid alignment issues
    const intervalId = setInterval(checkIfTimeForMoodCheckIn, 300000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const closeMoodCheckIn = () => {
    setShowMoodCheckIn(false);
  };
  
  return { showMoodCheckIn, closeMoodCheckIn };
};
