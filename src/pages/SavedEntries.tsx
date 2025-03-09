
import React, { useState, useEffect } from 'react';
import { getEntries, deleteEntry, deleteAllEntries } from '../lib/storage';
import { SavedEntry } from '../lib/types';
import { Trash2, MessageSquare, Search, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageContainer from '@/components/layout/PageContainer';

const SavedEntries = () => {
  const [entries, setEntries] = useState<SavedEntry[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedEntries, setSelectedEntries] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showContent, setShowContent] = useState(false);
  
  useEffect(() => {
    loadEntries();
  }, []);
  
  const loadEntries = () => {
    const loadedEntries = getEntries();
    loadedEntries.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setEntries(loadedEntries);
  };
  
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    setSelectedEntries([]);
    setShowDeleteConfirm(false);
  };
  
  const toggleEntrySelection = (id: string) => {
    if (selectedEntries.includes(id)) {
      setSelectedEntries(selectedEntries.filter(entryId => entryId !== id));
    } else {
      setSelectedEntries([...selectedEntries, id]);
    }
  };
  
  const handleDeleteSelected = () => {
    selectedEntries.forEach(id => {
      deleteEntry(id);
    });
    
    loadEntries();
    setSelectedEntries([]);
    setShowDeleteConfirm(false);
    
    if (entries.length === selectedEntries.length) {
      setIsEditMode(false);
    }
  };
  
  const handleDeleteAll = () => {
    deleteAllEntries();
    loadEntries();
    setIsEditMode(false);
    setShowDeleteConfirm(false);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <PageContainer title="Saved Entries">
      <div className="flex-1 flex flex-col">
        <div className="mb-6 flex justify-between items-center">
          <div className="text-gray-500">
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          </div>
          
          <div className="flex gap-3">
            {entries.length > 0 && showContent && (
              <button
                onClick={toggleEditMode}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isEditMode
                    ? 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {isEditMode ? 'Done' : 'Edit'}
              </button>
            )}
            
            {isEditMode && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={selectedEntries.length === 0 && entries.length === 0}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedEntries.length === 0 && entries.length === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                    : 'bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700'
                }`}
              >
                {selectedEntries.length > 0 ? `Delete (${selectedEntries.length})` : 'Delete All'}
              </button>
            )}
          </div>
        </div>
        
        {showDeleteConfirm && (
          <div className="mb-6 bg-red-50 rounded-xl p-6 animate-fade-in dark:bg-red-900/20">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 p-1">
                <AlertTriangle className="w-6 h-6 text-red-500 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-red-800 mb-2 dark:text-red-300">
                  {selectedEntries.length > 0
                    ? `Delete ${selectedEntries.length} entries?`
                    : 'Delete all entries?'}
                </h3>
                <p className="text-red-700 mb-4 dark:text-red-400">
                  This action cannot be undone. These entries will be permanently removed.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 bg-white rounded-md text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={selectedEntries.length > 0 ? handleDeleteSelected : handleDeleteAll}
                    className="px-4 py-2 bg-red-600 rounded-md text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                  >
                    Yes, delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="relative flex-1">
          {/* Blur overlay */}
          <div className={`absolute inset-0 backdrop-blur-md z-10 flex items-center justify-center transition-opacity duration-500 ${showContent ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <Button 
              size="lg" 
              onClick={() => setShowContent(true)}
              className="bg-safespace-primary hover:bg-safespace-primary/90 text-white py-6 px-8 text-lg shadow-lg animate-pulse-gentle"
            >
              Show Entries
            </Button>
          </div>
          
          {/* Entries content - completely hidden until revealed */}
          <div className={`${showContent ? 'block' : 'hidden'}`}>
            {entries.length === 0 ? (
              <div className="text-center py-12 flex-1">
                <p className="text-safespace-foreground dark:text-white mb-2">No saved entries yet.</p>
                <p className="text-sm text-safespace-foreground dark:text-white">
                  Your thought dumps and reflections will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4 overflow-y-auto flex-1">
                {entries.map((entry) => (
                  <div 
                    key={entry.id}
                    className={`p-6 ${
                      isEditMode ? 'cursor-pointer' : ''
                    } ${
                      selectedEntries.includes(entry.id) ? 'ring-2 ring-safespace-primary' : ''
                    } relative rounded-lg bg-white dark:bg-gray-800 shadow-sm`}
                    onClick={() => isEditMode && toggleEntrySelection(entry.id)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {entry.type === 'thought' ? (
                          <MessageSquare className="w-4 h-4 text-safespace-secondary" />
                        ) : (
                          <Search className="w-4 h-4 text-safespace-primary" />
                        )}
                        <span className="text-sm font-medium text-safespace-foreground dark:text-white">
                          {entry.type === 'thought' ? 'Thought' : 'Reflection'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-500 dark:text-white/70 text-sm">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(entry.createdAt)}</span>
                      </div>
                    </div>
                    
                    {entry.type === 'thought' ? (
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <p className="text-safespace-foreground dark:text-white">{entry.text}</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-600 dark:text-white/80 mb-1">Stressor:</h4>
                          <p className="text-gray-800 dark:text-white">{entry.stressor}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-600 dark:text-white/80 mb-1">Worst Case Scenario:</h4>
                          <p className="text-gray-800 dark:text-white">{entry.worstCase}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-600 dark:text-white/80 mb-1">Resolution:</h4>
                          <p className="text-gray-800 dark:text-white">{entry.resolution}</p>
                        </div>
                      </div>
                    )}
                    
                    {isEditMode && (
                      <div className={`absolute top-3 right-3 flex items-center justify-center w-6 h-6 rounded-full ${
                        selectedEntries.includes(entry.id)
                          ? 'bg-safespace-primary text-white'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}>
                        {selectedEntries.includes(entry.id) && (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default SavedEntries;
