
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
    <div className="flex flex-wrap gap-3 rounded-2xl border border-safespace-muted bg-white p-4">
      <input
        type="text"
        value={newSectionName}
        onChange={(e) => setNewSectionName(e.target.value)}
        placeholder="Section name"
        className="flex-1 rounded-xl border border-safespace-muted px-4 py-2 text-sm focus:border-safespace-primary/40 focus:outline-none"
      />
      <button
        onClick={handleAddSection}
        disabled={!newSectionName.trim()}
        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
          !newSectionName.trim()
            ? 'bg-safespace-muted text-safespace-foreground/40'
            : 'bg-safespace-primary text-safespace-primary-foreground hover:bg-safespace-primary/90'
        }`}
      >
        Add
      </button>
      <button
        onClick={onCancel}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-safespace-muted text-safespace-foreground/50 hover:border-safespace-primary/40 hover:text-safespace-primary"
        aria-label="Cancel add section"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default AddSectionForm;
