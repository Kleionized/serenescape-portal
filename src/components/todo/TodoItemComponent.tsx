import React, { useState } from 'react';
import { TodoItem } from '../../lib/types';
import { Check, ChevronDown, ChevronUp, Plus, Save, X } from 'lucide-react';
import { addSubtask, saveTodos, getTodos } from '../../lib/storage';
import TodoSubtaskList from './TodoSubtaskList';
import { Input } from '@/components/ui/input';

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
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [newSubtaskText, setNewSubtaskText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingText, setEditingText] = useState(todo.text);

  const handleToggleTodo = () => {
    const todos = getTodos();
    const updatedTodos = todos.map((t) =>
      t.id === todo.id
        ? {
            ...t,
            completed: !t.completed
          }
        : t
    );
    saveTodos(updatedTodos);
    onTodosChanged();
  };

  const handleAddSubtask = () => {
    if (!newSubtaskText.trim()) return;
    addSubtask(todo.id, newSubtaskText);
    onTodosChanged();
    setNewSubtaskText('');
    setIsAddingSubtask(false);
  };

  const handleEditStart = () => {
    setIsEditing(true);
    setEditingText(todo.text);
  };

  const handleEditSave = () => {
    if (!editingText.trim()) {
      setIsEditing(false);
      setEditingText(todo.text);
      return;
    }

    const todos = getTodos();
    const updatedTodos = todos.map((t) =>
      t.id === todo.id
        ? {
            ...t,
            text: editingText.trim()
          }
        : t
    );
    saveTodos(updatedTodos);
    onTodosChanged();
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditingText(todo.text);
  };

  const getImportanceClass = (importance: string): string => {
    switch (importance) {
      case 'high':
        return 'text-safespace-stress-high';
      case 'medium':
        return 'text-safespace-stress-medium';
      case 'low':
        return 'text-safespace-foreground/60';
      default:
        return 'text-safespace-foreground/60';
    }
  };

  return (
    <div className="card-section p-5 text-sm">
      <div className="flex items-start gap-4">
        <button
          onClick={handleToggleTodo}
          className={`mt-1 flex h-6 w-6 items-center justify-center rounded-full border text-xs transition ${
            todo.completed
              ? 'border-safespace-primary bg-safespace-primary text-white'
              : 'border-safespace-muted/70 bg-white text-safespace-foreground hover:border-safespace-primary/40 dark:border-white/15 dark:bg-slate-950/60 dark:text-slate-100'
          }`}
          aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {todo.completed && <Check className="h-3.5 w-3.5" />}
        </button>

        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            {isEditing ? (
              <div className="flex flex-1 items-center gap-2">
                <Input
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="h-10 flex-1 rounded-xl border border-safespace-muted/60 text-sm dark:border-white/15 dark:bg-slate-950/70 dark:text-slate-100"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleEditSave();
                    } else if (e.key === 'Escape') {
                      handleEditCancel();
                    }
                  }}
                />
                <button
                  onClick={handleEditSave}
                  className="text-safespace-primary transition hover:text-safespace-primary/80"
                >
                  <Save className="h-4 w-4" />
                </button>
                <button
                  onClick={handleEditCancel}
                  className="text-safespace-foreground/50 transition hover:text-safespace-primary"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <p
                className={`flex-1 leading-relaxed ${
                  todo.completed
                    ? 'line-through text-safespace-foreground/40 dark:text-slate-500'
                    : 'text-safespace-foreground dark:text-slate-100'
                }`}
                onDoubleClick={handleEditStart}
              >
                {todo.text}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-safespace-background/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-safespace-foreground/55 dark:bg-slate-900/70 dark:text-slate-200">
                {todo.section}
              </span>
              <span
                className={`rounded-full border border-safespace-muted px-3 py-1 text-[11px] uppercase tracking-[0.25em] ${getImportanceClass(todo.importance)} dark:border-white/15`}
              >
                {todo.importance}
              </span>
              {!isEditing && (
                <button
                  onClick={onSetActive}
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] transition ${
                    isActive
                      ? 'bg-safespace-primary text-white'
                      : 'bg-white/80 text-safespace-foreground/60 ring-1 ring-safespace-muted/60 hover:text-safespace-foreground dark:bg-slate-950/60 dark:text-slate-200 dark:ring-white/15 dark:hover:text-slate-100'
                  }`}
                >
                  {isActive ? 'in focus' : 'set focus'}
                </button>
              )}
            </div>
          </div>

          {todo.subtasks.length > 0 && !isEditing && (
            <div className="space-y-2">
              <button
                onClick={onToggleExpand}
                className="inline-flex items-center gap-1 text-xs font-semibold text-safespace-foreground/55 transition hover:text-safespace-primary dark:text-slate-300"
              >
                {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                steps
              </button>
              {isExpanded && (
                <TodoSubtaskList
                  todoId={todo.id}
                  subtasks={todo.subtasks}
                  onSubtasksChanged={onTodosChanged}
                />
              )}
            </div>
          )}

          {!isEditing && (
            <div>
              {isAddingSubtask ? (
                <input
                  type="text"
                  value={newSubtaskText}
                  onChange={(e) => setNewSubtaskText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddSubtask();
                    } else if (e.key === 'Escape') {
                      setIsAddingSubtask(false);
                      setNewSubtaskText('');
                    }
                  }}
                  className="input-surface w-full text-xs"
                  placeholder="Press enter to save, esc to cancel"
                  autoFocus
                />
              ) : (
                <button
                  onClick={() => {
                    setIsAddingSubtask(true);
                    setNewSubtaskText('');
                  }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-safespace-foreground/50 transition hover:text-safespace-primary dark:text-slate-300 dark:hover:text-safespace-primary"
                >
                  <Plus className="h-3 w-3" />
                  add step
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoItemComponent;
