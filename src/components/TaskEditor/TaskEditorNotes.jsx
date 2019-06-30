import React, { memo } from 'react';
import PropTypes from 'prop-types';
import TaskEditorSection from './TaskEditorSection';
import TaskEditorIcon from './TaskEditorIcon';
import { NotesEditor } from '../NotesEditor';

const TaskEditorNotes = ({ taskId, value, enableMentions }) => {
  return (
    <TaskEditorSection>
      <TaskEditorIcon name="edit-3" />
      <NotesEditor
        placeholder="Add a description"
        type="task"
        key={`notes--${taskId}`}
        id={taskId}
        value={value}
        isMentionsEnabled={enableMentions}
        classes={{
          editor: 'task-editor__textarea task-editor__textarea--description'
        }}
      />
    </TaskEditorSection>
  );
};

TaskEditorNotes.propTypes = {
  taskId: PropTypes.string.isRequired,
  enableMentions: PropTypes.bool.isRequired
};

export default memo(TaskEditorNotes);
