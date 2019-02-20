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
  componentDidMount() {}

  componentWillUnmount() {}

  handleLikeClick = () => {
    const { handleLike, comment } = this.props;
    const { commentId } = comment;
    handleLike(commentId);
  };

  render() {
    const { user, comment } = this.props;
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
    
    const dateCreatedFull = createdAt.toDate();
    const timeCreated  = dateCreatedFull.toLocaleTimeString('en-US');
    const dateCreated = dateCreatedFull.toDateString();
    return (
      <div
        className={`card-editor__comment-wrapper ${
          isPinned ? 'is-pinned' : ''
        }`}
      >
        <Avatar
          classes={{
            avatar: 'card-editor__avatar',
            placeholder: 'card-editor__avatar-placeholder'
          }}
          fullName={name}
          size="sm"
          variant="circle"
          imgSrc={photoURL}
        />
        <div className="card-editor__comment">
          <div className="card-editor__comment-header">
            <div className="card-editor__comment-details">
              <span className="card-editor__full-name">{name}</span>
              <span className="card-editor__time-elapsed">{`${dateCreated} ${timeCreated}`}</span>
            </div>
            <Button className="card-editor__likes" onClick={this.handleLikeClick} size="sm">
              <span className="card-editor__likes-counter">
                {likes.length > 0 ? likes.length : ''}
              </span>
              <Icon name="thumbs-up" />
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
