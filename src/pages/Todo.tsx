import React, { useState, useEffect } from 'react';
import PageContainer from '../components/layout/PageContainer';
import { getTodos, getTodoSections, saveActiveTodos, deleteCompletedTodos } from '../lib/storage';
import { useToast } from "@/hooks/use-toast";
import TodoSectionsList from '../components/todo/TodoSectionsList';
import { TodoItem } from '../lib/types';
import AddSectionForm from '../components/todo/AddSectionForm';
import { Trash2, Plus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
const Todo = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [sections, setSections] = useState<string[]>([]);
  const [activeTodoIds, setActiveTodoIds] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [showAddSection, setShowAddSection] = useState(false);
  const [showDeleteSection, setShowDeleteSection] = useState<string | null>(null);
  const {
    toast
  } = useToast();
  useEffect(() => {
    loadTodos();
    loadSections();
  }, []);
  const loadTodos = () => {
    const loadedTodos = getTodos();
    setTodos(loadedTodos);
    const loadedActiveTodoIds = localStorage.getItem('safespace_active_todos');
    setActiveTodoIds(loadedActiveTodoIds ? JSON.parse(loadedActiveTodoIds) : []);
  };
  const loadSections = () => {
    const loadedSections = getTodoSections();
    setSections(loadedSections);
    setExpandedSections(loadedSections);
  };
  const handleToggleSection = (section: string) => {
    if (expandedSections.includes(section)) {
      setExpandedSections(expandedSections.filter(s => s !== section));
    } else {
      setExpandedSections([...expandedSections, section]);
    }
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
    const completedCount = todos.filter(todo => todo.completed).length;
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
  return <PageContainer title="To-Do List" subtitle="Organize and manage your tasks by importance and category">
      <div className="rounded-xl mb-8">
        <div className="flex justify-end items-center mb-6 px-0 py-[10px]\n">
          
          <div className="flex gap-2">
            <button onClick={handleDeleteCompletedTodos} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors">
              <Trash2 className="w-4 h-4" />
              <span>Delete Completed</span>
            </button>
            <button onClick={() => setShowAddSection(true)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Plus className="w-4 h-4" />
              <span>Add Section</span>
            </button>
          </div>
        </div>
        
        
        
        {showAddSection && <AddSectionForm onAdd={sectionName => {
        setSections([...sections, sectionName]);
        setExpandedSections([...expandedSections, sectionName]);
        setShowAddSection(false);
      }} onCancel={() => setShowAddSection(false)} />}
        
        <TodoSectionsList sections={sections} todos={todos} expandedSections={expandedSections} activeTodoIds={activeTodoIds} showDeleteSection={showDeleteSection} onToggleSection={handleToggleSection} onSetActiveTodo={handleSetActiveTodo} onSetShowDeleteSection={setShowDeleteSection} onDeleteSection={section => {
        setSections(sections.filter(s => s !== section));
        setExpandedSections(expandedSections.filter(s => s !== section));
        setShowDeleteSection(null);
        loadTodos();
      }} onTodosChanged={loadTodos} />
      </div>
    </PageContainer>;
};
export default Todo;