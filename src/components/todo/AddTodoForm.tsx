
import React from 'react';

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
    <div className="mb-4 p-4 bg-gray-50/50 rounded-md animate-fade-in dark:bg-black/20">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Add Task to {section}</h3>
      <div className="space-y-3">
        <textarea 
          value={text} 
          onChange={e => onTextChange(e.target.value)} 
          placeholder="Enter task description..." 
          className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-600 resize-none dark:bg-black/30 dark:text-white dark:placeholder-gray-400" 
          rows={2} 
        />
        
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Importance:</label>
            <select 
              value={importance} 
              onChange={e => onImportanceChange(e.target.value as 'low' | 'medium' | 'high')} 
              className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-600 dark:bg-black/30 dark:text-white"
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
              className={`px-4 py-2 rounded-md text-sm transition-colors ${!text.trim() ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}`}
            >
              Add Task
            </button>
            
            <button 
              onClick={onCancel} 
              className="px-4 py-2 rounded-md text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
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
