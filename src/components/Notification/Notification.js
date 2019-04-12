import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Timestamp } from '../Timestamp';
import { selectTask as selectTaskAction } from '../../ducks/selectedTask';
import './Notification.scss';

class Notification extends Component {
  onClick = () => {
    const { onTaskClick, source } = this.props;
    const { parent } = source;
    switch (parent.type) {
      case 'task': {
        return onTaskClick(parent.id);
      }
      default: {
        return () => null;
      }
    }
  };

  getMessage = () => {
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
      default: {
        return '';
      }
    }
  };

  render() {
    const { source, event } = this.props;
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
        {this.getMessage()}
        {publishedAt && (
          <Timestamp
            date={publishedAt.toDate()}
            className="notification__timestamp"
          />
        )}
      </li>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    selectTask: taskId => dispatch(selectTaskAction(taskId))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notification);
