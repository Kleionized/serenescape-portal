
import React from 'react';
import { Plus } from 'lucide-react';

interface AddTodoFormProps {
  section: string;
  text: string;
  importance: 'low' | 'medium' | 'high';
  onTextChange: (text: string) => void;
  onImportanceChange: (importance: 'low' | 'medium' | 'high') => void;
  onAdd: () => void;
  onCancel: () => void;
}

const AddTodoForm: React.FC<AddTodoFormProps> = ({
  section,
  text,
  importance,
  onTextChange,
  onImportanceChange,
  onAdd,
  onCancel
}) => {
  return (
    <div className="mb-4 p-4 bg-gray-50 rounded-md animate-fade-in dark:bg-black/40 dark:border dark:border-gray-800">
      <h3 className="text-sm font-medium text-safespace-foreground mb-3">Add Task to {section}</h3>
      <div className="space-y-3">
        <textarea 
          value={text} 
          onChange={e => onTextChange(e.target.value)} 
          placeholder="Enter task description..." 
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-safespace-primary resize-none dark:bg-black/80 dark:border-gray-700 dark:text-white dark:placeholder-gray-400" 
          rows={2} 
        />
        
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm text-safespace-foreground mb-1">Importance:</label>
            <select 
              value={importance} 
              onChange={e => onImportanceChange(e.target.value as 'low' | 'medium' | 'high')} 
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-safespace-primary dark:bg-black/80 dark:border-gray-700 dark:text-white"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <div className="flex gap-2 mt-6">
            <button 
              onClick={onAdd} 
              disabled={!text.trim()} 
              className={`inline-flex items-center gap-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${!text.trim() ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500' : 'bg-safespace-primary text-white hover:bg-safespace-primary/90 dark:bg-black/90 dark:hover:bg-black/70 dark:border dark:border-gray-700'}`}
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
            
            <button 
              onClick={onCancel} 
              className="inline-flex items-center justify-center px-4 py-2 rounded-md text-sm border border-gray-300 text-gray-700 hover:bg-gray-100 dark:bg-black/80 dark:border-gray-700 dark:text-white dark:hover:bg-gray-900"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTodoForm;
