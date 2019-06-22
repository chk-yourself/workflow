import React from 'react';
import { Icon } from '../Icon';
import { Menu, MenuItem } from '../Menu';
import { Popover } from '../Popover';
import { Button } from '../Button';

const TaskEditorMoreActions = ({ onDelete }) => (
  <Popover
    classes={{
      wrapper: 'task-editor__popover-wrapper',
      popover: 'task-editor__popover'
    }}
    align={{ outer: 'right', inner: 'right' }}
    buttonProps={{
      size: 'md',
      iconOnly: true,
      className: 'task-editor__toolbar-btn',
      label: 'Show more task actions',
      children: <Icon name="more-horizontal" />
    }}
  >
    <Menu>
      <MenuItem>
        <Button onClick={onDelete} className="task-editor__more-actions-btn">
          Delete task
        </Button>
      </MenuItem>
    </Menu>
  </Popover>
);

export default TaskEditorMoreActions;
