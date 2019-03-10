import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withFirebase } from '../Firebase';
import DashboardPanel from './DashboardPanel';
import { Task } from '../Task';
import { currentActions, currentSelectors } from '../../ducks/current';
import { dashboardActions, dashboardSelectors } from '../../ducks/dashboard';

class TasksDueSoon extends Component {
  state = {
    isFetching: true,
    isTaskEditorOpen: false
  };

  componentDidMount() {
    const {
      userId,
      fetchTasksDueWithinDays,
      addTaskDueSoon,
      deleteTaskDueSoon,
      updateTaskDueSoon,
      firebase
    } = this.props;
    fetchTasksDueWithinDays(userId, 7).then(() => {
      this.setState({
        isFetching: false
      });
    });

    const startingDate = new Date();
    const timeStart = startingDate.setHours(0, 0, 0, 0);
    const endingDate = new Date(startingDate);
    const timeEnd = endingDate.setDate(endingDate.getDate() + 7);

    this.taskObserver = firebase.db
      .collection('tasks')
      .where('assignedTo', 'array-contains', userId)
      .where('dueDate', '<=', timeEnd)
      .orderBy('dueDate', 'asc')
      .onSnapshot(querySnapshot => {
        querySnapshot.docChanges().forEach(change => {
          const taskId = change.doc.id;
          const taskData = change.doc.data();
          if (change.type === 'added') {
            console.log('added task');
            addTaskDueSoon({ taskId, taskData });
          } else if (change.type === 'removed') {
            deleteTaskDueSoon(taskId);
          } else {
            updateTaskDueSoon({ taskId, taskData });
          }
        });
      });
  }

  componentWillUnmount() {
    this.taskObserver();
  }

  render() {
    const { isFetching } = this.state;
    const { tasksDueSoon, onTaskClick } = this.props;
    if (isFetching) return null;
    return (
      <DashboardPanel icon="check-square" size="md" name="Tasks Due Soon">
        {tasksDueSoon.map((task, i) => (
          <Task
            index={i}
            key={task.taskId}
            onTaskClick={onTaskClick}
            {...task}
          />
        ))}
      </DashboardPanel>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    userId: currentSelectors.getCurrentUserId(state),
    tasksDueSoon: dashboardSelectors.getTasksDueSoonArr(state),
    taskId: currentSelectors.getCurrentTaskId(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectUser: userId => dispatch(currentActions.selectUser(userId)),
    selectTask: taskId => dispatch(currentActions.selectTask(taskId)),
    fetchTasksDueWithinDays: (userId, days) =>
      dispatch(dashboardActions.fetchTasksDueWithinDays(userId, days)),
    addTaskDueSoon: ({ taskId, taskData }) =>
      dispatch(dashboardActions.addTaskDueSoon({ taskId, taskData })),
    updateTaskDueSoon: ({ taskId, taskData }) =>
      dispatch(dashboardActions.updateTaskDueSoon({ taskId, taskData })),
    deleteTaskDueSoon: taskId =>
      dispatch(dashboardActions.deleteTaskDueSoon(taskId))
  };
};

export default withFirebase(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TasksDueSoon)
);
