import React, { memo } from 'react';
import { Icon } from '../Icon';

const SidebarIcon = ({ name }) => {
  return <Icon name={name} className="sidebar__icon" />;
};

export default memo(SidebarIcon);
