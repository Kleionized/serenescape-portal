import { 
  MoodStressor, 
  TodoItem, 
  ThoughtEntry, 
  ReflectionEntry, 
  SavedEntry,
  DistractionActivity,
  MoodCheckIn,
  MoodLevel
} from './types';

// Default distractions
const DEFAULT_DISTRACTIONS: DistractionActivity[] = [
  { id: '1', text: 'Take a 10-minute walk' },
  { id: '2', text: 'Do a 5-minute breathing exercise' },
  { id: '3', text: 'Listen to your favorite song' },
  { id: '4', text: 'Drink a glass of water' },
  { id: '5', text: "Write down 3 things you're grateful for" },
  { id: '6', text: 'Stretch for 5 minutes' },
  { id: '7', text: 'Call or text a friend' },
  { id: '8', text: 'Make a cup of tea or coffee' }
];

// Default todo sections
const DEFAULT_TODO_SECTIONS = ['Work', 'Personal', 'Social', 'Miscellaneous'];

// Helper function to generate a unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Storage keys
const STORAGE_KEYS = {
  stressors: 'safespace_stressors',
  todos: 'safespace_todos',
  activeTodos: 'safespace_active_todos',
  entries: 'safespace_entries',
  distractions: 'safespace_distractions',
  todoSections: 'safespace_todo_sections',
  moodCheckIns: 'safespace_mood_checkins',
  lastMoodCheckIn: 'safespace_last_mood_checkin'
};

// Get stressors from localStorage
export const getStressors = (): MoodStressor[] => {
  const stressors = localStorage.getItem(STORAGE_KEYS.stressors);
  return stressors ? JSON.parse(stressors) : [];
};

// Save stressors to localStorage
export const saveStressors = (stressors: MoodStressor[]): void => {
  localStorage.setItem(STORAGE_KEYS.stressors, JSON.stringify(stressors));
};

// Add or increment a stressor
export const addStressor = (name: string): void => {
  const stressors = getStressors();
  const existingStressor = stressors.find(s => s.name.toLowerCase() === name.toLowerCase());
  
  if (existingStressor) {
    existingStressor.count += 1;
    // If it was resolved before, mark it as unresolved now that it's been added again
    if (existingStressor.resolved) {
      existingStressor.resolved = false;
    }
  } else {
    stressors.push({ id: generateId(), name, count: 1 });
  }
  
  saveStressors(stressors);
};

// Mark a stressor as resolved
export const resolveStressor = (id: string): void => {
  const stressors = getStressors();
  const stressor = stressors.find(s => s.id === id);
  
  if (stressor) {
    stressor.resolved = true;
    saveStressors(stressors);
  }
};

// Delete a stressor
export const deleteStressor = (id: string): void => {
  const stressors = getStressors();
  const updatedStressors = stressors.filter(s => s.id !== id);
  saveStressors(updatedStressors);
};

// Get todos from localStorage
export const getTodos = (): TodoItem[] => {
  const todos = localStorage.getItem(STORAGE_KEYS.todos);
  return todos ? JSON.parse(todos) : [];
};

// Save todos to localStorage
export const saveTodos = (todos: TodoItem[]): void => {
  localStorage.setItem(STORAGE_KEYS.todos, JSON.stringify(todos));
};

// Delete completed todos
export const deleteCompletedTodos = (): void => {
  const todos = getTodos();
  const incompleteTodos = todos.filter(todo => !todo.completed);
  saveTodos(incompleteTodos);
  
  // Also update active todos to remove any completed ones
  const activeTodos = getActiveTodos();
  const updatedActiveTodos = activeTodos.filter(id => 
    incompleteTodos.some(todo => todo.id === id)
  );
  saveActiveTodos(updatedActiveTodos);
};

// Get active todos from localStorage
export const getActiveTodos = (): string[] => {
  const activeTodos = localStorage.getItem(STORAGE_KEYS.activeTodos);
  return activeTodos ? JSON.parse(activeTodos) : [];
};

// Save active todos to localStorage
export const saveActiveTodos = (todoIds: string[]): void => {
  localStorage.setItem(STORAGE_KEYS.activeTodos, JSON.stringify(todoIds));
};

// Get entries from localStorage
export const getEntries = (): SavedEntry[] => {
  const entries = localStorage.getItem(STORAGE_KEYS.entries);
  return entries ? JSON.parse(entries) : [];
};

// Save entries to localStorage
export const saveEntries = (entries: SavedEntry[]): void => {
  localStorage.setItem(STORAGE_KEYS.entries, JSON.stringify(entries));
};

