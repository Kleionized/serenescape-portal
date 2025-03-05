
import React, { useState, useEffect } from 'react';
import { getActiveTodos, getTodos, saveActiveTodos, toggleTodoCompletion } from '../../lib/storage';
import { TodoItem } from '../../lib/types';
import { Check, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ActiveTodos = () => {
  const [activeTodoIds, setActiveTodoIds] = useState<string[]>([]);
  const [activeTodos, setActiveTodos] = useState<TodoItem[]>([]);
  const [allCompleted, setAllCompleted] = useState(false);
  
  useEffect(() => {
    loadActiveTodos();
  }, []);
  
  const loadActiveTodos = () => {
    const activeIds = getActiveTodos();
    const allTodos = getTodos();
    
    let todos: TodoItem[] = [];
    if (activeIds.length === 0) {
      // If no active todos are set, get three incomplete todos
      todos = allTodos
        .filter(todo => !todo.completed)
        .sort((a, b) => {
          const importanceValue = { high: 3, medium: 2, low: 1 };
          return importanceValue[b.importance] - importanceValue[a.importance];
        })
        .slice(0, 3);
      
      // Save these as active todos
      const newActiveIds = todos.map(todo => todo.id);
      saveActiveTodos(newActiveIds);
      setActiveTodoIds(newActiveIds);
    } else {
      // Get the active todos by IDs
      todos = allTodos.filter(todo => activeIds.includes(todo.id));
      setActiveTodoIds(activeIds);
    }
    
    setActiveTodos(todos);
    setAllCompleted(todos.every(todo => todo.completed) && todos.length > 0);
  };
  
  const handleToggleTodo = (id: string) => {
    toggleTodoCompletion(id);
    
    // Update the local state
    setActiveTodos(prev => 
      prev.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
    
    // Check if all todos are now completed
    setTimeout(() => {
      const updatedTodos = getTodos();
      const currentActiveTodos = updatedTodos.filter(todo => activeTodoIds.includes(todo.id));
      setAllCompleted(currentActiveTodos.every(todo => todo.completed) && currentActiveTodos.length > 0);
    }, 100);
  };
  
  const getImportanceClass = (importance: string): string => {
    switch (importance) {
      case 'high':
        return 'bg-safespace-stress-high/20 text-safespace-stress-high';
      case 'medium':
        return 'bg-safespace-stress-medium/20 text-safespace-stress-medium';
      case 'low':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="glass-card rounded-xl p-6 animate-scale-in">
      <h2 className="heading-sm mb-4">Active To-Dos</h2>
      
      {activeTodos.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-gray-500">No active to-dos yet.</p>
          <p className="text-sm text-gray-400 mt-2">
            <Link to="/todo" className="text-safespace-primary hover:underline">
              Add some tasks
            </Link>{" "}
            to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeTodos.map((todo) => (
            <div
              key={todo.id}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                todo.completed 
                  ? 'bg-gray-50 text-gray-400'
                  : 'bg-white text-gray-800'
              }`}
            >
              <button
                onClick={() => handleToggleTodo(todo.id)}
                className={`flex-shrink-0 w-6 h-6 rounded-full border ${
                  todo.completed
                    ? 'bg-safespace-primary border-safespace-primary text-white'
                    : 'border-gray-300 hover:border-safespace-primary'
                } flex items-center justify-center transition-colors`}
              >
                {todo.completed && <Check className="w-4 h-4" />}
              </button>
              
              <span className={`flex-1 ${todo.completed ? 'line-through' : ''}`}>
                {todo.text}
              </span>
              
              <span className={`pill-tag text-xs ${getImportanceClass(todo.importance)}`}>
                {todo.importance}
              </span>
            </div>
          ))}
        </div>
      )}
      
      {allCompleted && (
        <div className="mt-6 p-4 bg-safespace-primary/10 rounded-lg text-center animate-fade-in">
          <p className="text-safespace-primary font-medium">Great job! All your active tasks are completed.</p>
          <Link
            to="/todo"
            className="mt-3 inline-flex items-center gap-1 text-sm text-safespace-primary hover:underline"
          >
            Select new tasks
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default ActiveTodos;
