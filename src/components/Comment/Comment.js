import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withFirebase } from '../Firebase';
import { userSelectors } from '../../ducks/users';
import { currentUserSelectors } from '../../ducks/currentUser';
import { Icon } from '../Icon';
import { Button } from '../Button';
import { Avatar } from '../Avatar';
import { toDateString } from '../../utils/date';
import { CommentEditor } from '../CommentEditor';
import './Comment.scss';

class Comment extends Component {
  state = {
    secondsElapsed: 0,
    isCommentEditorActive: false
  };

  componentDidMount() {
    const { createdAt } = this.props;
    const secondsSinceCreation =
      Math.floor(Date.now() / 1000) -
      Math.floor(createdAt.toDate().getTime() / 1000);

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

  handleLike = () => {
    const { commentId, likes, currentUserId, firebase } = this.props;

    if (likes[currentUserId]) {
      firebase.updateDoc(['comments', commentId], {
        [`likes.${currentUserId}`]: firebase.deleteField()
      });
    } else {
      firebase.updateDoc([`comments`, commentId], {
        [`likes.${currentUserId}`]: true
      });
    }
  };

  render() {
    const {
      commentId,
      user,
      content,
      createdAt,
      likes,
      to,
      from,
      isPinned
    } = this.props;
    const { secondsElapsed, isCommentEditorActive } = this.state;
    const { name, photoURL } = user;
    const likesCount = Object.keys(likes).length;
    if (!createdAt) return null;
    const dateCreated = createdAt.toDate();
    const timeCreated = dateCreated.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    const dateCreatedString = toDateString(dateCreated, {
      useRelative: true,
      format: {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: '2-digit'
      }
    });
    return (
      <div className={`comment__wrapper ${isPinned ? 'is-pinned' : ''}`}>
        <Avatar
          classes={{
            avatar: 'comment__avatar',
            placeholder: 'comment__avatar-placeholder'
          }}
          name={name}
          size="sm"
          variant="circle"
          imgSrc={photoURL}
        />
        <div className="comment">
          <div className="comment__header">
            <div className="comment__details">
              <span className="comment__name">{name}</span>
              <span className="comment__timestamp">
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
              className="comment__likes"
              onClick={this.handleLike}
              size="sm"
            >
              <Icon name="thumbs-up" />
              <span className="comment__likes-counter">
                {likesCount > 0 ? likesCount : ''}
              </span>
            </Button>
          </div>
          <CommentEditor
            key={commentId}
            commentId={commentId}
            content={content}
            isReadOnly={!isCommentEditorActive}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: userSelectors.getUserData(state, ownProps.from.userId),
    currentUserId: currentUserSelectors.getCurrentUserId(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default withFirebase(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Comment)
);