// Add a thought entry
export const addThoughtEntry = (text: string): void => {
  const entries = getEntries();
  const newEntry: ThoughtEntry = {
    id: generateId(),
    text,
    createdAt: new Date().toISOString(),
    type: 'thought'
  };
  
  entries.push(newEntry);
  saveEntries(entries);
};

// Add a reflection entry
export const addReflectionEntry = (stressor: string, worstCase: string, resolution: string): void => {
  const entries = getEntries();
  const newEntry: ReflectionEntry = {
    id: generateId(),
    stressor,
    worstCase,
    resolution,
    createdAt: new Date().toISOString(),
    type: 'reflection'
  };
  
  entries.push(newEntry);
  saveEntries(entries);
};

// Get distractions from localStorage or use defaults
export const getDistractions = (): DistractionActivity[] => {
  const distractions = localStorage.getItem(STORAGE_KEYS.distractions);
  return distractions ? JSON.parse(distractions) : DEFAULT_DISTRACTIONS;
};

// Save distractions to localStorage
export const saveDistractions = (distractions: DistractionActivity[]): void => {
  localStorage.setItem(STORAGE_KEYS.distractions, JSON.stringify(distractions));
};

// Get todo sections from localStorage or use defaults
export const getTodoSections = (): string[] => {
  const sections = localStorage.getItem(STORAGE_KEYS.todoSections);
  return sections ? JSON.parse(sections) : DEFAULT_TODO_SECTIONS;
};

// Save todo sections to localStorage
export const saveTodoSections = (sections: string[]): void => {
  localStorage.setItem(STORAGE_KEYS.todoSections, JSON.stringify(sections));
};

// Add a new todo item
export const addTodo = (text: string, importance: 'low' | 'medium' | 'high', section: string): void => {
  const todos = getTodos();
  const newTodo: TodoItem = {
    id: generateId(),
    text,
    completed: false,
    importance,
    subtasks: [],
    section
  };
  
  todos.push(newTodo);
  saveTodos(todos);
};

// Toggle todo completion status
export const toggleTodoCompletion = (id: string): void => {
  const todos = getTodos();
  const todo = todos.find(t => t.id === id);
  
  if (todo) {
    todo.completed = !todo.completed;
    saveTodos(todos);
  }
};

// Add a subtask to a todo
export const addSubtask = (todoId: string, text: string): void => {
  const todos = getTodos();
  const todo = todos.find(t => t.id === todoId);
  
  if (todo) {
    todo.subtasks.push({
      id: generateId(),
      text,
      completed: false
    });
    todo.completed = false;
    
    saveTodos(todos);
  }
};

// Delete an entry
export const deleteEntry = (id: string): void => {
  const entries = getEntries();
  const updatedEntries = entries.filter(entry => entry.id !== id);
  saveEntries(updatedEntries);
};

// Delete all entries
export const deleteAllEntries = (): void => {
  saveEntries([]);
};

// Get mood check-ins from localStorage
export const getMoodCheckIns = (): MoodCheckIn[] => {
  const checkIns = localStorage.getItem(STORAGE_KEYS.moodCheckIns);
  return checkIns ? JSON.parse(checkIns) : [];
};

// Save mood check-ins to localStorage
export const saveMoodCheckIns = (checkIns: MoodCheckIn[]): void => {
  localStorage.setItem(STORAGE_KEYS.moodCheckIns, JSON.stringify(checkIns));
};

// Add a new mood check-in
export const addMoodCheckIn = (mood: MoodLevel, stressors: string[]): void => {
  const checkIns = getMoodCheckIns();
  const newCheckIn: MoodCheckIn = {
    id: generateId(),
    mood,
    stressors,
    timestamp: new Date().toISOString()
  };
  
  checkIns.push(newCheckIn);
  saveMoodCheckIns(checkIns);
  
  // Add each stressor to the stressors tally
  if (stressors.length > 0) {
    stressors.forEach(stressor => {
      addStressor(stressor);
    });
  }
  
  // Update the last check-in time
  setLastMoodCheckInTime();
};

// Get the last mood check-in timestamp
export const getLastMoodCheckInTime = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.lastMoodCheckIn);
};

// Set the last mood check-in timestamp to now
export const setLastMoodCheckInTime = (): void => {
  localStorage.setItem(STORAGE_KEYS.lastMoodCheckIn, new Date().toISOString());
};

// Check if it's time for a mood check-in (1 hour since last check-in)
export const isTimeForMoodCheckIn = (): boolean => {
  const lastCheckIn = getLastMoodCheckInTime();
  
  if (!lastCheckIn) {
    return true;
  }
  
  const lastCheckInTime = new Date(lastCheckIn).getTime();
  const currentTime = new Date().getTime();
  const oneHourInMs = 60 * 60 * 1000;
  
  return currentTime - lastCheckInTime >= oneHourInMs;
};
