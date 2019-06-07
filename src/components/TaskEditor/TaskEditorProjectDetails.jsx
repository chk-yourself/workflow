import React from 'react';
import TaskEditorSection from './TaskEditorSection';
import { ProjectBadge } from '../ProjectBadge';
import { ProjectListDropdown } from '../ProjectListDropdown';
import { Badge } from '../Badge';

const TaskEditorProjectDetails = ({
  isPrivate,
  projectId,
  listId,
  onSelectList
}) =>
  isPrivate ? (
    <div className="task-editor__private-indicator">
      <Badge className="task-editor__badge--private">Private</Badge>
    </div>
  ) : (
    <TaskEditorSection size="sm">
      <div className="task-editor__project-name">
        <ProjectBadge
          projectId={projectId}
          size="md"
          variant="icon"
          classes={{
            badge: 'task-editor__project-badge',
            icon: 'task-editor__project-badge-icon'
          }}
        />
      </div>
      <div className="task-editor__list-name">
        <ProjectListDropdown
          classes={{
            button: 'task-editor__project-list-dropdown-btn--toggle',
            menu: 'task-editor__project-list-dropdown-menu'
          }}
          projectId={projectId}
          selectedList={listId}
          onChange={onSelectList}
        />
      </div>
    </TaskEditorSection>
  );

export default TaskEditorProjectDetails;
