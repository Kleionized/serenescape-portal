
import React from 'react';
import { TodoItem } from '../../lib/types';
import TodoSection from './TodoSection';

interface TodoSectionsListProps {
  sections: string[];
  todos: TodoItem[];
  expandedSections: string[];
  activeTodoIds: string[];
  showDeleteSection: string | null;
  onToggleSection: (section: string) => void;
  onSetActiveTodo: (todoId: string) => void;
  onSetShowDeleteSection: (section: string | null) => void;
  onDeleteSection: (section: string) => void;
  onTodosChanged: () => void;
}

const TodoSectionsList: React.FC<TodoSectionsListProps> = ({
  sections,
  todos,
  expandedSections,
  activeTodoIds,
  showDeleteSection,
  onToggleSection,
  onSetActiveTodo,
  onSetShowDeleteSection,
  onDeleteSection,
  onTodosChanged
}) => {
  if (sections.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-safespace-foreground">No sections created yet.</p>
        <p className="text-sm text-safespace-foreground/70 mt-2">
          Add sections to organize your tasks.
        </p>
      </div>
    );
  }

  // Create pairs of sections for the grid layout
  const sectionPairs = [];
  for (let i = 0; i < sections.length; i += 2) {
    const pair = [sections[i]];
    if (i + 1 < sections.length) {
      pair.push(sections[i + 1]);
    }
    sectionPairs.push(pair);
  }

  return (
    <div className="space-y-6">
      {sectionPairs.map((pair, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pair.map(section => (
            <TodoSection
              key={section}
              section={section}
              todos={todos.filter(todo => todo.section === section)}
              expanded={expandedSections.includes(section)}
              activeTodoIds={activeTodoIds}
              showDeleteAlert={showDeleteSection === section}
              onToggleSection={() => onToggleSection(section)}
              onSetActiveTodo={onSetActiveTodo}
              onShowDeleteAlert={() => onSetShowDeleteSection(section)}
              onCancelDelete={() => onSetShowDeleteSection(null)}
              onDelete={() => onDeleteSection(section)}
              onTodosChanged={onTodosChanged}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default TodoSectionsList;
