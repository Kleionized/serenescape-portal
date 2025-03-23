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
    <div className="pl-2 border-l-2 border-gray-200 space-y-2 my-2 dark:border-gray-700">
      {subtasks.map(subtask => (
        <div key={subtask.id} className="flex items-start gap-2">
          <button 
            onClick={() => handleToggleSubtask(subtask.id)} 
            className={`flex-shrink-0 w-4 h-4 mt-1 rounded-sm border ${subtask.completed ? 'bg-safespace-primary border-safespace-primary text-white' : 'border-gray-300 hover:border-safespace-primary dark:border-gray-600'} flex items-center justify-center transition-colors`}
          >
            {subtask.completed && <Check className="w-3 h-3" />}
          </button>
          
          {editingSubtaskId === subtask.id ? (
            <div className="flex-1 flex items-center gap-2">
              <Input
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                className="h-8 text-sm py-1 flex-1"
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
                className="text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300"
              >
                <Save className="w-4 h-4" />
              </button>
              <button 
                onClick={handleEditCancel}
                className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <span 
              className={`text-sm flex-1 ${subtask.completed ? 'line-through text-safespace-foreground/60' : 'text-safespace-foreground'}`}
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
