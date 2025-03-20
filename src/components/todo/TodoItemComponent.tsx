
import React, { useState } from 'react';
import { TodoItem } from '../../lib/types';
import { Check, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { addSubtask, saveTodos, getTodos } from '../../lib/storage';
import TodoSubtaskList from './TodoSubtaskList';

interface TodoItemComponentProps {
  todo: TodoItem;
  isActive: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onSetActive: () => void;
  onTodosChanged: () => void;
}

const TodoItemComponent: React.FC<TodoItemComponentProps> = ({
  todo,
  isActive,
  isExpanded,
  onToggleExpand,
  onSetActive,
  onTodosChanged
}) => {
  const [activeTodoId, setActiveTodoId] = useState<string | null>(null);
  const [newSubtaskText, setNewSubtaskText] = useState('');

  const handleToggleTodo = () => {
    const todos = getTodos();
    const updatedTodos = todos.map(t => t.id === todo.id ? {
      ...t,
      completed: !t.completed
    } : t);
    saveTodos(updatedTodos);
    onTodosChanged();
  };

  const handleAddSubtask = () => {
    if (!newSubtaskText.trim() || !activeTodoId) return;
    addSubtask(activeTodoId, newSubtaskText);
    onTodosChanged();
    setNewSubtaskText('');
    setActiveTodoId(null);
  };

  const getImportanceClass = (importance: string): string => {
    switch (importance) {
      case 'high':
        return 'text-gray-500 dark:text-gray-400';
      case 'medium':
        return 'text-gray-500 dark:text-gray-400';
      case 'low':
        return 'text-gray-500 dark:text-gray-400';
      default:
        return 'text-gray-500 dark:text-gray-400';
    }
  };

  return (
    <div className={`border border-gray-100 dark:border-gray-800 rounded-lg ${todo.completed ? 'bg-gray-50/50 dark:bg-black/10' : 'bg-white/50 dark:bg-black/5'}`}>
      <div className="p-4 flex items-start gap-3">
        <button 
          onClick={handleToggleTodo} 
          className={`flex-shrink-0 w-6 h-6 mt-0.5 rounded-full border ${todo.completed ? 'border-gray-300 bg-gray-100 text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400' : 'border-gray-300 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600'} flex items-center justify-center transition-colors`}
        >
          {todo.completed && <Check className="w-4 h-4" />}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <p className={`text-safespace-foreground ${todo.completed ? 'line-through text-gray-400 dark:text-gray-500' : ''}`}>
              {todo.text}
            </p>
            
            <div className="flex items-center gap-2 ml-2">
              <span className={`text-xs ${getImportanceClass(todo.importance)}`}>
                {todo.importance}
              </span>
              
              <div className="relative">
                <button 
                  onClick={onSetActive} 
                  className={`px-2 py-1 text-xs ${isActive ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'}`}
                >
                  {isActive ? 'Active' : 'Set Active'}
                </button>
              </div>
            </div>
          </div>
          
          {todo.subtasks.length > 0 && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Steps</h4>
                <button onClick={onToggleExpand} className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
              
              {isExpanded && (
                <TodoSubtaskList 
                  todoId={todo.id}
                  subtasks={todo.subtasks}
                  onSubtasksChanged={onTodosChanged}
                />
              )}
            </div>
          )}
          
          <div className="mt-3">
            {activeTodoId === todo.id ? (
              <div className="flex gap-2 items-center animate-fade-in">
                <input 
                  type="text" 
                  value={newSubtaskText} 
                  onChange={e => setNewSubtaskText(e.target.value)} 
                  placeholder="Add a step..." 
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-600 dark:bg-black/30 dark:text-white dark:placeholder-gray-400" 
                />
                <button 
                  onClick={handleAddSubtask} 
                  disabled={!newSubtaskText.trim()} 
                  className={`px-3 py-1.5 rounded-md text-xs transition-colors ${!newSubtaskText.trim() ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}`}
                >
                  Add
                </button>
                <button 
                  onClick={() => setActiveTodoId(null)} 
                  className="px-2 py-1.5 rounded-md text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button 
                onClick={() => {
                  setActiveTodoId(todo.id);
                  setNewSubtaskText('');
                }} 
                className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              >
                <Plus className="w-3 h-3" />
                <span>Add Step</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoItemComponent;
