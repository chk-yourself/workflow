import React from 'react';
import DashboardPanel from './DashboardPanel';
import { Notifications } from '../Notifications';

const DashboardNotifications = ({ userId }) => (
  <DashboardPanel
    className="notifications"
    name="Notifications"
    size="sm"
    link={{ to: `/0/inbox/${userId}`, text: 'View inbox' }}
  >
    <Notifications isActive />
  </DashboardPanel>
);

export default DashboardNotifications;
