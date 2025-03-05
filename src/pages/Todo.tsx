
import React, { useState, useEffect } from 'react';
import PageContainer from '../components/layout/PageContainer';
import { getTodos, saveTodos, getTodoSections, saveTodoSections, addTodo, addSubtask, saveActiveTodos } from '../lib/storage';
import { TodoItem } from '../lib/types';
import { Plus, MoreHorizontal, X, Check, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';

const Todo = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [sections, setSections] = useState<string[]>([]);
  const [activeTodoIds, setActiveTodoIds] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [expandedTodos, setExpandedTodos] = useState<string[]>([]);
  const [showAddSection, setShowAddSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [showDeleteSection, setShowDeleteSection] = useState<string | null>(null);
  
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [newTodoText, setNewTodoText] = useState('');
  const [newTodoImportance, setNewTodoImportance] = useState<'low' | 'medium' | 'high'>('medium');
  
  const [activeTodoId, setActiveTodoId] = useState<string | null>(null);
  const [newSubtaskText, setNewSubtaskText] = useState('');
  
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
  
  const handleAddTodo = () => {
    if (!newTodoText.trim() || !activeSection) return;
    
    // Add new todo
    addTodo(newTodoText, newTodoImportance, activeSection);
    
    // Refresh todos
    loadTodos();
    
    // Reset form
    setNewTodoText('');
    setActiveSection(null);
  };
  
  const handleAddSubtask = () => {
    if (!newSubtaskText.trim() || !activeTodoId) return;
    
    // Add subtask
    addSubtask(activeTodoId, newSubtaskText);
    
    // Refresh todos
    loadTodos();
    
    // Reset form
    setNewSubtaskText('');
    setActiveTodoId(null);
  };
  
  const handleToggleTodo = (todo: TodoItem) => {
    // Update the todo in the local state
    const updatedTodos = todos.map(t => 
      t.id === todo.id ? { ...t, completed: !t.completed } : t
    );
    
    // Save to localStorage
    saveTodos(updatedTodos);
    
    // Update state
    setTodos(updatedTodos);
  };
  
  const handleToggleSubtask = (todoId: string, subtaskId: string) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === todoId) {
        const updatedSubtasks = todo.subtasks.map(subtask => 
          subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
        );
        return { ...todo, subtasks: updatedSubtasks };
      }
      return todo;
    });
    
    // Save to localStorage
    saveTodos(updatedTodos);
    
    // Update state
    setTodos(updatedTodos);
  };
  
  const handleAddSection = () => {
    if (!newSectionName.trim()) return;
    
    const updatedSections = [...sections, newSectionName];
    
    // Save to localStorage
    saveTodoSections(updatedSections);
    
    // Update state
    setSections(updatedSections);
    setExpandedSections([...expandedSections, newSectionName]);
    setNewSectionName('');
    setShowAddSection(false);
  };
  
  const handleDeleteSection = (section: string) => {
    // Filter out the section
    const updatedSections = sections.filter(s => s !== section);
    
    // Filter out the todos in that section
    const updatedTodos = todos.filter(todo => todo.section !== section);
    
    // Save to localStorage
    saveTodoSections(updatedSections);
    saveTodos(updatedTodos);
    
    // Update state
    setSections(updatedSections);
    setTodos(updatedTodos);
    setShowDeleteSection(null);
    
    // Remove from expanded sections
    setExpandedSections(expandedSections.filter(s => s !== section));
  };
  
  const handleToggleSection = (section: string) => {
    if (expandedSections.includes(section)) {
      setExpandedSections(expandedSections.filter(s => s !== section));
    } else {
      setExpandedSections([...expandedSections, section]);
    }
  };
  
  const handleToggleTodoExpand = (todoId: string) => {
    if (expandedTodos.includes(todoId)) {
      setExpandedTodos(expandedTodos.filter(id => id !== todoId));
    } else {
      setExpandedTodos([...expandedTodos, todoId]);
    }
  };
  
  const handleSetActiveTodo = (todoId: string) => {
    const newActiveTodos = [...activeTodoIds];
    
    if (newActiveTodos.includes(todoId)) {
      // Remove from active if already there
      const index = newActiveTodos.indexOf(todoId);
      newActiveTodos.splice(index, 1);
    } else {
      // Add to active if not there and there are less than 3 active todos
      if (newActiveTodos.length < 3) {
        newActiveTodos.push(todoId);
      } else {
        // Replace the first active todo
        newActiveTodos.shift();
        newActiveTodos.push(todoId);
      }
    }
    
    // Save to localStorage
    saveActiveTodos(newActiveTodos);
    
    // Update state
    setActiveTodoIds(newActiveTodos);
  };
  
  const getImportanceClass = (importance: string): string => {
    switch (importance) {
      case 'high':
        return 'bg-safespace-stress-high/20 text-safespace-stress-high';
      case 'medium':
        return 'bg-safespace-stress-medium/20 text-safespace-stress-medium';
      case 'low':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };
  
  return (
    <PageContainer 
      title="To-Do List" 
      subtitle="Organize and manage your tasks by importance and category"
    >
      <div className="glass-card rounded-xl p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="heading-sm">Task Sections</h2>
          <button
            onClick={() => setShowAddSection(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm bg-safespace-primary text-white hover:bg-safespace-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Section</span>
          </button>
        </div>
        
        {showAddSection && (
          <div className="mb-6 animate-fade-in">
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                placeholder="Enter section name..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-safespace-primary"
              />
              <button
                onClick={handleAddSection}
                disabled={!newSectionName.trim()}
                className={`inline-flex items-center gap-1 px-4 py-2 rounded-md font-medium transition-colors ${
                  !newSectionName.trim()
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-safespace-primary text-white hover:bg-safespace-primary/90'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
              <button
                onClick={() => setShowAddSection(false)}
                className="inline-flex items-center justify-center px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
        
        {sections.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500">No sections created yet.</p>
            <p className="text-sm text-gray-400 mt-2">
              Add sections to organize your tasks.
            </p>
          </div>
        ) : (
          sections.map((section) => (
            <div key={section} className="mb-8">
              <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
                <button
                  onClick={() => handleToggleSection(section)}
                  className="inline-flex items-center gap-2 text-lg font-medium text-safespace-foreground hover:text-safespace-primary transition-colors"
                >
                  {expandedSections.includes(section) ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronUp className="w-5 h-5" />
                  )}
                  <span>{section}</span>
                </button>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setActiveSection(section);
                      setNewTodoText('');
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Task</span>
                  </button>
                  
                  <button
                    onClick={() => setShowDeleteSection(section)}
                    className="inline-flex items-center justify-center p-1.5 rounded-md text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {showDeleteSection === section && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4 animate-fade-in">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-red-800 mb-2">
                        Delete "{section}" section?
                      </h3>
                      <p className="text-xs text-red-700 mb-3">
                        This will permanently delete this section and all tasks in it.
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowDeleteSection(null)}
                          className="px-3 py-1 text-xs bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleDeleteSection(section)}
                          className="px-3 py-1 text-xs bg-red-600 rounded text-white hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeSection === section && (
                <div className="mb-4 p-4 bg-gray-50 rounded-md animate-fade-in">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Add Task to {section}</h3>
                  <div className="space-y-3">
                    <textarea
                      value={newTodoText}
                      onChange={(e) => setNewTodoText(e.target.value)}
                      placeholder="Enter task description..."
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-safespace-primary resize-none"
                      rows={2}
                    />
                    
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <label className="block text-sm text-gray-600 mb-1">Importance:</label>
                        <select
                          value={newTodoImportance}
                          onChange={(e) => setNewTodoImportance(e.target.value as 'low' | 'medium' | 'high')}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-safespace-primary"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                      
                      <div className="flex gap-2 mt-6">
                        <button
                          onClick={handleAddTodo}
                          disabled={!newTodoText.trim()}
                          className={`inline-flex items-center gap-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            !newTodoText.trim()
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-safespace-primary text-white hover:bg-safespace-primary/90'
                          }`}
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Task</span>
                        </button>
                        
                        <button
                          onClick={() => setActiveSection(null)}
                          className="inline-flex items-center justify-center px-4 py-2 rounded-md text-sm border border-gray-300 text-gray-700 hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {expandedSections.includes(section) && (
                <div className="space-y-3">
                  {todos.filter(todo => todo.section === section).length === 0 ? (
                    <div className="text-center py-3">
                      <p className="text-sm text-gray-500">No tasks in this section.</p>
                    </div>
                  ) : (
                    todos
                      .filter(todo => todo.section === section)
                      .map((todo) => (
                        <div 
                          key={todo.id}
                          className={`border rounded-lg ${
                            todo.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'
                          }`}
                        >
                          <div className="p-4 flex items-start gap-3">
                            <button
                              onClick={() => handleToggleTodo(todo)}
                              className={`flex-shrink-0 w-6 h-6 mt-0.5 rounded-full border ${
                                todo.completed
                                  ? 'bg-safespace-primary border-safespace-primary text-white'
                                  : 'border-gray-300 hover:border-safespace-primary'
                              } flex items-center justify-center transition-colors`}
                            >
                              {todo.completed && <Check className="w-4 h-4" />}
                            </button>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <p className={`text-gray-800 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                                  {todo.text}
                                </p>
                                
                                <div className="flex items-center gap-2 ml-2">
                                  <span className={`pill-tag text-xs ${getImportanceClass(todo.importance)}`}>
                                    {todo.importance}
                                  </span>
                                  
                                  <div className="relative">
                                    <button
                                      onClick={() => handleSetActiveTodo(todo.id)}
                                      className={`px-2 py-1 rounded text-xs font-medium ${
                                        activeTodoIds.includes(todo.id)
                                          ? 'bg-safespace-primary text-white'
                                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                      }`}
                                    >
                                      {activeTodoIds.includes(todo.id) ? 'Active' : 'Set Active'}
                                    </button>
                                  </div>
                                </div>
                              </div>
                              
                              {todo.subtasks.length > 0 && (
                                <div className="mt-3 space-y-2">
                                  <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-medium text-gray-600">Steps</h4>
                                    <button
                                      onClick={() => handleToggleTodoExpand(todo.id)}
                                      className="text-gray-500 hover:text-gray-700"
                                    >
                                      {expandedTodos.includes(todo.id) ? (
                                        <ChevronUp className="w-4 h-4" />
                                      ) : (
                                        <ChevronDown className="w-4 h-4" />
                                      )}
                                    </button>
                                  </div>
                                  
                                  {expandedTodos.includes(todo.id) && (
                                    <div className="pl-2 border-l-2 border-gray-200 space-y-2 my-2">
                                      {todo.subtasks.map((subtask) => (
                                        <div 
                                          key={subtask.id}
                                          className="flex items-start gap-2"
                                        >
                                          <button
                                            onClick={() => handleToggleSubtask(todo.id, subtask.id)}
                                            className={`flex-shrink-0 w-4 h-4 mt-1 rounded-sm border ${
                                              subtask.completed
                                                ? 'bg-safespace-primary border-safespace-primary text-white'
                                                : 'border-gray-300 hover:border-safespace-primary'
                                            } flex items-center justify-center transition-colors`}
                                          >
                                            {subtask.completed && <Check className="w-3 h-3" />}
                                          </button>
                                          <span className={`text-sm ${subtask.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                                            {subtask.text}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                              
                              <div className="mt-3">
                                {activeTodoId === todo.id ? (
                                  <div className="flex gap-2 items-center animate-fade-in">
                                    <input
                                      type="text"
                                      value={newSubtaskText}
                                      onChange={(e) => setNewSubtaskText(e.target.value)}
                                      placeholder="Add a step..."
                                      className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-safespace-primary"
                                    />
                                    <button
                                      onClick={handleAddSubtask}
                                      disabled={!newSubtaskText.trim()}
                                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                                        !newSubtaskText.trim()
                                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                          : 'bg-safespace-primary text-white hover:bg-safespace-primary/90'
                                      }`}
                                    >
                                      Add
                                    </button>
                                    <button
                                      onClick={() => setActiveTodoId(null)}
                                      className="inline-flex items-center justify-center px-2 py-1.5 rounded-md text-xs border border-gray-300 text-gray-700 hover:bg-gray-100"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setActiveTodoId(todo.id);
                                      setNewSubtaskText('');
                                    }}
                                    className="inline-flex items-center gap-1 text-xs text-safespace-primary hover:underline"
                                  >
                                    <Plus className="w-3 h-3" />
                                    <span>Add Step</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
      
      <div className="glass-card rounded-xl p-6">
        <h2 className="heading-sm mb-4">About Active To-Dos</h2>
        <p className="text-gray-600 mb-3">
          Active To-Dos are the three tasks you're currently focusing on. 
          They will appear on your home page for easy access.
        </p>
        <p className="text-gray-600">
          To make a task active, click the "Set Active" button next to any task.
          Once all your active tasks are completed, you'll be prompted to select new ones.
        </p>
      </div>
    </PageContainer>
  );
};

export default Todo;
