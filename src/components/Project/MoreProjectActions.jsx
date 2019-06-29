import React, { memo } from 'react';
import { Popover } from '../Popover';
import { Icon } from '../Icon';
import { Menu, MenuItem } from '../Menu';
import { Button } from '../Button';

const MoreProjectActions = ({ onDelete, onDuplicate, allowDelete }) => {
  return (
    <Popover
      classes={{
        wrapper: 'project__more-actions-wrapper',
        popover: 'project__more-actions'
      }}
      align={{ inner: 'right' }}
      buttonProps={{
        size: 'sm',
        iconOnly: true,
        className: 'project__btn--more-actions',
        children: <Icon name="chevron-down" />
      }}
    >
      <Menu>
        <MenuItem className="project__more-actions-item">
          <Button
            className="project__more-actions-btn"
            onClick={onDelete}
            disabled={!allowDelete}
          >
            Delete Project
          </Button>
          <Button className="project__more-actions-btn" onClick={onDuplicate}>
            Duplicate Project
          </Button>
        </MenuItem>
      </Menu>
    </Popover>
  );
};

export default memo(MoreProjectActions);
