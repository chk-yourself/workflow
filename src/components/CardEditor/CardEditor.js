import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { withAuthorization } from '../Session';
import { currentActions, currentSelectors } from '../../ducks/current';
import { cardActions, cardSelectors } from '../../ducks/cards';
import { taskActions, taskSelectors } from '../../ducks/tasks';
import { userSelectors } from '../../ducks/users';
import { commentActions, commentSelectors } from '../../ducks/comments';
import { Textarea } from '../Textarea';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { Modal } from '../Modal';
import { Toolbar } from '../Toolbar';
import CardEditorAssignUser from './CardEditorAssignUser';
import { MemberSearch } from '../MemberSearch';
import CardEditorMoreActions from './CardEditorMoreActions';
import * as keys from '../../constants/keys';
import * as droppableTypes from '../../constants/droppableTypes';
import CardEditorTask from './CardEditorTask';
import CardEditorComment from './CardEditorComment';
import './CardEditor.scss';


class CardEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching:
        this.props.card.commentIds !== undefined &&
        this.props.card.commentIds.length > 0,
      cardTitle: this.props.card.cardTitle,
      cardDescription: this.props.card.cardDescription,
      newTask: '',
      cardTasks: this.props.tasksArray.reduce((tasks, task) => {
        const { taskId, text, isCompleted } = task;
        tasks[taskId] = {
          text,
          isCompleted
        };
        return tasks;
      }, {}),
      newComment: '',
      currentFocus: null,
      taskIds: this.props.card.taskIds
    };
  }

  componentDidMount() {
    const {
      card,
      firebase,
      fetchCardComments,
      addComment,
      deleteComment,
      updateComment
    } = this.props;

    const { cardId, commentIds } = card;

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
    if ('taskIds' in props.card === false) return null;
    if (props.card.taskIds.length !== state.taskIds.length) {
      return {
        cardTasks: props.tasksArray.reduce((tasks, task) => {
          const { taskId, text, isCompleted } = task;
          tasks[taskId] = {
            text,
            isCompleted
          };
          return tasks;
        }, {}),
        taskIds: props.card.taskIds
      };
    }
    return null;
  }

  updateCardTasks = () => {
    const { tasksArray } = this.props;
    this.setState({
      cardTasks: tasksArray.reduce((tasks, task) => {
        const { taskId, text, isCompleted } = task;
        tasks[taskId] = {
          text,
          isCompleted
        };
        return tasks;
      }, {})
    });
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  deleteCard = () => {
    const { card, firebase, handleCardEditorClose } = this.props;
    const { cardId, listId } = card;
    firebase.deleteCard({ cardId, listId });
    handleCardEditorClose();
  };

  onBlur = e => {
    const { card, firebase } = this.props;
    const cardKey = e.target.name;
    const { [cardKey]: updatedValue } = this.state;

    // When field loses focus, update card if change is detected

    if (updatedValue !== card[cardKey]) {
      const { cardId } = card;
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
    const { userId, firebase, card } = this.props;
    const { cardId, boardId } = card;
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

  addTask = e => {
    if (e.type === 'keydown' && e.key !== keys.ENTER) return;
    const { userId, firebase, card } = this.props;
    const { cardId, boardId } = card;
    const { newTask: text } = this.state;
    firebase.addTask({ userId, text, cardId, boardId });
    this.resetForm('newTask');
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
      (currentFocus === 'newTask' && !this.newTaskFormEl.contains(e.target))
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

  onTaskChange = e => {
    const { cardTasks } = this.state;
    this.setState({
      cardTasks: {
        ...cardTasks,
        [e.target.name]: {
          ...cardTasks[e.target.name],
          text: e.target.value
        }
      }
    });
  };

  handleCheckboxChange = e => {
    const taskId = e.target.name;
    this.toggleTaskCompleted(taskId);
  };

  toggleTaskCompleted = taskId => {
    const { isCompleted } = this.state.cardTasks[taskId];
    this.setState(prevState => ({
      cardTasks: {
        ...prevState.cardTasks,
        [taskId]: {
          ...prevState.cardTasks[taskId],
          isCompleted: !prevState.cardTasks[taskId].isCompleted
        }
      }
    }));
    const { firebase } = this.props;
    firebase.updateTask(taskId, { isCompleted: !isCompleted });
  };

  updateTaskText = e => {
    const taskId = e.target.name;
    const { cardTasks } = this.state;
    const { text } = cardTasks[taskId];
    const { firebase } = this.props;
    firebase.updateTask(taskId, { text });
  };

  deleteTask = e => {
    if (e.target.value !== '' || e.key !== keys.BACKSPACE) return;
    const { card, firebase } = this.props;
    const { cardId } = card;
    const taskId = e.target.name;
    firebase.deleteTask({ taskId, cardId });
  };

  moveTask = ({ destination, draggableId, source }) => {
    if (!destination) return;
    if (destination.index === source.index) return;
    const { firebase } = this.props;
    const { taskIds } = this.state;
    const updatedTaskIds = [...taskIds];
    updatedTaskIds.splice(source.index, 1);
    updatedTaskIds.splice(destination.index, 0, draggableId);
    this.setState({
      taskIds: updatedTaskIds
    });
    firebase.updateCard(source.droppableId, {
      taskIds: updatedTaskIds
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
    console.log(userId);
  };

  componentWillUnmount() {
    this.commentObserver();
  }

  render() {
    const {
      handleCardEditorClose,
      card,
      userId,
      commentsArray,
      usersArray
    } = this.props;
    const { cardId, commentIds } = card;
    const {
      cardTitle,
      cardDescription,
      newComment,
      currentFocus,
      newTask,
      cardTasks,
      taskIds,
      isFetching
    } = this.state;
    const hasTasks = taskIds !== undefined && taskIds.length > 0;
    const hasComments = commentIds !== undefined && commentIds.length > 0;
    const isNewCommentInvalid = newComment === '';
    const isNewTaskInvalid = newTask === '';
    const commentFormIsFocused = currentFocus === 'newComment';

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
          <MemberSearch users={usersArray} onMemberClick={this.assignMember} />
          <div
            className={`card-editor__section ${
              currentFocus === 'cardDescription' ? 'is-focused' : ''
            }`}
          >
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
          </div>
        </form>
        <div
          className={`card-editor__section ${
            currentFocus === 'newTask' ? 'is-focused' : ''
          }`}
        >
          <hr className="card-editor__hr" />
          {hasTasks && (
            <DragDropContext onDragEnd={this.moveTask}>
              <Droppable droppableId={cardId} type={droppableTypes.TASK}>
                {provided => (
                  <ul
                    className="card-editor__tasks"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {taskIds.map((taskId, index) => {
                      return (
                        <CardEditorTask
                          taskId={taskId}
                          index={index}
                          text={cardTasks[taskId].text}
                          isCompleted={cardTasks[taskId].isCompleted}
                          toggleCompleted={this.handleCheckboxChange}
                          onChange={this.onTaskChange}
                          onBlur={this.updateTaskText}
                          onKeyDown={this.deleteTask}
                          key={taskId}
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
            <Icon name="check-square" />
          </div>
          <form
            name="newTaskForm"
            className={`card-editor__new-task-form ${
              currentFocus === 'newTask' ? 'is-focused' : ''
            }`}
            ref={el => (this.newTaskFormEl = el)}
            onSubmit={this.addTask}
          >
            <Textarea
              className="card-editor__textarea card-editor__textarea--new-task"
              name="newTask"
              value={newTask}
              onChange={this.onChange}
              placeholder="Add a task"
              onFocus={this.onFocus}
              onKeyDown={this.addTask}
            />
            {currentFocus === 'newTask' && (
              <Button
                type="submit"
                color="primary"
                size="small"
                variant="contained"
                disabled={isNewTaskInvalid}
                onClick={this.addTask}
                className="card-editor__btn--add-task"
              >
                Add task
              </Button>
            )}
          </form>
        </div>
        <div
          className={`card-editor__section ${
            commentFormIsFocused ? 'is-focused' : ''
          }`}
        >
          {hasComments && (
            <div className="card-editor__comments">
              {commentsArray.map(comment => {
                const { commentId } = comment;
                return <CardEditorComment key={commentId} comment={comment} handleLike={this.handleCommentLike} />;
              })}
            </div>
          )}
          <hr className="card-editor__hr" />
          <div className="card-editor__section-icon">
            <Icon name="message-circle" />
          </div>
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

const mapStateToProps = (state, ownProps) => {
  return {
    userId: currentSelectors.getCurrentUserId(state),
    tasksArray: taskSelectors.getTasksArray(state, ownProps.card.taskIds),
    commentsArray: commentSelectors.getCommentsArray(
      state,
      ownProps.card.commentIds
    ),
    commentsById: commentSelectors.getCommentsById(state),
    usersArray: userSelectors.getUsersArray(state)
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
      dispatch(commentActions.updateComment({ commentId, commentData }))
  };
};

export default withAuthorization(condition)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CardEditor)
);
