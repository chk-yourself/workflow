import React from 'react';
import { Icon } from '../Icon';
import { Menu, MenuItem } from '../Menu';
import { PopoverWrapper } from '../Popover';

const TaskEditorMoreActions = ({ onMenuClick }) => (
  <PopoverWrapper
    classes={{
      wrapper: 'task-editor__popover-wrapper',
      popover: 'task-editor__popover'
    }}
    alignOuter="right"
    alignInner="right"
    buttonProps={{
      size: 'md',
      iconOnly: true,
      className: 'task-editor__toolbar-btn',
      children: <Icon name="more-horizontal" />
    }}
  >
    <Menu onClick={onMenuClick}>
      <MenuItem>
        <a href="" data-action="delete">
          Delete task
        </a>
      </MenuItem>
    </Menu>
  </PopoverWrapper>
);

export default TaskEditorMoreActions;
