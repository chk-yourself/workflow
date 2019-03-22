import React, { Component } from 'react';
import { Icon } from '../Icon';
import { PopoverWrapper } from '../Popover';

export default class TaskEditorAssignMember extends Component {
  render() {
    const { children, isActive, onToggle, onClose } = this.props;

    return (
      <PopoverWrapper
        isActive={isActive}
        onOutsideClick={onClose}
        classes={{
          wrapper:
            'task-editor__popover-wrapper task-editor__member-search-popover-wrapper',
          popover: 'task-editor__popover task-editor__member-search-popover'
        }}
        buttonProps={{
          size: 'md',
          iconOnly: true,
          className: 'task-editor__toolbar-btn',
          children: <Icon name="users" />,
          onClick: onToggle
        }}
      >
        {children}
      </PopoverWrapper>
    );
  }
}
