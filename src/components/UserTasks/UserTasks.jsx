import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { withAuthorization } from '../Session';
import { userSelectors } from '../../ducks/users';
import { listActions, listSelectors } from '../../ducks/lists';
import { taskSelectors, taskActions } from '../../ducks/tasks';
import { currentActions, currentSelectors } from '../../ducks/current';
import * as keys from '../../constants/keys';
import * as droppableTypes from '../../constants/droppableTypes';
import { List } from '../List';
import { Main } from '../Main';
import { TaskEditor } from '../TaskEditor';
import './UserTasks.scss';

class UserTasks extends Component {
  state = {
    isFetching: true,
    isTaskEditorOpen: false
  };

  componentDidMount() {
    const {
      userId,
      fetchUserTasks,
      addTask,
      updateTask,
      deleteTask,
      firebase
    } = this.props;
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
            console.log('added task');
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

  toggleTaskEditor = () => {
    this.setState(prevState => ({
      isTaskEditorOpen: !prevState.isTaskEditorOpen
    }));
  };

  handleTaskClick = taskId => {
    const { selectTask } = this.props;
    selectTask(taskId);
    this.toggleTaskEditor();
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
    firebase.updateTask(source.droppableId, {
      taskIds: updatedTaskIds
    });
  };

  render() {
    const { filters, userId, user, lists, taskId, tasksById } = this.props;
    const { isFetching, isTaskEditorOpen } = this.state;
    if (isFetching) return null;
    return (
      <Main title="All Tasks">
        <div className={`user-tasks__wrapper ${isTaskEditorOpen ? 'show-task-editor' : ''}`}>
        <DragDropContext onDragEnd={this.moveTask}>
          <Droppable droppableId={userId} type={droppableTypes.TASK}>
            {provided => (
              <div
                className="user-tasks"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {lists.map(list => (
                  <List
                    key={list.listId || list.defaultKey}
                    userId={userId}
                    listId={list.listId}
                    defaultKey={list.defaultKey}
                    listIndex={0}
                    name={list.name}
                    taskIds={list.taskIds}
                    onTaskClick={this.handleTaskClick}
                    projectId={null}
                    view="list"
                    isRestricted={list.isDefault}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        {isTaskEditorOpen && (
          <TaskEditor
            {...tasksById[taskId]}
            handleTaskEditorClose={this.toggleTaskEditor}
            userId={userId}
            view="list"
          />
        )}
        </div>
      </Main>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: userSelectors.getUserData(state, ownProps.userId),
    lists: listSelectors.getUserLists(state, ownProps.userId),
    tasksById: taskSelectors.getTasksById(state),
    taskId: currentSelectors.getCurrentTaskId(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectUser: userId => dispatch(currentActions.selectUser(userId)),
    selectTask: taskId => dispatch(currentActions.selectTask(taskId)),
    fetchUserTasks: userId => dispatch(taskActions.fetchUserTasks(userId)),
    fetchUserLists: userId => dispatch(listActions.fetchUserLists(userId)),
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
  )(UserTasks)
);
