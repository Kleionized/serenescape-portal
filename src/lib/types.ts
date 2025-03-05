
export type MoodStressor = {
  id: string;
  name: string;
  count: number;
};

export type TodoItem = {
  id: string;
  text: string;
  completed: boolean;
  importance: 'low' | 'medium' | 'high';
  subtasks: {
    id: string;
    text: string;
    completed: boolean;
  }[];
  section: string;
};

export type ThoughtEntry = {
  id: string;
  text: string;
  createdAt: string;
  type: 'thought';
};

export type ReflectionEntry = {
  id: string;
  stressor: string;
  worstCase: string;
  resolution: string;
  createdAt: string;
  type: 'reflection';
};

export type SavedEntry = ThoughtEntry | ReflectionEntry;

export type DistractionActivity = {
  id: string;
  text: string;
};

export type MoodLevel = 'calm' | 'slightly-stressed' | 'moderately-stressed' | 'very-stressed';

export type MoodCheckIn = {
  id: string;
  mood: MoodLevel;
  stressors: string[];
  timestamp: string;
};
