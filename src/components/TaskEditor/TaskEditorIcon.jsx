import React, { memo } from 'react';
import { Icon } from '../Icon';

const TaskEditorIcon = ({ name }) => (
  <div className="task-editor__section-icon">
    <Icon name={name} />
  </div>
);

export default memo(TaskEditorIcon);
