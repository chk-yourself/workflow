import React from 'react';
import { Icon } from '../Icon';
import { Menu, MenuItem } from '../Menu';
import { PopoverWrapper } from '../Popover';
import { Button } from '../Button';

const TaskEditorMoreActions = ({ onDelete }) => (
  <PopoverWrapper
    classes={{
      wrapper: 'task-editor__popover-wrapper',
      popover: 'task-editor__popover'
    }}
    align={{ outer: 'right', inner: 'right' }}
    buttonProps={{
      size: 'md',
      iconOnly: true,
      className: 'task-editor__toolbar-btn',
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
  </PopoverWrapper>
);

export default TaskEditorMoreActions;
