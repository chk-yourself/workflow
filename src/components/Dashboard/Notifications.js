import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withFirebase } from '../Firebase';
import DashboardPanel from './DashboardPanel';
import { Notification } from '../Notification';
import {
  currentUserActions,
  currentUserSelectors
} from '../../ducks/currentUser';
import './Notifications.scss';

class Notifications extends Component {
  state = {
    isLoading: true
  };

  async componentDidMount() {
    const {
      currentUserId,
      syncNotifications,
      firebase
    } = this.props;
    
    this.unsubscribe = await syncNotifications(currentUserId);
    this.setState({
      isLoading: false
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }


  render() {
    const { isLoading } = this.state;
    const { notifications, onTaskClick } = this.props;
    if (isLoading) return null;
    return <DashboardPanel icon="bell" name="Notifications" size="sm">
    <ul className="notifications__list">
    {notifications.map(notification => (
      <Notification key={notification.notificationId} onTaskClick={notification.source.type === 'comment' ? onTaskClick : null} {...notification} />
    ))
    }
    </ul>
    </DashboardPanel>
    ;
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentUserId: currentUserSelectors.getCurrentUserId(state),
    notifications: currentUserSelectors.getNotificationsArray(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    syncNotifications: userId =>
      dispatch(currentUserActions.syncNotifications(userId))
  };
};

export default withFirebase(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Notifications)
);
