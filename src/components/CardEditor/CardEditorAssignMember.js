import React, { Component } from 'react';
import { Icon } from '../Icon';
import { PopoverWrapper } from '../Popover';

export default class CardEditorAssignMember extends Component {
  render() {
    const { children } = this.props;

    return (
      <PopoverWrapper
        classes={{
          wrapper: "card-editor__popover-wrapper card-editor__member-search-popover-wrapper",
          popover: "card-editor__popover card-editor__member-search-popover"
        }}
        alignOuter="left"
        alignInner="left"
        buttonProps={{
          size: 'md',
          iconOnly: true,
          className: 'card-editor__toolbar-btn',
          children: <Icon name="users" />,
          buttonRef: this.props.buttonRef
        }}
      >
        {children}
      </PopoverWrapper>
    );
  }
}
