import React from 'react';
import { Popover } from '../Popover';
import { Icon } from '../Icon';
import { Menu, MenuItem } from '../Menu';

const MoreFolderActions = () => {
  return (
    <Popover
                      classes={{
                        wrapper: 'folder__popover-wrapper',
                        popover: 'folder__popover'
                      }}
                      align={{ inner: 'right' }}
                      buttonProps={{
                        size: 'md',
                        iconOnly: true,
                        className: 'folder__btn--more-actions',
                        children: <Icon name="more-vertical" />
                      }}
                    >
                      <Menu>
                        <MenuItem />
                      </Menu>
                    </Popover>
  );
};

export default MoreFolderActions;
