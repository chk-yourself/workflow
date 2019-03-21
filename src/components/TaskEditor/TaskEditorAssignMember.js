import React, { Component } from 'react';
import { Icon } from '../Icon';
import { PopoverWrapper } from '../Popover';

export default class TaskEditorAssignMember extends Component {
  render() {
    const { children } = this.props;

    return (
      <PopoverWrapper
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
          buttonRef: this.props.buttonRef
        }}
      >
        {children}
      </PopoverWrapper>
    );
  }
}
