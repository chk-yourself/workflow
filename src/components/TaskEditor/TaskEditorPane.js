import React from 'react';
import { IconButton } from '../Button';
import './TaskEditorPane.scss';

const TaskEditorPane = ({ onClose, children }) => {
  return (
    <div className="task-editor-pane">
      <IconButton
        type="button"
        className="task-editor-pane__btn--close"
        onClick={onClose}
        icon="x"
        ariaLabel="Close task editor"
      />
      {children}
    </div>
  );
};

export default TaskEditorPane;
