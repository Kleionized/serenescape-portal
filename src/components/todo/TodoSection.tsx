
import React, { useState } from 'react';
import { TodoItem } from '../../lib/types';
import { ChevronDown, ChevronUp, Plus, X, AlertTriangle } from 'lucide-react';
import TodoList from './TodoList';
import AddTodoForm from './AddTodoForm';
import DeleteSectionAlert from './DeleteSectionAlert';
import { addTodo } from '../../lib/storage';

interface TodoSectionProps {
  section: string;
  todos: TodoItem[];
  expanded: boolean;
  activeTodoIds: string[];
  showDeleteAlert: boolean;
  onToggleSection: () => void;
  onSetActiveTodo: (todoId: string) => void;
  onShowDeleteAlert: () => void;
  onCancelDelete: () => void;
  onDelete: () => void;
  onTodosChanged: () => void;
}

const TodoSection: React.FC<TodoSectionProps> = ({
  section,
  todos,
  expanded,
  activeTodoIds,
  showDeleteAlert,
  onToggleSection,
  onSetActiveTodo,
  onShowDeleteAlert,
  onCancelDelete,
  onDelete,
  onTodosChanged
}) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [newTodoText, setNewTodoText] = useState('');
  const [newTodoImportance, setNewTodoImportance] = useState<'low' | 'medium' | 'high'>('medium');

  const handleAddTodo = () => {
    if (!newTodoText.trim() || !activeSection) return;
    addTodo(newTodoText, newTodoImportance, activeSection);
    onTodosChanged();
    setNewTodoText('');
    setActiveSection(null);
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2 dark:border-gray-700">
        <button onClick={onToggleSection} className="inline-flex items-center gap-2 text-lg font-medium text-safespace-foreground hover:text-safespace-primary transition-colors">
          {expanded ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          <span>{section}</span>
        </button>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              setActiveSection(section);
              setNewTodoText('');
            }} 
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors dark:bg-black/90 dark:text-white dark:hover:bg-black/70 dark:border dark:border-gray-700"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
          
          <button onClick={onShowDeleteAlert} className="inline-flex items-center justify-center p-1.5 rounded-md text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/30">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {showDeleteAlert && (
        <DeleteSectionAlert 
          section={section} 
          onCancel={onCancelDelete} 
          onDelete={onDelete} 
        />
      )}
      
      {activeSection === section && (
        <AddTodoForm
          section={section}
          text={newTodoText}
          importance={newTodoImportance}
          onTextChange={setNewTodoText}
          onImportanceChange={setNewTodoImportance}
          onAdd={handleAddTodo}
          onCancel={() => setActiveSection(null)}
        />
      )}
      
      {expanded && (
        <TodoList 
          todos={todos} 
          activeTodoIds={activeTodoIds} 
          onSetActiveTodo={onSetActiveTodo}
          onTodosChanged={onTodosChanged}
        />
      )}
    </div>
  );
};

export default TodoSection;
