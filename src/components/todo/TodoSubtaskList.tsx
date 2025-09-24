import React, { useState } from 'react';
import { Check, Save, X } from 'lucide-react';
import { getTodos, saveTodos } from '../../lib/storage';
import { Input } from '@/components/ui/input';

interface TodoSubtaskListProps {
  todoId: string;
  subtasks: {
    id: string;
    text: string;
    completed: boolean;
  }[];
  onSubtasksChanged: () => void;
}

const TodoSubtaskList: React.FC<TodoSubtaskListProps> = ({
  todoId,
  subtasks,
  onSubtasksChanged
}) => {
  const [editingSubtaskId, setEditingSubtaskId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  const handleToggleSubtask = (subtaskId: string) => {
    const todos = getTodos();
    const updatedTodos = todos.map(todo => {
      if (todo.id === todoId) {
        const updatedSubtasks = todo.subtasks.map(subtask => 
          subtask.id === subtaskId ? {
            ...subtask,
            completed: !subtask.completed
          } : subtask
        );
        return {
          ...todo,
          subtasks: updatedSubtasks
        };
      }
      return todo;
    });
    saveTodos(updatedTodos);
    onSubtasksChanged();
  };

  const handleEditStart = (subtaskId: string, currentText: string) => {
    setEditingSubtaskId(subtaskId);
    setEditingText(currentText);
  };

  const handleEditCancel = () => {
    setEditingSubtaskId(null);
    setEditingText('');
  };

  const handleEditSave = (subtaskId: string) => {
    if (!editingText.trim()) {
      handleEditCancel();
      return;
    }

    const todos = getTodos();
    const updatedTodos = todos.map(todo => {
      if (todo.id === todoId) {
        const updatedSubtasks = todo.subtasks.map(subtask => 
          subtask.id === subtaskId ? {
            ...subtask,
            text: editingText.trim()
          } : subtask
        );
        return {
          ...todo,
          subtasks: updatedSubtasks
        };
      }
      return todo;
    });
    saveTodos(updatedTodos);
    onSubtasksChanged();
    setEditingSubtaskId(null);
    setEditingText('');
  };

  return (
    <div className="my-2 space-y-2 border-l border-safespace-muted pl-3">
      {subtasks.map((subtask) => (
        <div key={subtask.id} className="flex items-start gap-2 rounded-lg bg-safespace-muted px-3 py-2">
          <button
            onClick={() => handleToggleSubtask(subtask.id)}
            className={`mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border ${
              subtask.completed
                ? 'border-safespace-primary bg-safespace-primary text-white'
                : 'border-safespace-muted text-safespace-primary'
            }`}
            aria-label={subtask.completed ? 'Mark step as incomplete' : 'Mark step as complete'}
          >
            {subtask.completed && <Check className="h-3 w-3" />}
          </button>

          {editingSubtaskId === subtask.id ? (
            <div className="flex flex-1 items-center gap-2">
              <Input
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                className="h-8 flex-1 rounded-lg border border-safespace-muted text-xs"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleEditSave(subtask.id);
                  } else if (e.key === 'Escape') {
                    handleEditCancel();
                  }
                }}
              />
              <button
                onClick={() => handleEditSave(subtask.id)}
                className="text-safespace-primary hover:text-safespace-primary/70"
              >
                <Save className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={handleEditCancel}
                className="text-safespace-foreground/50 hover:text-safespace-primary"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <span
              className={`flex-1 text-xs ${subtask.completed ? 'line-through text-safespace-foreground/50' : 'text-safespace-foreground'}`}
              onDoubleClick={() => handleEditStart(subtask.id, subtask.text)}
            >
              {subtask.text}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default TodoSubtaskList;
