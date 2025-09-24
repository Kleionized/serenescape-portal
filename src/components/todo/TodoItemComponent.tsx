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
  const [activeTodoId, setActiveTodoId] = useState<string | null>(null);
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
    if (!newSubtaskText.trim() || !activeTodoId) return;
    addSubtask(activeTodoId, newSubtaskText);
    onTodosChanged();
    setNewSubtaskText('');
    setActiveTodoId(null);
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
    <div className="rounded-2xl border border-safespace-muted/60 bg-white/90 p-5 text-sm shadow-sm backdrop-blur">
      <div className="flex items-start gap-4">
        <button
          onClick={handleToggleTodo}
          className={`mt-1 flex h-6 w-6 items-center justify-center rounded-full border text-xs transition ${
            todo.completed
              ? 'border-safespace-primary bg-safespace-primary text-white'
              : 'border-safespace-muted/70 bg-white text-safespace-foreground hover:border-safespace-primary/40'
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
                  className="h-10 flex-1 rounded-xl border border-safespace-muted/60 text-sm"
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
                    ? 'line-through text-safespace-foreground/40'
                    : 'text-safespace-foreground'
                }`}
                onDoubleClick={handleEditStart}
              >
                {todo.text}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-safespace-background/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-safespace-foreground/55">
                {todo.section}
              </span>
              <span
                className={`rounded-full border border-safespace-muted px-3 py-1 text-[11px] uppercase tracking-[0.25em] ${getImportanceClass(todo.importance)}`}
              >
                {todo.importance}
              </span>
              {!isEditing && (
                <button
                  onClick={onSetActive}
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] transition ${
                    isActive
                      ? 'bg-safespace-primary text-white'
                      : 'bg-white/80 text-safespace-foreground/60 ring-1 ring-safespace-muted/60 hover:text-safespace-foreground'
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
                className="inline-flex items-center gap-1 text-xs font-semibold text-safespace-foreground/55 transition hover:text-safespace-primary"
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
              {activeTodoId === todo.id ? (
                <div className="flex flex-wrap items-center gap-2 rounded-xl border border-safespace-muted/60 bg-white/70 px-3 py-2">
                  <input
                    type="text"
                    value={newSubtaskText}
                    onChange={(e) => setNewSubtaskText(e.target.value)}
                    placeholder="Add a gentle next step"
                    className="min-w-[160px] flex-1 border-0 bg-transparent text-xs text-safespace-foreground placeholder:text-safespace-foreground/40 focus:outline-none"
                  />
                  <button
                    onClick={handleAddSubtask}
                    disabled={!newSubtaskText.trim()}
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] transition ${
                      !newSubtaskText.trim()
                        ? 'bg-safespace-muted text-safespace-foreground/40'
                        : 'bg-safespace-primary text-safespace-primary-foreground hover:bg-safespace-primary/90'
                    }`}
                  >
                    add
                  </button>
                  <button
                    onClick={() => setActiveTodoId(null)}
                    className="px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-safespace-foreground/50 transition hover:text-safespace-primary"
                  >
                    cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setActiveTodoId(todo.id);
                    setNewSubtaskText('');
                  }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-safespace-foreground/50 transition hover:text-safespace-primary"
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
