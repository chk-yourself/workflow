import React from 'react';
import { Icon } from '../Icon';
import { Menu, MenuItem } from '../Menu';
import { PopoverWrapper } from '../Popover';

export default function CardEditorAssignUser({ onMenuClick }) {
  return (
    <PopoverWrapper
      wrapperClass="card-editor__popover-wrapper"
      popoverClass="card-editor__popover"
      alignOuter="right"
      alignInner="right"
      buttonProps={{
        size: 'medium',
        iconOnly: true,
        className: 'card-editor__toolbar-btn',
        children: <Icon name="user-plus" />
      }}
    >
      <Menu onClick={onMenuClick} menuRef={el => (this.menuEl = el)}>
        <MenuItem>
          <a href="" data-action="delete">
            Delete card
          </a>
        </MenuItem>
      </Menu>
    </PopoverWrapper>
  );
}
