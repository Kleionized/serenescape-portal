
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { saveTodoSections, getTodoSections } from '../../lib/storage';

interface AddSectionFormProps {
  onAdd: (sectionName: string) => void;
  onCancel: () => void;
}

const AddSectionForm: React.FC<AddSectionFormProps> = ({ onAdd, onCancel }) => {
  const [newSectionName, setNewSectionName] = useState('');

  const handleAddSection = () => {
    if (!newSectionName.trim()) return;
    
    const sections = getTodoSections();
    const updatedSections = [...sections, newSectionName];
    saveTodoSections(updatedSections);
    
    onAdd(newSectionName);
    setNewSectionName('');
  };

  return (
    <div className="mb-6 animate-fade-in">
      <div className="flex gap-2 mb-2">
        <input 
          type="text" 
          value={newSectionName} 
          onChange={e => setNewSectionName(e.target.value)} 
          placeholder="Enter section name..." 
          className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-600 dark:bg-black/30 dark:text-white dark:placeholder-gray-400" 
        />
        <button 
          onClick={handleAddSection} 
          disabled={!newSectionName.trim()} 
          className={`px-4 py-2 rounded-md transition-colors ${!newSectionName.trim() ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}`}
        >
          Add
        </button>
        <button 
          onClick={onCancel} 
          className="inline-flex items-center justify-center px-3 py-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AddSectionForm;
