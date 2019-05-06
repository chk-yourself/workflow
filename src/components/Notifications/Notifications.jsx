import React from 'react';
import { connect } from 'react-redux';
import { withAuthorization } from '../Session';
import Notification from './Notification';
import { currentUserSelectors } from '../../ducks/currentUser';
import { selectTask as selectTaskAction } from '../../ducks/selectedTask';
import './Notifications.scss';

const Notifications = ({ notifications, selectTask, isActive }) =>
  notifications.length > 0 ? (
    <ul className="notifications__list">
      {notifications.map(notification => (
        <Notification
          key={notification.notificationId}
          onClickTask={
            notification.source.type === 'comment' ? selectTask : null
          }
          {...notification}
        />
      ))}
    </ul>
  ) : (
    <p className="notifications__info--empty">
      {isActive
        ? 'You have no active notifications.'
        : "You haven't archived any notifications yet."}
    </p>
  );

const mapStateToProps = (state, ownProps) => {
  return {
    notifications: currentUserSelectors.getNotifications(
      state,
      ownProps.isActive
    )
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectTask: taskId => dispatch(selectTaskAction(taskId))
  };
};

const condition = (currentUser, activeWorkspace) =>
  !!currentUser && !!activeWorkspace;

export default withAuthorization(condition)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Notifications)
);
