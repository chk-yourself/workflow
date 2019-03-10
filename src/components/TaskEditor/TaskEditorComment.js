/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withAuthorization } from '../Session';
import { userActions, userSelectors } from '../../ducks/users';
import { taskActions, taskSelectors } from '../../ducks/tasks';
import { commentActions, commentSelectors } from '../../ducks/comments';
import { Icon } from '../Icon';
import { Button } from '../Button';
import { Avatar } from '../Avatar';
import { dateUtils } from '../Calendar';
import './TaskEditorComment.scss';

class TaskEditorComment extends Component {
  state = {
    secondsElapsed: 0
  };

  componentDidMount() {
    const { createdAt } = this.props.comment;
    const secondsSinceCreation =
      Math.floor(Date.now() / 1000) -
      Math.floor(createdAt.toDate().getTime() / 1000);

    this.setState({
      secondsElapsed: secondsSinceCreation
    });

    this.interval = setInterval(this.tick, 1000);
  }

  tick = () => {
    this.setState(prevState => ({
      secondsElapsed: prevState.secondsElapsed + 1
    }));
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleLikeClick = () => {
    const { handleLike, comment } = this.props;
    const { commentId } = comment;
    handleLike(commentId);
  };

  render() {
    const { user, comment } = this.props;
    const { secondsElapsed } = this.state;
    const { name, photoURL } = user;
    const {
      content,
      createdAt,
      lastUpdatedAt,
      likes,
      to,
      from,
      isPinned
    } = comment;
    if (!createdAt) return null;
    const dateCreated = createdAt.toDate();
    const timeCreated = dateCreated.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    const dateCreatedString = dateUtils.toDateString(dateCreated, {
      useRelative: true,
      format: {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: '2-digit'
      }
    });
    return (
      <div
        className={`task-editor__comment-wrapper ${
          isPinned ? 'is-pinned' : ''
        }`}
      >
        <Avatar
          classes={{
            avatar: 'task-editor__comment-avatar',
            placeholder: 'task-editor__comment-avatar-placeholder'
          }}
          fullName={name}
          size="sm"
          variant="circle"
          imgSrc={photoURL}
        />
        <div className="task-editor__comment">
          <div className="task-editor__comment-header">
            <div className="task-editor__comment-details">
              <span className="task-editor__name">{name}</span>
              <span className="task-editor__timestamp">
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
                  : `${dateCreatedString} at ${timeCreated}`}
              </span>
            </div>
            <Button
              className="task-editor__likes"
              onClick={this.handleLikeClick}
              size="sm"
            >
              <Icon name="thumbs-up" />
              <span className="task-editor__likes-counter">
                {likes.length > 0 ? likes.length : ''}
              </span>
            </Button>
          </div>
          <div className="task-editor__comment-body">{content}</div>
        </div>
      </div>
    );
  }
}

const condition = authUser => !!authUser;

const mapStateToProps = (state, ownProps) => {
  return {
    user: userSelectors.getUserData(state, ownProps.comment.from)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateTasksById: task => dispatch(taskActions.updateTasksById(task)),
    fetchTaskComments: taskId =>
      dispatch(commentActions.fetchTaskComments(taskId)),
    addComment: ({ commentId, commentData }) =>
      dispatch(commentActions.addComment({ commentId, commentData })),
    deleteComment: commentId =>
      dispatch(commentActions.deleteComment(commentId)),
    updateComment: ({ commentId, commentData }) =>
      dispatch(commentActions.updateComment({ commentId, commentData }))
  };
};

export default withAuthorization(condition)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TaskEditorComment)
);
