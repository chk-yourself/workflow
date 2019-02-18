import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withAuthorization } from '../Session';
import { userActions, userSelectors } from '../../ducks/user';
import { boardActions, boardSelectors } from '../../ducks/boards';
import { currentActions, currentSelectors } from '../../ducks/current';
import { listActions, listSelectors } from '../../ducks/lists';
import { cardActions, cardSelectors } from '../../ducks/cards';
import { taskActions, taskSelectors } from '../../ducks/tasks';
import { Input } from '../Input';
import { Textarea } from '../Textarea';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { Modal } from '../Modal';
import { Toolbar } from '../Toolbar';
import { Checkbox } from '../Checkbox';
import CardEditorMoreActions from './CardEditorMoreActions';
import './CardEditor.scss';

class CardEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardId: this.props.card.cardId,
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
      cardComment: '',
      currentFocus: null,
      isCommentFormFocused: false
    };
    this.commentFormRef = null;
    this.setCommentFormRef = element => {
      this.commentFormRef = element;
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.tasksArray.length !== Object.keys(state.cardTasks).length) {
      return {
        cardTasks: props.tasksArray.reduce((tasks, task) => {
          const { taskId, text, isCompleted } = task;
          tasks[taskId] = {
            text,
            isCompleted
          };
          return tasks;
        }, {})
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

  resetNewTaskForm = () => {
    this.setState({
      newTask: ''
    });
  };

  addTask = e => {
    const { user, firebase, card } = this.props;
    const { userId } = user;
    const { cardId, boardId } = card;
    const { newTask: text } = this.state;
    firebase.addTask({ userId, text, cardId, boardId });
    this.resetNewTaskForm();
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
    const { cardId } = this.props;
    switch (action) {
      case 'delete':
        this.handleCardDelete(cardId);
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
    this.toggleTaskCompletion(taskId);
  };

  toggleTaskCompletion = taskId => {
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

  updateTask = e => {
    const taskId = e.target.name;
    const { cardTasks } = this.state;
    const { text } = cardTasks[taskId];
    const { firebase } = this.props;
    firebase.updateTask(taskId, { text });
  };

  render() {
    const { onCardEditorClose, card, user, tasksById, tasksArray } = this.props;
    const { taskIds } = card;
    const hasTasks = taskIds !== undefined && taskIds.length > 0;

    const {
      cardTitle,
      cardDescription,
      cardComment,
      currentFocus,
      newTask,
      cardTasks
    } = this.state;
    const isCommentInvalid = cardComment === '';
    const isNewTaskInvalid = newTask === '';
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
            currentFocus === 'newTask' ? 'is-focused' : ''
          }`}
        >
          <hr className="card-editor__hr" />
          <div className="card-editor__section-icon">
            <Icon name="check-square" />
          </div>
          {hasTasks && (
            <ul className="card-editor__tasks">
              {tasksArray.map(task => {
                const { taskId } = task;
                return (
                  <li className="card-editor__task" key={taskId}>
                    <Checkbox
                      id={`cb-${taskId}`}
                      value={taskId}
                      name={taskId}
                      isChecked={cardTasks[taskId].isCompleted}
                      onChange={this.handleCheckboxChange}
                      labelClass="card-editor__checkbox-label"
                    />
                    <Textarea
                      value={cardTasks[taskId].text}
                      onChange={this.onTaskChange}
                      onBlur={this.updateTask}
                      name={taskId}
                      className="card-editor__textarea--task"
                    />
                  </li>
                );
              })}
            </ul>
          )}
          <form
            name="newTaskForm"
            className={`card-editor__new-task-form ${
              currentFocus === 'newTask' ? 'is-focused' : ''
            }`}
            ref={el => (this.newTaskFormEl = el)}
            onSubmit={this.addTask}
          >
            <Textarea
              className="card-editor__textarea--new-task"
              name="newTask"
              value={newTask}
              onChange={this.onChange}
              placeholder="Add a task"
              onFocus={this.onFocus}
            />
            {currentFocus === 'newTask' && (
              <Button
                type="submit"
                color="secondary"
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
          <hr className="card-editor__hr" />
          <div className="card-editor__section-icon">
            <Icon name="message-circle" />
          </div>
          <form
            name="commentForm"
            className={`card-editor__comment-form ${
              commentFormIsFocused ? 'is-focused' : ''
            }`}
            ref={this.setCommentFormRef}
          >
            <Textarea
              className="card-editor__textarea--comment"
              name="cardComment"
              value={cardComment}
              onChange={this.onChange}
              placeholder="Write a comment..."
              onFocus={this.onFocus}
            />
            {commentFormIsFocused && (
              <Button
                type="submit"
                color="secondary"
                size="small"
                variant="contained"
                disabled={isCommentInvalid}
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

const mapStateToProps = (state, ownProps) => {
  return {
    user: userSelectors.getUserData(state),
    boardsById: boardSelectors.getBoardsById(state),
    current: currentSelectors.getCurrent(state),
    listsById: listSelectors.getListsById(state),
    listsArray: listSelectors.getListsArray(state),
    tasksById: taskSelectors.getTasksById(state),
    tasksArray: taskSelectors.getTasksArray(state, ownProps.card.taskIds)
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
