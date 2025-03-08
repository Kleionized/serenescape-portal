
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface DeleteSectionAlertProps {
  section: string;
  onCancel: () => void;
  onDelete: () => void;
}

const DeleteSectionAlert: React.FC<DeleteSectionAlertProps> = ({
  section,
  onCancel,
  onDelete
}) => {
  return (
    <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4 animate-fade-in dark:bg-red-900/20 dark:border-red-900/30">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800 mb-2 dark:text-red-300">
            Delete "{section}" section?
          </h3>
          <p className="text-xs text-red-700 mb-3 dark:text-red-400">
            This will permanently delete this section and all tasks in it.
          </p>
          <div className="flex gap-2">
            <button 
              onClick={onCancel} 
              className="px-3 py-1 text-xs bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50 dark:bg-black/80 dark:border-gray-700 dark:text-white dark:hover:bg-black/60"
            >
              Cancel
            </button>
            <button 
              onClick={onDelete} 
              className="px-3 py-1 text-xs bg-red-600 rounded text-white hover:bg-red-700 dark:bg-red-800 dark:hover:bg-red-900"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteSectionAlert;
