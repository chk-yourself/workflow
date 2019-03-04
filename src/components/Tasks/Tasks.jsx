import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { withAuthorization } from '../Session';
import { userSelectors } from '../../ducks/users';
import { taskSelectors, taskActions } from '../../ducks/tasks';
import { currentActions, currentSelectors } from '../../ducks/current';
import * as keys from '../../constants/keys';
import * as droppableTypes from '../../constants/droppableTypes';
import Task from './Task';
import './Tasks.scss';

class Tasks extends Component {
  state = {
    isFetching: true,
    taskIds: this.props.taskIds || [],
    tasks: this.props.tasks.reduce((tasksById, task) => {
      const { taskId, name, isCompleted } = task;
      tasksById[taskId] = {
        name,
        isCompleted
      };
      return tasksById;
    }, {})
  };

  static getDerivedStateFromProps(props, state) {
    if (
      Object.keys(state.tasks).length !== props.tasks.length ||
      props.taskIds.length !== state.taskIds.length
    ) {
      return {
        tasks: props.tasks.reduce((tasksById, task) => {
          const { taskId, name, isCompleted } = task;
          tasksById[taskId] = {
            name,
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
      fetchUserTasks,
      addTask,
      updateTask,
      deleteTask,
      firebase
    } = this.props;
    console.log(this.props.taskIds);
    fetchUserTasks(userId).then(() => {
      this.setState({
        isFetching: false
      });
    });

    this.taskObserver = firebase.db
      .collection('tasks')
      .where('assignedTo', 'array-contains', userId)
      .onSnapshot(querySnapshot => {
        querySnapshot.docChanges().forEach(change => {
          const taskId = change.doc.id;
          const taskData = change.doc.data();
          if (change.type === 'added') {
            addTask({ taskId, taskData });
          } else if (change.type === 'removed') {
            deleteTask(taskId);
          } else {
            updateTask({ taskId, taskData });
          }
        });
      });
  }

  componentWillUnmount() {
    this.taskObserver();
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
    firebase.updateTask(source.droppableId, {
      taskIds: updatedTaskIds
    });
  };

  updateTaskName = e => {
    const taskId = e.target.name;
    const { tasks } = this.state;
    const { name } = tasks[taskId];
    const { firebase } = this.props;
    firebase.updateTask(taskId, { name });
  };

  deleteTask = e => {
    /*
    if (e.target.value !== '' || e.key !== keys.BACKSPACE) return;
    const { taskId, firebase } = this.props;
    const subtaskId = e.target.name;
    firebase.deleteSubtask({ subtaskId, taskId });
    */
  };

  onTaskChange = e => {
    const { tasks } = this.state;
    this.setState({
      tasks: {
        ...tasks,
        [e.target.name]: {
          ...tasks[e.target.name],
          name: e.target.value
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
    firebase.updateTask(taskId, { isCompleted: !isCompleted });
  };

  handleCheckboxChange = e => {
    const taskId = e.target.name;
    this.toggleTaskCompleted(taskId);
  };

  render() {
    const { filters, view, tasks, userId, taskIds } = this.props;
    const { tasks, isFetching } = this.state;
    const hasTasks = taskIds && taskIds.length > 0;
    if (isFetching || !hasTasks) return null;
    console.log({ tasks, tasks });
    return (
      <DragDropContext onDragEnd={this.moveTask}>
        <Droppable droppableId={userId} type={droppableTypes.TASK}>
          {provided => (
            <ul
              className="tasks"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {tasks &&
                tasks.map((task, index) => {
                  const { taskId } = task;
                  return (
                    <Task
                      taskId={taskId}
                      index={index}
                      name={tasks[taskId].name}
                      isCompleted={tasks[taskId].isCompleted}
                      toggleCompleted={this.handleCheckboxChange}
                      onChange={this.onTaskChange}
                      onBlur={this.updateTaskName}
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
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: userSelectors.getUserData(state, ownProps.userId),
    taskIds: userSelectors.getUserTaskIds(state, ownProps.userId),
    tasks: taskSelectors.getUserTasks(state, ownProps.userId)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectUser: userId => dispatch(currentActions.selectUser(userId)),
    fetchUserTasks: userId => dispatch(taskActions.fetchUserTasks(userId)),
    addTask: ({ taskId, taskData }) =>
      dispatch(taskActions.addTask({ taskId, taskData })),
    updateTask: ({ taskId, taskData }) =>
      dispatch(taskActions.updateTask({ taskId, taskData })),
    deleteTask: taskId => dispatch(taskActions.deleteTask(taskId))
  };
};

const condition = authUser => !!authUser;

export default withAuthorization(condition)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Tasks)
);
