
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
    <div className={`border rounded-lg ${todo.completed ? 'bg-gray-50 border-gray-200 dark:bg-black/40 dark:border-gray-700' : 'bg-white border-gray-200 dark:bg-black/20 dark:border-gray-700'}`}>
      <div className="p-4 flex items-start gap-3">
        <button 
          onClick={handleToggleTodo} 
          className={`flex-shrink-0 w-6 h-6 mt-0.5 rounded-full border ${todo.completed ? 'bg-safespace-primary border-safespace-primary text-white' : 'border-gray-300 hover:border-safespace-primary dark:border-gray-600'} flex items-center justify-center transition-colors`}
        >
          {todo.completed && <Check className="w-4 h-4" />}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <p className={`text-safespace-foreground ${todo.completed ? 'line-through text-safespace-foreground/60' : ''}`}>
              {todo.text}
            </p>
            
            <div className="flex items-center gap-2 ml-2">
              <span className={`pill-tag text-xs ${getImportanceClass(todo.importance)}`}>
                {todo.importance}
              </span>
              
              <div className="relative">
                <button 
                  onClick={onSetActive} 
                  className={`px-2 py-1 rounded text-xs font-medium ${isActive ? 'bg-safespace-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-black/80 dark:text-white dark:hover:bg-black/60 dark:border dark:border-gray-700'}`}
                >
                  {isActive ? 'Active' : 'Set Active'}
                </button>
              </div>
            </div>
          </div>
          
          {todo.subtasks.length > 0 && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-safespace-foreground">Steps</h4>
                <button onClick={onToggleExpand} className="text-safespace-foreground/70 hover:text-safespace-foreground">
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
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-safespace-primary dark:bg-black/80 dark:border-gray-700 dark:text-white dark:placeholder-gray-400" 
                />
                <button 
                  onClick={handleAddSubtask} 
                  disabled={!newSubtaskText.trim()} 
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${!newSubtaskText.trim() ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500' : 'bg-safespace-primary text-white hover:bg-safespace-primary/90 dark:bg-black/90 dark:hover:bg-black/70 dark:border dark:border-gray-700'}`}
                >
                  Add
                </button>
                <button 
                  onClick={() => setActiveTodoId(null)} 
                  className="inline-flex items-center justify-center px-2 py-1.5 rounded-md text-xs border border-gray-300 text-gray-700 hover:bg-gray-100 dark:bg-black/80 dark:border-gray-700 dark:text-white dark:hover:bg-gray-900"
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
                className="inline-flex items-center gap-1 text-xs text-safespace-primary hover:underline dark:text-safespace-primary/90"
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
