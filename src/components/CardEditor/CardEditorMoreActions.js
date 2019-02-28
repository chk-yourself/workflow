import React from 'react';
import { Icon } from '../Icon';
import { Menu, MenuItem } from '../Menu';
import { PopoverWrapper } from '../Popover';

const CardEditorMoreActions = ({ onMenuClick }) => (
  <PopoverWrapper
    classes={{
      wrapper: 'card-editor__popover-wrapper',
      popover: 'card-editor__popover'
    }}
    alignOuter="right"
    alignInner="right"
    buttonProps={{
      size: 'md',
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
