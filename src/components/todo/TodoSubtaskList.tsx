
import React from 'react';
import { Check } from 'lucide-react';
import { getTodos, saveTodos } from '../../lib/storage';

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
          <span className={`text-sm ${subtask.completed ? 'line-through text-safespace-foreground/60' : 'text-safespace-foreground'}`}>
            {subtask.text}
          </span>
        </div>
      ))}
    </div>
  );
};

export default TodoSubtaskList;
