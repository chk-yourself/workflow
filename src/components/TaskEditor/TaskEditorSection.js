import React from 'react';

const TaskEditorSection = ({ size, children }) => (
  <div className={`task-editor__section${size === 'sm' ? '--sm' : ''}`}>{children}</div>
);

TaskEditorSection.defaultProps = {
  size: 'default'
};

export default TaskEditorSection;
