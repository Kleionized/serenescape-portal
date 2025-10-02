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
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Todo = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [sections, setSections] = useState<string[]>([]);
  const [activeTodoIds, setActiveTodoIds] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [isManagingTags, setIsManagingTags] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [showTagTools, setShowTagTools] = useState(false);
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

  useEffect(() => {
    if (!showTagTools) {
      setIsAddingTag(false);
      setIsManagingTags(false);
      setNewTagName('');
    }
  }, [showTagTools]);

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
            <h1 className="text-2xl font-semibold text-safespace-foreground sm:text-3xl dark:text-slate-100">
              Choose one calm priority
            </h1>
            <p className="page-hero__description">
              Keep tasks light, surface only what matters today, and let everything else stay parked.
            </p>
          </div>
        </section>

        <section className="card-surface flex min-h-[24rem] flex-col px-4 pt-5 pb-7 sm:min-h-[29rem] sm:px-6 sm:pt-6 sm:pb-8 lg:px-8 lg:pt-8 lg:pb-10">
          <div className="flex flex-col gap-5">
            <div className="card-section card-section-hover flex flex-col gap-4 p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-medium text-safespace-foreground/70 dark:text-slate-200">
                  <Sparkles className="h-4 w-4 text-safespace-primary" />
                  <span>Focus areas</span>
                </div>
                {sections.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowTagTools((prev) => !prev)}
                    className="button-muted px-3 py-1 text-xs font-semibold"
                  >
                    {showTagTools ? 'Hide organizer' : 'Organize tags'}
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex w-full flex-col gap-2 sm:max-w-xs">
                  <label
                    htmlFor="focus-select"
                    className="text-xs font-semibold uppercase tracking-[0.3em] text-safespace-foreground/45 dark:text-slate-400"
                  >
                    Active filter
                  </label>
                  <select
                    id="focus-select"
                    value={selectedTag}
                    onChange={(event) => setSelectedTag(event.target.value)}
                    className="input-surface w-full px-3 py-2 pr-8 text-sm"
                  >
                    {tags.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag === 'all' ? 'All focus areas' : tag}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-safespace-foreground/60 dark:text-slate-300">
                  <span>{filteredTodos.length} task{filteredTodos.length === 1 ? '' : 's'} in view</span>
                  {visibleCompletedCount > 0 && (
                    <span>{visibleCompletedCount} done</span>
                  )}
                </div>
              </div>

              {showTagTools && (
                <div className="space-y-4 border-t border-safespace-muted/40 pt-4 dark:border-white/10">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingTag((prev) => !prev);
                        if (!isAddingTag) {
                          setNewTagName('');
                        }
                        setIsManagingTags(false);
                      }}
                      className="button-muted px-3 py-1 text-xs font-semibold"
                    >
                      {isAddingTag ? 'Cancel new tag' : 'New tag'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsManagingTags((prev) => !prev)}
                      className="button-muted px-3 py-1 text-xs font-semibold"
                    >
                      {isManagingTags ? 'Hide remove' : 'Manage tags'}
                    </button>
                  </div>

                  {isAddingTag && (
                    <div className="flex flex-col gap-2 rounded-2xl border border-safespace-muted/45 bg-white/85 p-3 sm:flex-row sm:items-center dark:border-white/10 dark:bg-slate-900/60">
                      <input
                        type="text"
                        value={newTagName}
                        onChange={(event) => setNewTagName(event.target.value)}
                        placeholder="e.g. Morning, Deep work"
                        className="input-surface flex-1 px-3 py-2"
                      />
                      <Button
                        type="button"
                        onClick={handleAddTag}
                        disabled={!newTagName.trim()}
                        size="sm"
                        className="rounded-full px-4 text-xs font-semibold disabled:bg-safespace-muted disabled:text-safespace-foreground/40"
                      >
                        Save
                      </Button>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => {
                      const isActive = selectedTag === tag;
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setSelectedTag(tag)}
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition ${
                            isActive
                              ? 'bg-safespace-primary text-white shadow-sm'
                              : 'bg-white/80 text-safespace-foreground/70 ring-1 ring-safespace-muted/50 hover:text-safespace-foreground dark:bg-slate-900/70 dark:text-slate-200 dark:ring-white/15 dark:hover:text-slate-100'
                          }`}
                        >
                          {tag === 'all' ? 'All focus areas' : tag}
                          {isManagingTags && tag !== 'all' && (
                            <span
                              onClick={(event) => {
                                event.stopPropagation();
                                handleDeleteTag(tag);
                              }}
                              className="text-xs text-white/80 transition hover:text-white"
                            >
                              x
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {isManagingTags && sections.length === 0 && (
                    <p className="text-xs text-safespace-foreground/50 dark:text-slate-400">
                      Add a tag to start organising tasks.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="card-section card-section-hover flex flex-col gap-4 p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-sm font-semibold text-safespace-foreground dark:text-slate-100">
                    Task list
                  </span>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-safespace-foreground/60 dark:text-slate-300">
                    <span>{selectedTag === 'all' ? 'All focus areas' : selectedTag}</span>
                    {filteredTodos.length > 0 && (
                      <span>{visibleCompletedCount}/{filteredTodos.length} complete</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleDeleteCompletedTodos}
                    className="whitespace-nowrap px-3 py-1 text-xs font-semibold text-safespace-foreground/70 hover:text-safespace-primary dark:text-slate-300"
                  >
                    Clear done
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      if (!isAddingTask) {
                        setNewTaskTag(selectedTag !== 'all' ? selectedTag : sections[0] ?? '');
                      }
                      setIsAddingTask((prev) => !prev);
                      setNewTaskText('');
                    }}
                    className="whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold"
                  >
                    {isAddingTask ? 'Close form' : 'Add task'}
                  </Button>
                </div>
              </div>

              {isAddingTask && (
                <div className="flex flex-col gap-3 rounded-2xl border border-safespace-muted/40 bg-white/85 p-4 dark:border-white/10 dark:bg-slate-950/70">
                  <textarea
                    value={newTaskText}
                    onChange={(event) => setNewTaskText(event.target.value)}
                    placeholder="Describe a gentle next step"
                    className="min-h-[90px] w-full resize-none rounded-xl border border-safespace-muted px-3 py-2 text-sm text-safespace-foreground placeholder:text-safespace-foreground/40 focus:border-safespace-primary/40 focus:outline-none dark:border-white/15 dark:bg-transparent dark:text-slate-100 dark:placeholder:text-slate-400"
                  />

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="flex flex-1 flex-col gap-1">
                      <span className="text-xs font-semibold uppercase tracking-[0.25em] text-safespace-foreground/45 dark:text-slate-400">
                        Importance
                      </span>
                      <select
                        value={newTaskImportance}
                        onChange={(event) => setNewTaskImportance(event.target.value as 'low' | 'medium' | 'high')}
                        className="input-surface w-full px-3 py-2 text-sm"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    <div className="flex flex-1 flex-col gap-1">
                      <span className="text-xs font-semibold uppercase tracking-[0.25em] text-safespace-foreground/45 dark:text-slate-400">
                        Tag
                      </span>
                      <select
                        value={newTaskTag}
                        onChange={(event) => setNewTaskTag(event.target.value)}
                        className="input-surface w-full px-3 py-2 text-sm"
                      >
                        {sections.map((section) => (
                          <option key={section} value={section}>
                            {section}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setIsAddingTask(false);
                        setNewTaskText('');
                      }}
                      size="sm"
                      className="rounded-full px-3 text-xs font-semibold text-safespace-foreground/70 hover:text-safespace-primary dark:text-slate-300"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={handleAddTask}
                      disabled={!newTaskText.trim()}
                      size="sm"
                      className="rounded-full px-4 text-xs font-semibold disabled:bg-safespace-muted disabled:text-safespace-foreground/40"
                    >
                      Save task
                    </Button>
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
