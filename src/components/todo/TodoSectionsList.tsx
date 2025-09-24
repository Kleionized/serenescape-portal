
import React from 'react';
import { TodoItem } from '../../lib/types';
import TodoSection from './TodoSection';

interface TodoSectionsListProps {
  sections: string[];
  todos: TodoItem[];
  openSection: string | null;
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
  openSection,
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
      <div className="rounded-2xl border border-dashed border-safespace-muted px-6 py-12 text-center">
        <p className="text-sm text-safespace-foreground/60">No sections yet. Create one to start sorting tasks.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {sections.map((section) => (
        <TodoSection
          key={section}
          section={section}
          todos={todos.filter((todo) => todo.section === section)}
          expanded={openSection === section}
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
