import React from 'react';

const TaskEditorSection = ({ className, size, children }) => (
  <div className={`task-editor__section${size === 'sm' ? '--sm' : ''} ${className ? `task-editor__section--${className}` : ''}`}>{children}</div>
);

TaskEditorSection.defaultProps = {
  className: '',
  size: 'default'
};

export default TaskEditorSection;
