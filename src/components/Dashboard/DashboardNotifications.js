import React from 'react';
import DashboardPanel from './DashboardPanel';
import { Notifications } from '../Notifications';

const DashboardNotifications = ({ userId }) => (
  <DashboardPanel
    className="notifications"
    name="Notifications"
    size="sm"
    link={{ path: `/0/inbox/${userId}`, text: 'View inbox' }}
  >
    <Notifications isActive />
  </DashboardPanel>
);

export default DashboardNotifications;
