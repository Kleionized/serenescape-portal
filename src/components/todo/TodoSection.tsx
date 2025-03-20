
import React, { useState } from 'react';
import { TodoItem } from '../../lib/types';
import { ChevronDown, ChevronUp, Plus, X } from 'lucide-react';
import TodoList from './TodoList';
import AddTodoForm from './AddTodoForm';
import DeleteSectionAlert from './DeleteSectionAlert';
import { addTodo } from '../../lib/storage';
import { Separator } from '@/components/ui/separator';

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
      <div className="flex justify-between items-center mb-4 pb-2">
        <button onClick={onToggleSection} className="inline-flex items-center gap-2 text-lg font-medium text-safespace-foreground hover:text-gray-500 dark:hover:text-gray-300 transition-colors">
          {expanded ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          <span>{section}</span>
        </button>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              setActiveSection(section);
              setNewTodoText('');
            }} 
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
          
          <button onClick={onShowDeleteAlert} className="inline-flex items-center justify-center p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {section !== 'Completed' && <Separator className="mb-4 dark:bg-gray-700" />}
      
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
