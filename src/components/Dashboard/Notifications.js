import React, { Component } from 'react';
import DashboardPanel from './DashboardPanel';

class Notifications extends Component {
  render() {
    return <DashboardPanel icon="bell" name="Notifications" size="sm" />;
  }
}
