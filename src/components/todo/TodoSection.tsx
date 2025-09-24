
import React, { useState } from 'react';
import { TodoItem } from '../../lib/types';
import { ChevronDown, ChevronUp, Plus, X } from 'lucide-react';
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
    <div className="flex flex-col gap-4 rounded-2xl border border-safespace-muted bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <button
          onClick={onToggleSection}
          className="inline-flex items-center gap-2 text-left text-base font-semibold text-safespace-foreground"
        >
          {expanded ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
          <span>{section}</span>
          <span className="rounded-full bg-safespace-muted px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.3em] text-safespace-foreground/50">
            {todos.length} tasks
          </span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActiveSection(section);
              setNewTodoText('');
            }}
            className="inline-flex items-center gap-1 rounded-full border border-safespace-muted px-3 py-1 text-xs font-semibold text-safespace-foreground/60 hover:border-safespace-primary/40 hover:text-safespace-primary"
          >
            <Plus className="h-3.5 w-3.5" />
            add task
          </button>

          <button
            onClick={onShowDeleteAlert}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-safespace-muted text-safespace-foreground/50 hover:border-safespace-primary/40 hover:text-safespace-primary"
            aria-label={`Delete ${section} section`}
          >
            <X className="h-4 w-4" />
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
