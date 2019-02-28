/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { withFirebase } from '../Firebase';
import { currentActions, currentSelectors } from '../../ducks/current';
import { cardActions, cardSelectors } from '../../ducks/cards';
import { subtaskActions, subtaskSelectors } from '../../ducks/subtasks';
import { userSelectors } from '../../ducks/users';
import { commentActions, commentSelectors } from '../../ducks/comments';
import { Textarea } from '../Textarea';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { Modal } from '../Modal';
import { Toolbar } from '../Toolbar';
import { Avatar } from '../Avatar';
import CardEditorAssignMember from './CardEditorAssignMember';
import CardEditorSection from './CardEditorSection';
import { MemberSearch } from '../MemberSearch';
import CardEditorMoreActions from './CardEditorMoreActions';
import * as keys from '../../constants/keys';
import * as droppableTypes from '../../constants/droppableTypes';
import CardEditorSubtask from './CardEditorSubtask';
import CardEditorComment from './CardEditorComment';
import { TagsInput } from '../TagsInput';
import './CardEditor.scss';
import { boardSelectors } from '../../ducks/boards';
import { DatePicker } from '../DatePicker';
import { MONTHS, dateUtils } from '../Calendar';

class CardEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching:
        this.props.commentIds !== undefined && this.props.commentIds.length > 0,
      cardTitle: this.props.cardTitle,
      cardDescription: this.props.cardDescription || '',
      newSubtask: '',
      cardSubtasks: this.props.subtasksArray.reduce((subtasks, subtask) => {
        const { subtaskId, text, isCompleted } = subtask;
        subtasks[subtaskId] = {
          text,
          isCompleted
        };
        return subtasks;
      }, {}),
      newComment: '',
      currentFocus: null,
      subtaskIds: this.props.subtaskIds || [],
      isColorPickerActive: false,
      currentTag: null,
      isDatePickerActive: false
    };
    this.membersListButton = React.createRef();
  }

  componentDidMount() {
    const {
      cardId,
      commentIds,
      firebase,
      fetchCardComments,
      addComment,
      deleteComment,
      updateComment
    } = this.props;

    if (commentIds && commentIds.length > 0) {
      fetchCardComments(cardId).then(() => {
        this.setState({
          isFetching: false
        });
      });
    }

    this.commentObserver = firebase.db
      .collection('comments')
      .where('cardId', '==', cardId)
      .onSnapshot(querySnapshot => {
        querySnapshot.docChanges().forEach(change => {
          const commentId = change.doc.id;
          const commentData = change.doc.data();
          if (change.type === 'added') {
            addComment({ commentId, commentData });
          }
          if (change.type === 'modified') {
            updateComment({ commentId, commentData });
          }
          if (change.type === 'removed') {
            deleteComment(commentId);
          }
        });
      });
  }

  static getDerivedStateFromProps(props, state) {
    if ('subtaskIds' in props === false) return null;
    if (props.subtaskIds.length !== state.subtaskIds.length) {
      return {
        cardSubtasks: props.subtasksArray.reduce((subtasks, subtask) => {
          const { subtaskId, text, isCompleted } = subtask;
          subtasks[subtaskId] = {
            text,
            isCompleted
          };
          return subtasks;
        }, {}),
        subtaskIds: props.subtaskIds
      };
    }
    return null;
  }

  updateCardSubtasks = () => {
    const { subtasksArray } = this.props;
    this.setState({
      cardSubtasks: subtasksArray.reduce((subtasks, subtask) => {
        const { subtaskId, text, isCompleted } = subtask;
        subtasks[subtaskId] = {
          text,
          isCompleted
        };
        return subtasks;
      }, {})
    });
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  deleteCard = () => {
    const { cardId, listId, firebase, handleCardEditorClose } = this.props;
    firebase.deleteCard({ cardId, listId });
    handleCardEditorClose();
  };

  onBlur = e => {
    const { [cardKey]: currentValue, cardId, firebase } = this.props;
    const cardKey = e.target.name;
    const { [cardKey]: updatedValue } = this.state;

    // When field loses focus, update card if change is detected

    if (updatedValue !== currentValue) {
      firebase.updateCard(cardId, {
        [cardKey]: updatedValue
      });
      console.log('updated!');
    }

    this.setState({
      currentFocus: null
    });
  };

  addComment = e => {
    if (e.type === 'keydown' && e.key !== keys.ENTER) return;
    const { userId, firebase, cardId, boardId } = this.props;
    const { newComment: text } = this.state;
    firebase.addComment({ userId, text, cardId, boardId });
    this.resetForm('newComment');
    e.preventDefault();
  };

  resetForm = key => {
    this.setState({
      [key]: ''
    });
  };

  addSubtask = e => {
    if (e.type === 'keydown' && e.key !== keys.ENTER) return;
    const { userId, firebase, cardId, boardId } = this.props;
    const { newSubtask: text } = this.state;
    firebase.addSubtask({ userId, text, cardId, boardId });
    this.resetForm('newSubtask');
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
      (currentFocus === 'newComment' &&
        !this.commentFormEl.contains(e.target)) ||
      (currentFocus === 'newSubtask' &&
        !this.newSubtaskFormEl.contains(e.target))
    ) {
      this.setState({
        currentFocus: null
      });
    }
  };

  handleMoreActions = e => {
    if (!e.target.matches('a')) return;
    const { action } = e.target.dataset;
    switch (action) {
      case 'delete':
        this.deleteCard();
        break;
    }
    e.preventDefault(); // prevents page reload
  };

  onSubtaskChange = e => {
    const { cardSubtasks } = this.state;
    this.setState({
      cardSubtasks: {
        ...cardSubtasks,
        [e.target.name]: {
          ...cardSubtasks[e.target.name],
          text: e.target.value
        }
      }
    });
  };

  handleCheckboxChange = e => {
    const subtaskId = e.target.name;
    this.toggleSubtaskCompleted(subtaskId);
  };

  toggleSubtaskCompleted = subtaskId => {
    const { isCompleted } = this.state.cardSubtasks[subtaskId];
    this.setState(prevState => ({
      cardSubtasks: {
        ...prevState.cardSubtasks,
        [subtaskId]: {
          ...prevState.cardSubtasks[subtaskId],
          isCompleted: !prevState.cardSubtasks[subtaskId].isCompleted
        }
      }
    }));
    const { firebase } = this.props;
    firebase.updateSubtask(subtaskId, { isCompleted: !isCompleted });
  };

  updateSubtaskText = e => {
    const subtaskId = e.target.name;
    const { cardSubtasks } = this.state;
    const { text } = cardSubtasks[subtaskId];
    const { firebase } = this.props;
    firebase.updateSubtask(subtaskId, { text });
  };

  deleteSubtask = e => {
    if (e.target.value !== '' || e.key !== keys.BACKSPACE) return;
    const { cardId, firebase } = this.props;
    const subtaskId = e.target.name;
    firebase.deleteSubtask({ subtaskId, cardId });
  };

  moveSubtask = ({ destination, draggableId, source }) => {
    if (!destination) return;
    if (destination.index === source.index) return;
    const { firebase } = this.props;
    const { subtaskIds } = this.state;
    const updatedSubtaskIds = [...subtaskIds];
    updatedSubtaskIds.splice(source.index, 1);
    updatedSubtaskIds.splice(destination.index, 0, draggableId);
    this.setState({
      subtaskIds: updatedSubtaskIds
    });
    firebase.updateCard(source.droppableId, {
      subtaskIds: updatedSubtaskIds
    });
  };

  handleCommentLike = commentId => {
    const { firebase, userId, commentsById } = this.props;
    const { likes } = commentsById[commentId];

    if (likes.indexOf(userId) === -1) {
      firebase.updateComment(commentId, {
        likes: firebase.addToArray(userId)
      });
    } else {
      firebase.updateComment(commentId, {
        likes: firebase.removeFromArray(userId)
      });
    }
  };

  assignMember = userId => {
    const { cardId, boardId, assignedTo, firebase } = this.props;

    if (assignedTo.indexOf(userId) !== -1) {
      firebase.updateCard(cardId, {
        assignedTo: firebase.removeFromArray(userId),
        lastModifiedAt: firebase.getTimestamp()
      });
    } else {
      firebase.assignCard({ cardId, boardId, userId });
    }
  };

  toggleColorPicker = value => {
    this.setState({
      isColorPickerActive: value
    });
  };

  addTag = text => {
    console.log(text);
    const {
      firebase,
      currentUser,
      boardTags,
      cardId,
      boardId,
      addTag
    } = this.props;
    const { userId, tags: userTags } = currentUser;
    const isBoardTag = boardTags && text in boardTags;
    const isUserTag = userTags && text in userTags;
    const tagData = isBoardTag
      ? boardTags[text]
      : isUserTag
      ? userTags[text]
      : { boardId, text };

    firebase
      .addTag({
        userId,
        cardId,
        boardId,
        ...tagData
      })
      .then(() => {
        if (!isUserTag && !isBoardTag) {
          this.setState({
            currentTag: text
          });
          this.toggleColorPicker(true);
        }
      });
  };

  setTagColor = color => {
    const { userId, boardId, firebase } = this.props;
    const { currentTag: tag } = this.state;
    firebase.setTagColor({ userId, boardId, tag, color });
  };

  removeTag = tag => {
    const { cardId, firebase } = this.props;
    firebase.removeTag({ cardId, tag });
    this.toggleColorPicker(false);
  };

  setDueDate = date => {
    const { firebase, cardId } = this.props;

    firebase.updateCard(cardId, {
      dueDate: date
    });
  };

  toggleDatePicker = () => {
    this.setState(prevState => ({
      isDatePickerActive: !prevState.isDatePickerActive
    }));
  };

  componentWillUnmount() {
    this.commentObserver();
  }

  render() {
    const {
      handleCardEditorClose,
      cardId,
      commentIds,
      assignedTo,
      commentsArray,
      usersArray,
      membersArray,
      currentUser,
      cardTags,
      mergedTags,
      dueDate
    } = this.props;
    const {
      cardTitle,
      cardDescription,
      newComment,
      currentFocus,
      newSubtask,
      cardSubtasks,
      subtaskIds,
      isFetching,
      isColorPickerActive,
      isDatePickerActive,
      currentTag
    } = this.state;
    const hasSubtasks = subtaskIds !== undefined && subtaskIds.length > 0;
    const hasComments = commentIds !== undefined && commentIds.length > 0;
    const isAssigned = !!assignedTo && assignedTo.length > 0;
    const isNewCommentInvalid = newComment === '';
    const isNewSubtaskInvalid = newSubtask === '';
    const commentFormIsFocused = currentFocus === 'newComment';
    const newSubtaskFormIsFocused = currentFocus === 'newSubtask';
    const cardDueDate = dueDate
      ? dateUtils.getSimpleDate(dueDate.toDate())
      : dateUtils.getSimpleDate(new Date());

    if (isFetching) return null;

    return (
      <Modal
        onModalClose={handleCardEditorClose}
        className="card-editor"
        onModalClick={this.handleModalClick}
        size="lg"
        id="cardEditor"
      >
        <Toolbar className="card-editor__toolbar">
          <CardEditorAssignMember buttonRef={this.membersListButton}>
            <MemberSearch
              users={usersArray}
              assignedMembers={assignedTo}
              onMemberClick={this.assignMember}
            />
          </CardEditorAssignMember>
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
          <CardEditorSection>
            <Button
              onClick={this.toggleDatePicker}
              type="button"
              className={`card-editor__btn--due-date ${
                isDatePickerActive ? 'is-active' : ''
              }`}
            >
              <span className="card-editor__due-date-icon">
                <Icon name="calendar" />
              </span>
              <span className="card-editor__due-date-wrapper">
                {!dueDate ? (
                  <span className="card-editor__no-due-date">Set due date</span>
                ) : (
                  <>
                    <span className="card-editor__section-title--sm">
                      Due Date
                    </span>
                    <span className="card-editor__due-date">{`${
                      MONTHS[cardDueDate.month].short
                    } ${cardDueDate.day}`}</span>
                  </>
                )}
              </span>
            </Button>
            {isDatePickerActive && (
              <DatePicker
                onClose={this.toggleDatePicker}
                selectedDay={dueDate ? cardDueDate : null}
                currentMonth={cardDueDate.month}
                currentYear={cardDueDate.year}
                selectDate={this.setDueDate}
              />
            )}
          </CardEditorSection>
          <CardEditorSection>
            <div className="card-editor__section-icon">
              <Icon name="user" />
            </div>
            {isAssigned && (
              <div className="card-editor__members">
                {membersArray.map(member => {
                  const { name, photoURL, userId } = member;
                  return (
                    <Avatar
                      classes={{
                        avatar: 'card-editor__avatar',
                        placeholder: 'card-editor__avatar-placeholder'
                      }}
                      fullName={name}
                      size="sm"
                      variant="circle"
                      imgSrc={photoURL}
                      key={userId}
                    />
                  );
                })}
              </div>
            )}
            <Button
              type="button"
              className="card-editor__btn--add-member"
              onClick={() => this.membersListButton.current.click()}
            >
              <Icon name="plus" />
            </Button>
          </CardEditorSection>
          <CardEditorSection>
            <div className="card-editor__section-icon">
              <Icon name="tag" />
            </div>
            <TagsInput
              addTag={this.addTag}
              tagSuggestions={mergedTags}
              assignedTags={cardTags}
              isColorPickerActive={isColorPickerActive}
              setTagColor={this.setTagColor}
              removeTag={this.removeTag}
              currentTag={currentTag}
            />
          </CardEditorSection>
          <CardEditorSection>
            <div className="card-editor__section-icon">
              <Icon name="edit-3" />
            </div>
            <Textarea
              className="card-editor__textarea card-editor__textarea--description"
              name="cardDescription"
              value={cardDescription}
              onChange={this.onChange}
              placeholder="Add a description"
              onBlur={this.onBlur}
              onFocus={this.onFocus}
            />
          </CardEditorSection>
        </form>
        <CardEditorSection>
          <div className="card-editor__section-header">
            <div className="card-editor__section-icon">
              <Icon name="check-square" />
            </div>
            <h3 className="card-editor__section-title">Subtasks</h3>
            <hr className="card-editor__hr" />
          </div>
          {hasSubtasks && (
            <DragDropContext onDragEnd={this.moveSubtask}>
              <Droppable droppableId={cardId} type={droppableTypes.TASK}>
                {provided => (
                  <ul
                    className="card-editor__subtasks"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {subtaskIds.map((subtaskId, index) => {
                      return (
                        <CardEditorSubtask
                          subtaskId={subtaskId}
                          index={index}
                          text={cardSubtasks[subtaskId].text}
                          isCompleted={cardSubtasks[subtaskId].isCompleted}
                          toggleCompleted={this.handleCheckboxChange}
                          onChange={this.onSubtaskChange}
                          onBlur={this.updateSubtaskText}
                          onKeyDown={this.deleteSubtask}
                          key={subtaskId}
                        />
                      );
                    })}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
          )}
          <div className="card-editor__section-icon">
            {newSubtaskFormIsFocused ? (
              <div className="card-editor__checkbox" />
            ) : (
              <Icon name="plus-circle" />
            )}
          </div>
          <form
            name="newSubtaskForm"
            className={`card-editor__new-subtask-form ${
              currentFocus === 'newSubtask' ? 'is-focused' : ''
            }`}
            ref={el => (this.newSubtaskFormEl = el)}
            onSubmit={this.addSubtask}
          >
            <Textarea
              className="card-editor__textarea card-editor__textarea--new-subtask"
              name="newSubtask"
              value={newSubtask}
              onChange={this.onChange}
              placeholder="Add a subtask"
              onFocus={this.onFocus}
              onKeyDown={this.addSubtask}
            />
            {currentFocus === 'newSubtask' && (
              <Button
                type="submit"
                color="primary"
                size="small"
                variant="contained"
                disabled={isNewSubtaskInvalid}
                onClick={this.addSubtask}
                className="card-editor__btn--add-subtask"
              >
                Add subtask
              </Button>
            )}
          </form>
        </CardEditorSection>
        <CardEditorSection>
          <div className="card-editor__section-header">
            <div className="card-editor__section-icon">
              <Icon name="message-circle" />
            </div>
            <h3 className="card-editor__section-title">Comments</h3>
            <hr className="card-editor__hr" />
          </div>

          {hasComments && (
            <div className="card-editor__comments">
              {commentsArray.map(comment => {
                const { commentId } = comment;
                return (
                  <CardEditorComment
                    key={commentId}
                    comment={comment}
                    handleLike={this.handleCommentLike}
                  />
                );
              })}
            </div>
          )}
          <Avatar
            classes={{
              avatar: 'card-editor__avatar',
              placeholder: 'card-editor__avatar-placeholder'
            }}
            fullName={currentUser.name}
            size="sm"
            variant="circle"
            imgSrc={currentUser.photoURL}
          />
          <form
            name="commentForm"
            className={`card-editor__comment-form ${
              commentFormIsFocused ? 'is-focused' : ''
            }`}
            ref={el => (this.commentFormEl = el)}
            onSubmit={this.addComment}
          >
            <Textarea
              className="card-editor__textarea card-editor__textarea--comment"
              name="newComment"
              value={newComment}
              onChange={this.onChange}
              placeholder="Write a comment..."
              onFocus={this.onFocus}
              onKeyDown={this.addComment}
            />
            {commentFormIsFocused && (
              <Button
                type="submit"
                color="primary"
                size="small"
                variant="contained"
                disabled={isNewCommentInvalid}
                onClick={this.addComment}
                name="newCommentSubmit"
                className="card-editor__btn--submit-comment"
              >
                Send
              </Button>
            )}
          </form>
        </CardEditorSection>
      </Modal>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: userSelectors.getCurrentUserData(state),
    subtasksArray: subtaskSelectors.getSubtasksArray(
      state,
      ownProps.subtaskIds
    ),
    commentsArray: commentSelectors.getCommentsArray(
      state,
      ownProps.commentIds
    ),
    commentsById: commentSelectors.getCommentsById(state),
    usersArray: userSelectors.getUsersArray(state),
    membersArray: userSelectors.getMembersArray(state, ownProps.assignedTo),
    cardTags: cardSelectors.getCardTags(state, ownProps),
    mergedTags: currentSelectors.getMergedTags(state),
    boardTags: boardSelectors.getBoardTags(state, ownProps.boardId)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchCardComments: cardId =>
      dispatch(commentActions.fetchCardComments(cardId)),
    addComment: ({ commentId, commentData }) =>
      dispatch(commentActions.addComment({ commentId, commentData })),
    deleteComment: commentId =>
      dispatch(commentActions.deleteComment(commentId)),
    updateComment: ({ commentId, commentData }) =>
      dispatch(commentActions.updateComment({ commentId, commentData })),
    addTag: (cardId, tag) => dispatch(cardActions.addTag(cardId, tag))
  };
};

export default withFirebase(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CardEditor)
);
