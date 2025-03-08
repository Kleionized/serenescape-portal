
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

  return (
    <div>
      {sections.map(section => (
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
  );
};

export default TodoSectionsList;
