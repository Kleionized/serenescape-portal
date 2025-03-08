
import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
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
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-safespace-primary dark:bg-black/80 dark:border-gray-700 dark:text-white dark:placeholder-gray-400" 
        />
        <button 
          onClick={handleAddSection} 
          disabled={!newSectionName.trim()} 
          className={`inline-flex items-center gap-1 px-4 py-2 rounded-md font-medium transition-colors ${!newSectionName.trim() ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500' : 'bg-safespace-primary text-white hover:bg-safespace-primary/90 dark:bg-black/90 dark:hover:bg-black/70 dark:border dark:border-gray-700'}`}
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
        <button 
          onClick={onCancel} 
          className="inline-flex items-center justify-center px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 dark:bg-black/80 dark:border-gray-700 dark:text-white dark:hover:bg-gray-900"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AddSectionForm;
