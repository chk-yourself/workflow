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
import { Timestamp } from '../Timestamp';
import './Comment.scss';

class Comment extends Component {
  state = {
    isCommentEditorActive: false
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
    const { commentId, user, content, createdAt, likes, isPinned } = this.props;
    const { isCommentEditorActive } = this.state;
    const { name, photoURL } = user;
    const likesCount = Object.keys(likes).length;
    if (!createdAt) return null;
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
              <Timestamp
                className="comment__timestamp"
                date={createdAt.toDate()}
              />
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
