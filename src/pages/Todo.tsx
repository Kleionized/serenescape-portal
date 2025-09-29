import React, { useState, useEffect, useMemo } from 'react';
import PageContainer from '../components/layout/PageContainer';
import {
  getTodos,
  getTodoSections,
  saveActiveTodos,
  deleteCompletedTodos,
  addTodo,
  saveTodoSections,
  saveTodos
} from '../lib/storage';
import { useToast } from '@/hooks/use-toast';
import TodoList from '../components/todo/TodoList';
import { TodoItem } from '../lib/types';
import { Trash2, Plus, ListTodo, Sparkles } from 'lucide-react';

const Todo = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [sections, setSections] = useState<string[]>([]);
  const [activeTodoIds, setActiveTodoIds] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [isManagingTags, setIsManagingTags] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskImportance, setNewTaskImportance] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTaskTag, setNewTaskTag] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    loadTodos();
    loadSections();
  }, []);

  useEffect(() => {
    if (selectedTag !== 'all' && !sections.includes(selectedTag)) {
      setSelectedTag('all');
    }

    if (!newTaskTag && sections.length > 0) {
      setNewTaskTag(sections[0]);
    }
  }, [sections, selectedTag, newTaskTag]);

  const loadTodos = () => {
    const loadedTodos = getTodos();
    setTodos(loadedTodos);
    const loadedActiveTodoIds = localStorage.getItem('safespace_active_todos');
    setActiveTodoIds(loadedActiveTodoIds ? JSON.parse(loadedActiveTodoIds) : []);
  };

  const loadSections = () => {
    const loadedSections = getTodoSections();
    setSections(loadedSections);
  };

  const handleSetActiveTodo = (todoId: string) => {
    const newActiveTodos = [...activeTodoIds];
    if (newActiveTodos.includes(todoId)) {
      const index = newActiveTodos.indexOf(todoId);
      newActiveTodos.splice(index, 1);
    } else {
      if (newActiveTodos.length < 3) {
        newActiveTodos.push(todoId);
      } else {
        newActiveTodos.shift();
        newActiveTodos.push(todoId);
      }
    }
    saveActiveTodos(newActiveTodos);
    setActiveTodoIds(newActiveTodos);
  };

  const handleDeleteCompletedTodos = () => {
    const completedCount = todos.filter((todo) => todo.completed).length;
    if (completedCount === 0) {
      toast({
        title: "No completed tasks",
        description: "There are no completed tasks to delete.",
        variant: "default"
      });
      return;
    }
    deleteCompletedTodos();
    loadTodos();
    toast({
      title: "Tasks deleted",
      description: `${completedCount} completed ${completedCount === 1 ? 'task' : 'tasks'} deleted successfully.`,
      variant: "default"
    });
  };

  const filteredTodos = useMemo(() => {
    if (selectedTag === 'all') {
      return todos;
    }
    return todos.filter((todo) => todo.section === selectedTag);
  }, [todos, selectedTag]);

  const visibleCompletedCount = useMemo(
    () => filteredTodos.filter((todo) => todo.completed).length,
    [filteredTodos]
  );

  const handleAddTag = () => {
    const trimmed = newTagName.trim();
    if (!trimmed) return;
    if (sections.some((section) => section.toLowerCase() === trimmed.toLowerCase())) {
      toast({
        title: 'Tag already exists',
        description: 'Try a different word so things stay tidy.'
      });
      return;
    }

    const updated = [...sections, trimmed];
    setSections(updated);
    saveTodoSections(updated);
    setSelectedTag(trimmed);
    setNewTagName('');
    setIsAddingTag(false);
    toast({
      title: 'Tag added',
      description: 'Use it to group new tasks.'
    });
  };

  const handleDeleteTag = (tag: string) => {
    const updatedSections = sections.filter((section) => section !== tag);
    setSections(updatedSections);
    saveTodoSections(updatedSections);

    const updatedTodos = todos.filter((todo) => todo.section !== tag);
    if (updatedTodos.length !== todos.length) {
      setTodos(updatedTodos);
      saveTodos(updatedTodos);
    }

    if (selectedTag === tag) {
      setSelectedTag('all');
    }

    toast({
      title: 'Tag removed',
      description: 'Any tasks under it were cleared away.'
    });
  };

  const handleAddTask = () => {
    if (!newTaskText.trim() || sections.length === 0) {
      return;
    }

    const section = newTaskTag || sections[0];
    addTodo(newTaskText.trim(), newTaskImportance, section);
    setNewTaskText('');
    setNewTaskImportance('medium');
    setIsAddingTask(false);
    loadTodos();
    toast({
      title: 'Task saved',
      description: 'We added it to your board.'
    });
  };

  const tags = ['all', ...sections];

  return (
    <PageContainer
      title="Focus Board"
      subtitle="Keep a gentle shortlist and let the rest wait."
      showSubtitle
      hideHeader
    >
      <div className="flex flex-1 flex-col gap-10">
        <section className="page-hero">
          <div className="page-hero__header">
            <span className="page-hero__eyebrow">Focus</span>
            <h1 className="text-3xl font-semibold text-safespace-foreground dark:text-slate-100">
              Choose one calm priority
            </h1>
            <p className="page-hero__description">
              Keep tasks light, surface only what matters today, and let everything else stay parked.
            </p>
          </div>
        </section>

        <section className="card-surface flex min-h-[29rem] flex-col px-6 pt-6 pb-8 sm:px-8 sm:pt-8 sm:pb-10">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-sm font-medium text-safespace-foreground/70 dark:text-slate-200">
                  <Sparkles className="h-4 w-4 text-safespace-primary" />
                  <span>Tags</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <button
                    onClick={() => {
                      setIsAddingTag((prev) => !prev);
                      setIsManagingTags(false);
                      setNewTagName('');
                    }}
                    className="button-muted"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {isAddingTag ? 'Cancel' : 'New tag'}
                  </button>
                  <button
                    onClick={() => setIsManagingTags((prev) => !prev)}
                    className="button-muted"
                  >
                    {isManagingTags ? 'Done' : 'Manage tags'}
                  </button>
                </div>
              </div>

              {isAddingTag && (
                <div className="card-section card-section-hover flex flex-wrap gap-2">
                  <input
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    placeholder="e.g. Morning, Deep work"
                    className="flex-1 input-surface"
                  />
                  <button
                    onClick={handleAddTag}
                    disabled={!newTagName.trim()}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      !newTagName.trim()
                        ? 'bg-safespace-muted text-safespace-foreground/40'
                        : 'bg-safespace-primary text-safespace-primary-foreground hover:bg-safespace-primary/90'
                    }`}
                  >
                    Save tag
                  </button>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => {
                  const isActive = selectedTag === tag;
                  return (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`group inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm transition ${
                        isActive
                          ? 'bg-safespace-primary text-white shadow-sm'
                          : 'bg-white/80 text-safespace-foreground/70 ring-1 ring-safespace-muted/50 hover:text-safespace-foreground dark:bg-slate-900/70 dark:text-slate-200 dark:ring-white/15 dark:hover:text-slate-100'
                      }`}
                    >
                      {tag === 'all' ? 'All' : tag}
                      {isManagingTags && tag !== 'all' && (
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTag(tag);
                          }}
                          className="text-xs text-white/80 transition group-hover:text-white"
                        >
                          x
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {isManagingTags && sections.length === 0 && (
                <p className="text-xs text-safespace-foreground/50">
                  Add a tag to start organising tasks.
                </p>
              )}
            </div>

              <div className="card-section card-section-hover flex flex-col gap-4 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-safespace-primary/10 text-safespace-primary dark:bg-safespace-primary/15">
                      <ListTodo className="h-5 w-5" />
                    </span>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-semibold text-safespace-foreground dark:text-slate-100">Task list</span>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="pill-tag bg-safespace-muted/60 px-3 py-1 text-safespace-foreground/70 dark:bg-white/10 dark:text-slate-200">
                          {selectedTag === 'all' ? 'All tags' : selectedTag}
                        </span>
                        <span className="pill-tag bg-safespace-muted/40 px-3 py-1 text-safespace-foreground/60 dark:bg-white/10 dark:text-slate-300">
                          {filteredTodos.length === 0
                            ? '0 tasks'
                            : `${visibleCompletedCount}/${filteredTodos.length} complete`}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDeleteCompletedTodos}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-safespace-muted/50 text-safespace-foreground/65 transition hover:border-safespace-primary/40 hover:text-safespace-primary dark:border-white/15 dark:text-slate-200" 
                      aria-label="Clear completed tasks"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (!isAddingTask) {
                          setNewTaskTag(selectedTag !== 'all' ? selectedTag : sections[0] ?? '');
                        }
                        setIsAddingTask((prev) => !prev);
                        setNewTaskText('');
                      }}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-safespace-muted/50 text-safespace-foreground/65 transition hover:border-safespace-primary/40 hover:text-safespace-primary dark:border-white/15 dark:text-slate-200"
                      aria-label={isAddingTask ? 'Cancel new task' : 'Add new task'}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

              {isAddingTask && (
                <div className="card-section card-section-hover flex flex-col gap-4 p-4">
                  <textarea
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    placeholder="Describe a compassionate next step"
                    className="min-h-[100px] w-full resize-none rounded-xl border border-safespace-muted px-3 py-2 text-sm text-safespace-foreground placeholder:text-safespace-foreground/40 focus:border-safespace-primary/40 focus:outline-none dark:border-white/15 dark:bg-slate-950/70 dark:text-slate-100 dark:placeholder:text-slate-400"
                  />

                  <div className="flex flex-col gap-4 sm:flex-row">
                    <label className="flex flex-1 flex-col gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-safespace-foreground/45 dark:text-slate-400">
                      Importance
                      <select
                        value={newTaskImportance}
                        onChange={(e) => setNewTaskImportance(e.target.value as 'low' | 'medium' | 'high')}
                        className="rounded-xl border border-safespace-muted px-3 py-2 text-sm focus:border-safespace-primary/40 focus:outline-none dark:border-white/15 dark:bg-slate-950/70 dark:text-slate-100"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </label>

                    <label className="flex flex-1 flex-col gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-safespace-foreground/45 dark:text-slate-400">
                      Tag
                      <select
                        value={newTaskTag}
                        onChange={(e) => setNewTaskTag(e.target.value)}
                        className="rounded-xl border border-safespace-muted px-3 py-2 text-sm focus:border-safespace-primary/40 focus:outline-none dark:border-white/15 dark:bg-slate-950/70 dark:text-slate-100"
                      >
                        {sections.map((section) => (
                          <option key={section} value={section}>
                            {section}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setIsAddingTask(false);
                        setNewTaskText('');
                      }}
                      className="button-muted"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddTask}
                      disabled={!newTaskText.trim()}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        !newTaskText.trim()
                          ? 'bg-safespace-muted text-safespace-foreground/40'
                          : 'bg-safespace-primary text-safespace-primary-foreground hover:bg-safespace-primary/90'
                      }`}
                    >
                      Save task
                    </button>
                  </div>
                </div>
              )}

              <TodoList
                todos={filteredTodos}
                activeTodoIds={activeTodoIds}
                onSetActiveTodo={handleSetActiveTodo}
                onTodosChanged={loadTodos}
              />
            </div>
          </div>
        </section>
      </div>
    </PageContainer>
  );
};

export default Todo;
