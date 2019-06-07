import React from 'react';
import { Button } from '../Button';
import { Icon } from '../Icon';
import './TaskEditorPane.scss';

const TaskEditorPane = ({ onClose, onClick, children }) => (
  <div className="task-editor-pane" onClick={onClick}>
    <Button
      type="button"
      className="task-editor-pane__btn--close"
      onClick={onClose}
      iconOnly
    >
      <Icon name="x" />
    </Button>
    {children}
  </div>
);

export default TaskEditorPane;
