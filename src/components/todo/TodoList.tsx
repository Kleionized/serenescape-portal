import React, { useState } from 'react';
import { TodoItem } from '../../lib/types';
import TodoItemComponent from './TodoItemComponent';
interface TodoListProps {
  todos: TodoItem[];
  activeTodoIds: string[];
  onSetActiveTodo: (todoId: string) => void;
  onTodosChanged: () => void;
}
const TodoList: React.FC<TodoListProps> = ({
  todos,
  activeTodoIds,
  onSetActiveTodo,
  onTodosChanged
}) => {
  const [expandedTodos, setExpandedTodos] = useState<string[]>([]);
  const handleToggleTodoExpand = (todoId: string) => {
    if (expandedTodos.includes(todoId)) {
      setExpandedTodos(expandedTodos.filter(id => id !== todoId));
    } else {
      setExpandedTodos([...expandedTodos, todoId]);
    }
  };
  if (todos.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-safespace-muted/60 bg-white/70 px-6 py-12 text-center text-sm text-safespace-foreground/60">
        Nothing here yet—add a task when you feel ready.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TodoItemComponent
          key={todo.id}
          todo={todo}
          isActive={activeTodoIds.includes(todo.id)}
          isExpanded={expandedTodos.includes(todo.id)}
          onToggleExpand={() => handleToggleTodoExpand(todo.id)}
          onSetActive={() => onSetActiveTodo(todo.id)}
          onTodosChanged={onTodosChanged}
        />
      ))}
    </div>
  );
};
export default TodoList;
