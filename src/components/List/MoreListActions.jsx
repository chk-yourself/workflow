import React, { memo } from 'react';
import { Popover } from '../Popover';
import { Icon } from '../Icon';
import { Menu, MenuItem } from '../Menu';
import { Button } from '../Button';

const MoreListActions = ({ isRestricted, onDelete }) => {
  return (
    <Popover
      classes={{
        wrapper: 'list__popover-wrapper',
        popover: 'list__popover'
      }}
      align={{ inner: 'right' }}
      buttonProps={{
        size: 'md',
        iconOnly: true,
        ariaLabel: 'Toggle more list actions',
        className: 'list__btn--more-actions',
        children: <Icon name="more-vertical" />
      }}
    >
      <Menu>
        <MenuItem className="list__more-actions-item">
          {!isRestricted && (
            <Button className="list__btn" onClick={onDelete}>
              Delete
            </Button>
          )}
        </MenuItem>
      </Menu>
    </Popover>
  );
};

export default memo(MoreListActions);
