import React from 'react';
import { Icon } from '../Icon';
import { Menu, MenuItem } from '../Menu';
import { PopoverWrapper } from '../Popover';

const CardEditorMoreActions = ({ onMenuClick }) => (
  <PopoverWrapper
    wrapperClass="card-editor__popover-wrapper"
    popoverClass="card-editor__popover"
    alignOuter="right"
    alignInner="right"
    buttonProps={{
      size: 'medium',
      iconOnly: true,
      className: 'card-editor__toolbar-btn',
      children: <Icon name="more-horizontal" />
    }}
  >
    <Menu onClick={onMenuClick}>
      <MenuItem>
        <a href="" data-action="delete">
          Delete card
        </a>
      </MenuItem>
    </Menu>
  </PopoverWrapper>
);

export default CardEditorMoreActions;
