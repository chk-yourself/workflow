import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { withAuthorization } from '../Session';
import { userSelectors } from '../../ducks/users';
import { cardSelectors, cardActions } from '../../ducks/cards';
import { currentActions, currentSelectors } from '../../ducks/current';
import * as keys from '../../constants/keys';
import * as droppableTypes from '../../constants/droppableTypes';
import Task from './Task';
import './Tasks.scss';

class Tasks extends Component {
  state = {
    isFetching: true,
    taskIds: this.props.taskIds || [],
    tasks: this.props.cards.reduce((tasksById, card) => {
      const { cardId, cardTitle: text, isCompleted } = card;
      tasksById[cardId] = {
        text,
        isCompleted
      };
      return tasksById;
    }, {})
  };

  static getDerivedStateFromProps(props, state) {
    if (
      Object.keys(state.tasks).length !== props.cards.length ||
      props.taskIds.length !== state.taskIds.length
    ) {
      return {
        tasks: props.cards.reduce((tasksById, card) => {
          const { cardId, cardTitle: text, isCompleted } = card;
          tasksById[cardId] = {
            text,
            isCompleted
          };
          return tasksById;
        }, {}),
        taskIds: props.taskIds
      };
    }
    return null;
  }

  componentDidMount() {
    const {
      userId,
      fetchUserCards,
      addCard,
      updateCard,
      deleteCard,
      firebase
    } = this.props;
    console.log(this.props.taskIds);
    fetchUserCards(userId).then(() => {
      this.setState({
        isFetching: false
      });
    });

    this.cardObserver = firebase.db
      .collection('cards')
      .where('assignedTo', 'array-contains', userId)
      .onSnapshot(querySnapshot => {
        querySnapshot.docChanges().forEach(change => {
          const cardId = change.doc.id;
          const cardData = change.doc.data();
          if (change.type === 'added') {
            addCard({ cardId, cardData });
          } else if (change.type === 'removed') {
            deleteCard(cardId);
          } else {
            updateCard({ cardId, cardData });
          }
        });
      });
  }

  componentWillUnmount() {
    this.cardObserver();
  }

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

  updateTaskText = e => {
    const cardId = e.target.name;
    const { tasks } = this.state;
    const { text: cardTitle } = tasks[cardId];
    const { firebase } = this.props;
    firebase.updateCard(cardId, { cardTitle });
  };

  deleteTask = e => {
    /*
    if (e.target.value !== '' || e.key !== keys.BACKSPACE) return;
    const { cardId, firebase } = this.props;
    const subtaskId = e.target.name;
    firebase.deleteSubtask({ subtaskId, cardId });
    */
  };

  onTaskChange = e => {
    const { tasks } = this.state;
    this.setState({
      tasks: {
        ...tasks,
        [e.target.name]: {
          ...tasks[e.target.name],
          text: e.target.value
        }
      }
    });
  };

  toggleTaskCompleted = taskId => {
    const { isCompleted } = this.state.tasks[taskId];
    this.setState(prevState => ({
      tasks: {
        ...prevState.tasks,
        [taskId]: {
          ...prevState.tasks[taskId],
          isCompleted: !prevState.tasks[taskId].isCompleted
        }
      }
    }));
    const { firebase } = this.props;
    firebase.updateCard(taskId, { isCompleted: !isCompleted });
  };

  handleCheckboxChange = e => {
    const taskId = e.target.name;
    this.toggleTaskCompleted(taskId);
  };

  render() {
    const { filters, view, cards, userId, taskIds } = this.props;
    const { tasks, isFetching } = this.state;
    const hasTasks = taskIds && taskIds.length > 0;
    if (isFetching || !hasTasks) return null;
    console.log({ cards, tasks });
    return (
      <DragDropContext onDragEnd={this.moveTask}>
        <Droppable droppableId={userId} type={droppableTypes.TASK}>
          {provided => (
            <ul
              className="tasks"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {cards &&
                cards.map((card, index) => {
                  const { cardId } = card;
                  return (
                    <Task
                      taskId={cardId}
                      index={index}
                      text={tasks[cardId].text}
                      isCompleted={tasks[cardId].isCompleted}
                      toggleCompleted={this.handleCheckboxChange}
                      onChange={this.onTaskChange}
                      onBlur={this.updateTaskText}
                      onKeyDown={this.deleteTask}
                      key={cardId}
                    />
                  );
                })}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: userSelectors.getUserData(state, ownProps.userId),
    taskIds: userSelectors.getUserTaskIds(state, ownProps.userId),
    cards: cardSelectors.getUserCards(state, ownProps.userId)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectUser: userId => dispatch(currentActions.selectUser(userId)),
    fetchUserCards: userId => dispatch(cardActions.fetchUserCards(userId)),
    addCard: ({ cardId, cardData }) =>
      dispatch(cardActions.addCard({ cardId, cardData })),
    updateCard: ({ cardId, cardData }) =>
      dispatch(cardActions.updateCard({ cardId, cardData })),
    deleteCard: cardId => dispatch(cardActions.deleteCard(cardId))
  };
};

const condition = authUser => !!authUser;

export default withAuthorization(condition)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Tasks)
);
