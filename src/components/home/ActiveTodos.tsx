import React, { useState, useEffect } from 'react';
import { getActiveTodos, getTodos, saveActiveTodos, toggleTodoCompletion, deleteCompletedTodos } from '../../lib/storage';
import { TodoItem } from '../../lib/types';
import { Check, ChevronDown, ChevronRight, ChevronUp, Trash2, ListTodo, Sparkle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import TodoSubtaskList from '../todo/TodoSubtaskList';

const ActiveTodos = () => {
  const [activeTodoIds, setActiveTodoIds] = useState<string[]>([]);
  const [activeTodos, setActiveTodos] = useState<TodoItem[]>([]);
  const [allCompleted, setAllCompleted] = useState(false);
  const [expandedTodos, setExpandedTodos] = useState<string[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    loadActiveTodos();
  }, []);
  
  const loadActiveTodos = () => {
    const activeIds = getActiveTodos();
    const allTodos = getTodos();
    let todos: TodoItem[] = [];
    if (activeIds.length === 0) {
      todos = allTodos.filter(todo => !todo.completed).sort((a, b) => {
        const importanceValue = {
          high: 3,
          medium: 2,
          low: 1
        };
        return importanceValue[b.importance] - importanceValue[a.importance];
      }).slice(0, 3);
      const newActiveIds = todos.map(todo => todo.id);
      saveActiveTodos(newActiveIds);
      setActiveTodoIds(newActiveIds);
    } else {
      todos = allTodos.filter(todo => activeIds.includes(todo.id));
      setActiveTodoIds(activeIds);
    }
    setActiveTodos(todos);
    setAllCompleted(todos.every(todo => todo.completed) && todos.length > 0);
  };
  
  const handleToggleTodo = (id: string) => {
    toggleTodoCompletion(id);
    setActiveTodos(prev => prev.map(todo => todo.id === id ? {
      ...todo,
      completed: !todo.completed
    } : todo));
    setTimeout(() => {
      const updatedTodos = getTodos();
      const currentActiveTodos = updatedTodos.filter(todo => activeTodoIds.includes(todo.id));
      setAllCompleted(currentActiveTodos.every(todo => todo.completed) && currentActiveTodos.length > 0);
    }, 100);
  };
  
  const handleDeleteCompleted = () => {
    const completedCount = activeTodos.filter(todo => todo.completed).length;
    if (completedCount === 0) {
      toast({
        title: "No completed tasks",
        description: "There are no completed tasks to delete."
      });
      return;
    }
    deleteCompletedTodos();
    loadActiveTodos();
    toast({
      title: "Tasks deleted",
      description: `${completedCount} completed ${completedCount === 1 ? 'task' : 'tasks'} deleted successfully.`
    });
  };
  
  const getImportanceClass = (importance: string): string => {
    switch (importance) {
      case 'high':
        return 'text-safespace-stress-high';
      case 'medium':
        return 'text-safespace-stress-medium';
      case 'low':
        return 'text-safespace-foreground/50';
      default:
        return 'text-safespace-foreground/50';
    }
  };
  
  const toggleExpandTodo = (todoId: string) => {
    setExpandedTodos(prev => 
      prev.includes(todoId) 
        ? prev.filter(id => id !== todoId) 
        : [...prev, todoId]
    );
  };

  const totalCompleted = activeTodos.filter((todo) => todo.completed).length;

  const panelMinHeight = activeTodos.length === 0
    ? '20rem'
    : activeTodos.length <= 2
      ? '26rem'
      : '32rem';

  return (
    <div className="flex h-full flex-col gap-6" style={{ minHeight: panelMinHeight }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm font-medium text-safespace-foreground/70 dark:text-slate-200">
          <ListTodo className="h-4 w-4 text-amber-500" />
          <span>Today’s focus</span>
        </div>
        {activeTodos.some((todo) => todo.completed) && (
          <button
            onClick={handleDeleteCompleted}
            className="text-xs font-semibold text-safespace-primary transition hover:text-safespace-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-safespace-primary/60"
          >
            Clear completed
          </button>
        )}
      </div>

      <p className="text-xs uppercase tracking-[0.3em] text-safespace-foreground/40 dark:text-slate-400">
        {activeTodos.length === 0 ? 'No active tasks' : `${totalCompleted}/${activeTodos.length} complete`}
      </p>

      {activeTodos.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-safespace-muted px-6 py-8 text-center text-sm text-safespace-foreground/60 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-300">
          <Sparkle className="mb-2 h-6 w-6 text-safespace-secondary dark:text-safespace-primary/80" />
          Nothing selected yet.
          <Link to="/todo" className="mt-2 text-xs font-semibold text-safespace-primary hover:underline">
            Choose a focus from the board
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {activeTodos.map((todo) => {
            const isExpanded = expandedTodos.includes(todo.id);
            return (
              <div key={todo.id} className="card-section card-section-hover">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleToggleTodo(todo.id)}
                    className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded border ${
                      todo.completed
                        ? 'border-safespace-primary bg-safespace-primary text-white'
                        : 'border-safespace-muted text-safespace-foreground'
                    }`}
                    aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    {todo.completed && <Check className="h-3 w-3" />}
                  </button>
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`flex-1 ${todo.completed ? 'line-through text-safespace-foreground/40 dark:text-slate-500' : 'text-safespace-foreground dark:text-slate-100'}`}>
                        {todo.text}
                      </span>
                      <span className={`rounded-full border border-safespace-muted px-2 py-0.5 text-[11px] uppercase tracking-[0.25em] ${getImportanceClass(todo.importance)} dark:border-white/15 dark:text-slate-200`}>
                        {todo.importance}
                      </span>
                    </div>
                    {todo.subtasks.length > 0 && (
                      <button
                        onClick={() => toggleExpandTodo(todo.id)}
                        className="inline-flex items-center gap-1 text-xs text-safespace-foreground/50 transition hover:text-safespace-primary dark:text-slate-300 dark:hover:text-safespace-primary"
                      >
                        {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                        subtasks
                      </button>
                    )}
                  </div>
                </div>
                {isExpanded && todo.subtasks.length > 0 && (
                  <div className="mt-3 border-t border-safespace-muted pt-3 dark:border-white/10">
                    <TodoSubtaskList todoId={todo.id} subtasks={todo.subtasks} onSubtasksChanged={loadActiveTodos} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {allCompleted && activeTodos.length > 0 && (
        <div className="rounded-xl border border-safespace-muted bg-white px-4 py-3 text-center text-xs text-safespace-foreground/60 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-300">
          Everything here is wrapped up. Pick a new focus from the board when you’re ready.
          <Link to="/todo" className="ml-1 font-semibold text-safespace-primary hover:underline">
            Open board
          </Link>
        </div>
      )}
    </div>
  );
};
export default ActiveTodos;
