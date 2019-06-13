import React, { Component } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withAuthorization } from '../Session';
import { Timestamp } from '../Timestamp';
import { Button } from '../Button';
import { selectTask as selectTaskAction } from '../../ducks/selectedTask';

class Notification extends Component {
  onClick = () => {
    const { onClickTask, source } = this.props;
    const { parent } = source;
    switch (parent.type) {
      case 'task': {
        return onClickTask(parent.id);
      }
      default: {
        return () => null;
      }
    }
  };

  setActiveStatus = () => {
    const { notificationId, firebase, isActive } = this.props;
    firebase.updateDoc(['notifications', notificationId], {
      isActive: !isActive
    });
  };

  acceptInvite = () => {
    const { notificationId, firebase, source, currentUser } = this.props;
    if (source.type === 'workspace') {
      firebase.acceptWorkspaceInvite({
        user: {
          userId: currentUser.userId,
          email: currentUser.email,
          name: currentUser.name
        },
        workspace: {
          id: source.id,
          name: source.data.name
        },
        from: source.user.userId,
        notificationId
      });
    }
  };

  declineInvite = () => {
    const { notificationId, firebase, source, currentUser } = this.props;
    if (source.type === 'workspace') {
      firebase.declineWorkspaceInvite({
        user: {
          userId: currentUser.userId,
          email: currentUser.email,
          name: currentUser.name
        },
        workspace: {
          id: source.id,
          name: source.data.name
        },
        from: source.user.userId,
        notificationId
      });
    }
  };

  renderMessage = () => {
    const { event, source } = this.props;
    switch (event.type) {
      case 'mention': {
        return (
          <>
            mentioned you in a
            <a
              href="#"
              className="notification__link notification__link--task"
              onClick={this.onClick}
            >
              {source.type}
            </a>
            .
          </>
        );
      }
      case 'invite': {
        return (
          <>
            invited you to join <strong>{source.data.name}</strong>.
          </>
        );
      }
      case 'rsvp': {
        return (
          <>
            {event.data.state} your invitation to{' '}
            <strong>{source.data.name}</strong>.
          </>
        );
      }
      default: {
        return '';
      }
    }
  };

  renderRequiredActions = () => {
    const { event } = this.props;
    switch (event.type) {
      case 'invite': {
        return (
          <>
            <Button
              className="notification__btn notification__btn--decline"
              variant="text"
              color="primary"
              size="sm"
              onClick={this.declineInvite}
            >
              Decline
            </Button>
            <Button
              className="notification__btn notification__btn--accept"
              variant="contained"
              color="primary"
              size="sm"
              onClick={this.acceptInvite}
            >
              Accept
            </Button>
          </>
        );
      }
      default: {
        return '';
      }
    }
  };

  render() {
    const { source, event, isActionPending, isActive } = this.props;
    const { user } = source;
    const { publishedAt } = event;

    return (
      <li className="notification">
        {user.userId && (
          <Link
            className="notification__link notification__link--user-profile"
            to={`/0/${user.userId}/profile`}
          >
            {user.name}
          </Link>
        )}
        {this.renderMessage()}
        <div className="notification__footer">
          {publishedAt && (
            <Timestamp
              date={publishedAt.toDate()}
              className="notification__timestamp"
            />
          )}
          <div className="notification__actions">
            {isActionPending ? (
              this.renderRequiredActions()
            ) : (
              <Button
                onClick={this.setActiveStatus}
                size="sm"
                className="notification__btn notification__btn--archive"
              >
                {isActive ? 'Archive' : 'Unarchive'}
              </Button>
            )}
          </div>
        </div>
      </li>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    selectTask: taskId => dispatch(selectTaskAction(taskId))
  };
};

const condition = currentUser => !!currentUser;

export default compose(
  connect(
    null,
    mapDispatchToProps
  ),
  withAuthorization(condition)
)(Notification);
