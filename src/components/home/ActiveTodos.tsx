import React, { useState, useEffect } from 'react';
import { getActiveTodos, getTodos, saveActiveTodos, toggleTodoCompletion, deleteCompletedTodos } from '../../lib/storage';
import { TodoItem } from '../../lib/types';
import { Check, ChevronRight, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

const ActiveTodos = () => {
  const [activeTodoIds, setActiveTodoIds] = useState<string[]>([]);
  const [activeTodos, setActiveTodos] = useState<TodoItem[]>([]);
  const [allCompleted, setAllCompleted] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    loadActiveTodos();
  }, []);
  
  const loadActiveTodos = () => {
    const activeIds = getActiveTodos();
    const allTodos = getTodos();
    
    let todos: TodoItem[] = [];
    if (activeIds.length === 0) {
      todos = allTodos
        .filter(todo => !todo.completed)
        .sort((a, b) => {
          const importanceValue = { high: 3, medium: 2, low: 1 };
          return importanceValue[b.importance] - importanceValue[a.importance];
        })
        .slice(0, 3);
      
      const newActiveIds = todos.map(todo => todo.id);
      saveActiveTodos(newActiveIds);
      setActiveTodoIds(newActiveIds);
    } else {
      todos = allTodos.filter(todo => activeIds.includes(todo.id));
      setActiveTodoIds(activeIds);
    }
    
    setActiveTodos(todos);
    setAllCompleted(todos.every(todo => todo.completed) && todos.length > 0);
  };
  
  const handleToggleTodo = (id: string) => {
    toggleTodoCompletion(id);
    
    setActiveTodos(prev => 
      prev.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
    
    setTimeout(() => {
      const updatedTodos = getTodos();
      const currentActiveTodos = updatedTodos.filter(todo => activeTodoIds.includes(todo.id));
      setAllCompleted(currentActiveTodos.every(todo => todo.completed) && currentActiveTodos.length > 0);
    }, 100);
  };
  
  const handleDeleteCompleted = () => {
    const completedCount = activeTodos.filter(todo => todo.completed).length;
    if (completedCount === 0) {
      toast({
        title: "No completed tasks",
        description: "There are no completed tasks to delete.",
      });
      return;
    }
    
    deleteCompletedTodos();
    loadActiveTodos();
    
    toast({
      title: "Tasks deleted",
      description: `${completedCount} completed ${completedCount === 1 ? 'task' : 'tasks'} deleted successfully.`,
    });
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
    <div className="h-full flex flex-col animate-scale-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="heading-sm">Active To-Dos</h2>
        
        {activeTodos.some(todo => todo.completed) && (
          <button
            onClick={handleDeleteCompleted}
            className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            <span>Delete Completed</span>
          </button>
        )}
      </div>
      
      {activeTodos.length === 0 ? (
        <div className="text-center py-6 flex-1 flex flex-col justify-center">
          <p className="text-safespace-foreground dark:text-white">No active to-dos yet.</p>
          <p className="text-sm text-safespace-foreground dark:text-white/80 mt-2">
            <Link to="/todo" className="text-safespace-primary hover:underline">
              Add some tasks
            </Link>{" "}
            to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-4 flex-1 overflow-y-auto pr-2">
          {activeTodos.map((todo) => (
            <div
              key={todo.id}
              className={`flex items-center gap-3 py-3 px-3 rounded-lg transition-all ${
                todo.completed 
                  ? 'bg-gray-50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-400'
                  : 'bg-white/50 dark:bg-gray-800/30 text-gray-800 dark:text-white'
              }`}
            >
              <button
                onClick={() => handleToggleTodo(todo.id)}
                className={`flex-shrink-0 w-6 h-6 rounded-full border ${
                  todo.completed
                    ? 'bg-safespace-primary border-safespace-primary text-white'
                    : 'border-gray-300 dark:border-gray-600 hover:border-safespace-primary'
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
        <div className="mt-auto pt-4 p-4 bg-safespace-primary/10 dark:bg-safespace-primary/20 rounded-lg text-center animate-fade-in">
          <p className="text-safespace-primary font-medium">Great job! All your active tasks are completed.</p>
          <div className="mt-3 flex justify-center gap-3">
            <button
              onClick={handleDeleteCompleted}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Completed</span>
            </button>
            <Link
              to="/todo"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm bg-safespace-primary text-white hover:bg-safespace-primary/90 transition-colors"
            >
              Select new tasks
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveTodos;
