import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toDateString } from '../../utils/date';
import { Link } from 'react-router-dom';
import {
  selectTask as selectTaskAction,
  getSelectedTaskId
} from '../../ducks/selectedTask';
import './Notification.scss';

class Notification extends Component {
  state = {
    secondsElapsed: 0
  };

  componentDidMount() {
    const { publishedAt } = this.props.event;
    if (!publishedAt) return;
    const secondsSinceCreation =
      Math.floor(Date.now() / 1000) -
      Math.floor(publishedAt.toDate().getTime() / 1000);

    this.setState({
      secondsElapsed: secondsSinceCreation
    });

    this.interval = setInterval(this.tick, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  tick = () => {
    this.setState(prevState => ({
      secondsElapsed: prevState.secondsElapsed + 1
    }));
  };

  getMessage = () => {
    const { event, source, onTaskClick } = this.props; 
    switch (event.type) {
      case 'mention': {
        return (
          <>
          mentioned you in a
          <a href="#" className="notification__link notification__link--task" onClick={() => onTaskClick(source.taskId)}>
          {source.type}
          </a>.
        </>)
      }
      default: {
        return ''
      }
    }
  }


  render() {
    const { secondsElapsed } = this.state;
    const { source, event, onTaskClick } = this.props;
    const { user } = source;
    const { publishedAt } = event;
    const datePublished = publishedAt ? publishedAt.toDate() : null;
    const timePublished = publishedAt ? datePublished.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }) : null;
    const datePublishedString = publishedAt ? toDateString(datePublished, {
      useRelative: true,
      format: {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: '2-digit'
      }
    }) : null;
  return (
    <li className="notification">
    {user.userId && (
      <Link className="notification__link notification__link--user-profile" to={`/0/${user.userId}/profile`}>
        {user.name}
      </Link>
    )
    }{this.getMessage()}
    {event.publishedAt && (
      <span className="notification__timestamp">
      {secondsElapsed < 60 // less than one minute
                  ? 'Just now'
                  : secondsElapsed < 120 // less than 2 minutes
                  ? '1 minute ago'
                  : secondsElapsed < 3600 // less than 1 hour
                  ? `${Math.floor(secondsElapsed / 60)} minutes ago`
                  : secondsElapsed < 7200 // less than 2 hours
                  ? '1 hour ago'
                  : secondsElapsed < 21600 // less than 6 hours
                  ? `${Math.floor(secondsElapsed / 3600)} hours ago`
                  : `${datePublishedString} at ${timePublished}`}
      </span>
    )}
    </li>
  )
    }
}

const mapStateToProps = state => {
  return {
  }
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