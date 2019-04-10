import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withAuthorization } from '../Session';
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
    const { currentUser, syncNotifications } = this.props;
    const { userId } = currentUser;

    this.unsubscribe = await syncNotifications(userId);
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
    return (
      <DashboardPanel className="notifications" name="Notifications" size="sm">
        {notifications.length > 0 ? (
          <ul className="notifications__list">
            {notifications.map(notification => (
              <Notification
                key={notification.notificationId}
                onTaskClick={
                  notification.source.type === 'comment' ? onTaskClick : null
                }
                {...notification}
              />
            ))}
          </ul>
        ) : (
          <div className="dashboard__info--empty">
            You have no notifications.
          </div>
        )}
      </DashboardPanel>
    );
  }
}

const mapStateToProps = state => {
  return {
    notifications: currentUserSelectors.getNotificationsArray(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    syncNotifications: userId =>
      dispatch(currentUserActions.syncNotifications(userId))
  };
};

const condition = currentUser => !!currentUser;

export default withAuthorization(condition)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Notifications)
);
