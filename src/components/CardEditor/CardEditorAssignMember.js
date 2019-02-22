import React from 'react';
import { Icon } from '../Icon';
import { PopoverWrapper } from '../Popover';

export default function CardEditorAssignMember({ children }) {
  return (
    <PopoverWrapper
      wrapperClass="card-editor__popover-wrapper card-editor__member-search-popover-wrapper"
      popoverClass="card-editor__popover card-editor__member-search-popover"
      alignOuter="left"
      alignInner="left"
      buttonProps={{
        size: 'md',
        iconOnly: true,
        className: 'card-editor__toolbar-btn',
        children: <Icon name="users" />
      }}
    >
      {children}
    </PopoverWrapper>
  );
}
