
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
    <div className="rounded-2xl border border-safespace-muted bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold text-safespace-foreground/70">
        Add task to <span className="text-safespace-primary">{section}</span>
      </h3>
      <div className="space-y-3">
        <textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Describe the next step"
          className="w-full resize-none rounded-xl border border-safespace-muted px-3 py-2 text-sm text-safespace-foreground placeholder:text-safespace-foreground/40 focus:border-safespace-primary/40 focus:outline-none"
          rows={2}
        />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.25em] text-safespace-foreground/45">
              Importance
            </label>
            <select
              value={importance}
              onChange={(e) => onImportanceChange(e.target.value as 'low' | 'medium' | 'high')}
              className="w-full rounded-xl border border-safespace-muted px-3 py-2 text-sm focus:border-safespace-primary/40 focus:outline-none"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onAdd}
              disabled={!text.trim()}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                !text.trim()
                  ? 'bg-safespace-muted text-safespace-foreground/40'
                  : 'bg-safespace-primary text-safespace-primary-foreground hover:bg-safespace-primary/90'
              }`}
            >
              Add
            </button>
            <button
              onClick={onCancel}
              className="rounded-full border border-safespace-muted px-4 py-2 text-sm font-semibold text-safespace-foreground/60 hover:border-safespace-primary/40 hover:text-safespace-primary"
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
