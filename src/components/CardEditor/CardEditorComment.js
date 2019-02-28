/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withAuthorization } from '../Session';
import { userActions, userSelectors } from '../../ducks/users';
import { currentActions, currentSelectors } from '../../ducks/current';
import { listActions, listSelectors } from '../../ducks/lists';
import { cardActions, cardSelectors } from '../../ducks/cards';
import { commentActions, commentSelectors } from '../../ducks/comments';
import { Icon } from '../Icon';
import { Button } from '../Button';
import { Avatar } from '../Avatar';
import './CardEditorComment.scss';

class CardEditorComment extends Component {
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
      text,
      createdAt,
      lastModifiedAt,
      likes,
      to,
      from,
      isPinned
    } = comment;
    if (!createdAt) return null;
    const date = new Date();
    const dateCreatedFull = createdAt.toDate();
    const timeCreated = dateCreatedFull.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    const dateCreated = dateCreatedFull.toDateString();
    const isToday = date.toDateString() === dateCreated;
    const isYesterday =
      new Date(date.setDate(date.getDate() - 1)).setHours(0, 0, 0, 0) ===
      new Date(dateCreatedFull.getTime()).setHours(0, 0, 0, 0);

    return (
      <div
        className={`card-editor__comment-wrapper ${
          isPinned ? 'is-pinned' : ''
        }`}
      >
        <Avatar
          classes={{
            avatar: 'card-editor__comment-avatar',
            placeholder: 'card-editor__comment-avatar-placeholder'
          }}
          fullName={name}
          size="sm"
          variant="circle"
          imgSrc={photoURL}
        />
        <div className="card-editor__comment">
          <div className="card-editor__comment-header">
            <div className="card-editor__comment-details">
              <span className="card-editor__name">{name}</span>
              <span className="card-editor__timestamp">
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
                  : isToday
                  ? `Today at ${timeCreated}`
                  : isYesterday
                  ? `Yesterday at ${timeCreated}`
                  : `${dateCreated} ${timeCreated}`}
              </span>
            </div>
            <Button
              className="card-editor__likes"
              onClick={this.handleLikeClick}
              size="sm"
            >
              <Icon name="thumbs-up" />
              <span className="card-editor__likes-counter">
                {likes.length > 0 ? likes.length : ''}
              </span>
            </Button>
          </div>
          <div className="card-editor__comment-body">{text}</div>
        </div>
      </div>
    );
  }
}

const condition = authUser => !!authUser;

const mapStateToProps = (state, ownProps) => {
  return {
    user: userSelectors.getUserData(state, ownProps.comment.from),
    current: currentSelectors.getCurrent(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateCardsById: card => dispatch(cardActions.updateCardsById(card)),
    fetchCardComments: cardId =>
      dispatch(commentActions.fetchCardComments(cardId)),
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
  )(CardEditorComment)
);