import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withAuthorization } from '../Session';
import { userActions, userSelectors } from '../../ducks/user';
import { boardActions, boardSelectors } from '../../ducks/boards';
import { currentActions, currentSelectors } from '../../ducks/current';
import { listActions, listSelectors } from '../../ducks/lists';
import { cardActions, cardSelectors } from '../../ducks/cards';
import { Input } from '../Input';
import { Textarea } from '../Textarea';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { Modal } from '../Modal';
import { Toolbar } from '../Toolbar';
import CardEditorMoreActions from './CardEditorMoreActions';
import './CardEditor.scss';

class CardEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardId: this.props.card.cardId,
      cardTitle: this.props.card.cardTitle,
      cardDescription: this.props.card.cardDescription,
      cardComment: '',
      currentFocus: null,
      isCommentFormFocused: false
    };
    this.commentFormRef = null;
    this.subtaskFormRef = null;
    this.setCommentFormRef = element => {
      this.commentFormRef = element;
    };
    this.setSubtaskFormRef = element => {
      this.subtaskFormRef = element;
    };
  }

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
    console.log('changed');
  };

  handleCardDelete = () => {
    const { card, firebase, onCardEditorClose } = this.props;
    const { cardId, listId } = card;
    firebase.deleteCard({ cardId, listId });
    onCardEditorClose();
  };

  onBlur = e => {
    const { card, firebase } = this.props;
    const { cardTitle, cardDescription, currentFocus } = this.state;
    const cardKey = e.target.name;

    // When field loses focus, update card if change is detected

    if (this.state[cardKey] !== card[cardKey]) {
      const { cardId } = card;
      firebase.updateCard(cardId, {
        [cardKey]: this.state[cardKey]
      });
      console.log('updated!');
    }

    this.setState({
      currentFocus: null
    });
  };

  onSubmitComment = e => {
    console.log(e.target.value);

    e.preventDefault();
  };

  onFocus = e => {
    this.setState({
      currentFocus: e.target.name
    });
  };

  handleModalClick = e => {
    const { currentFocus } = this.state;
    if (
      (currentFocus === 'cardComment' &&
        !this.commentFormRef.contains(e.target)) ||
      (currentFocus === 'cardSubtask' &&
        !this.subtaskFormRef.contains(e.target))
    ) {
      this.setState({
        currentFocus: null
      });
    }
  };

  handleMoreActions = e => {
    if (!e.target.matches('a')) return;
    const { action } = e.target.dataset;
    const { cardId } = this.props;
    switch (action) {
      case 'delete':
        this.handleCardDelete(cardId);
        break;
    }
    e.preventDefault(); // prevents page reload
  };

  render() {
    const { onCardEditorClose, user } = this.props;

    const {
      cardTitle,
      cardDescription,
      cardComment,
      currentFocus,
      cardSubtask
    } = this.state;
    const isInvalid = cardComment === '';
    const commentFormIsFocused = currentFocus === 'cardComment';

    return (
      <Modal
        onModalClose={onCardEditorClose}
        className="card-editor"
        onModalClick={this.handleModalClick}
        size="lg"
      >
        <Toolbar className="card-editor__toolbar">
          <CardEditorMoreActions onMenuClick={this.handleMoreActions} />
        </Toolbar>
        <form
          name="editCardForm"
          onFocus={this.onFocus}
          className="card-editor__edit-card-form"
        >
          <Textarea
            className="card-editor__textarea--title"
            name="cardTitle"
            value={cardTitle}
            onChange={this.onChange}
            required
            onBlur={this.onBlur}
            onFocus={this.onFocus}
          />
          <div
            className={`card-editor__section ${
              currentFocus === 'cardDescription' ? 'is-focused' : ''
            }`}
          >
            <div className="card-editor__section-icon">
              <Icon name="edit-3" />
            </div>
            <Textarea
              className="card-editor__textarea--description"
              name="cardDescription"
              value={cardDescription}
              onChange={this.onChange}
              placeholder="Add a description"
              onBlur={this.onBlur}
              onFocus={this.onFocus}
            />
          </div>
        </form>
        <div
          className={`card-editor__section ${
            currentFocus === 'cardSubtask' ? 'is-focused' : ''
          }`}
        >
          <hr className="card-editor__hr" />
          <div className="card-editor__section-icon">
            <Icon name="check-square" />
          </div>
          <form
            name="subtaskForm"
            className={`card-editor__subtask-form ${
              currentFocus === 'cardSubtask' ? 'is-focused' : ''
            }`}
            onFocus={this.onFocus}
            ref={this.setSubtaskFormRef}
          >
            <Textarea
              className="card-editor__textarea--subtask"
              name="cardSubtask"
              value={cardSubtask}
              onChange={this.onChange}
              placeholder="Add a subtask"
            />
            {currentFocus === 'cardSubtask' && (
              <Button
                type="submit"
                color="secondary"
                size="small"
                variant="contained"
                disabled={isInvalid}
                onClick={this.submitSubtask}
                className="card-editor__btn--submit-subtask"
              >
                Add subtask
              </Button>
            )}
          </form>
        </div>
        <div
          className={`card-editor__section ${
            commentFormIsFocused ? 'is-focused' : ''
          }`}
        >
          <hr className="card-editor__hr" />
          <div className="card-editor__section-icon">
            <Icon name="message-circle" />
          </div>
          <form
            name="commentForm"
            className={`card-editor__comment-form ${
              commentFormIsFocused ? 'is-focused' : ''
            }`}
            onFocus={this.onFocus}
            ref={this.setCommentFormRef}
          >
            <Textarea
              className="card-editor__textarea--comment"
              name="cardComment"
              value={cardComment}
              onChange={this.onChange}
              placeholder="Write a comment..."
            />
            {commentFormIsFocused && (
              <Button
                type="submit"
                color="secondary"
                size="small"
                variant="contained"
                disabled={isInvalid}
                onClick={this.onSubmitComment}
                name="cardCommentSubmit"
                className="card-editor__btn--submit-comment"
              >
                Comment
              </Button>
            )}
          </form>
        </div>
      </Modal>
    );
  }
}

const condition = authUser => !!authUser;

const mapStateToProps = state => {
  return {
    user: userSelectors.getUserData(state),
    boardsById: boardSelectors.getBoardsById(state),
    current: currentSelectors.getCurrent(state),
    listsById: listSelectors.getListsById(state),
    listsArray: listSelectors.getListsArray(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateBoardsById: board => dispatch(boardActions.updateBoardsById(board)),
    selectBoard: boardId => dispatch(currentActions.selectBoard(boardId)),
    updateListsById: list => dispatch(listActions.updateListsById(list)),
    updateCardsById: card => dispatch(cardActions.updateCardsById(card)),
    reorderLists: (boardId, listIds) =>
      dispatch(boardActions.reorderLists(boardId, listIds))
  };
};

export default withAuthorization(condition)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CardEditor)
);
