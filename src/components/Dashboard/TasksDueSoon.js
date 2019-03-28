import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withFirebase } from '../Firebase';
import DashboardPanel from './DashboardPanel';
import { Task } from '../Task';
import {
  currentUserActions,
  currentUserSelectors
} from '../../ducks/currentUser';

class TasksDueSoon extends Component {
  state = {
    isLoading: true
  };

  async componentDidMount() {
    const {
      currentUserId,
      syncTasksDueWithinDays,
      firebase
    } = this.props;
    
    this.unsubscribe = await syncTasksDueWithinDays(currentUserId, 7);
    this.setState({
      isLoading: false
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const { isLoading } = this.state;
    const { tasksDueSoon, onTaskClick, currentUserId } = this.props;
    if (isLoading) return null;
    return (
      <DashboardPanel
        className="tasks-due-soon"
        size="md"
        name="Tasks Due Soon"
        link={{ path: `/0/${currentUserId}/tasks`, text: 'View all tasks' }}
      >
        {tasksDueSoon.map((task, i) => (
          <Task
            className="tasks-due-soon__task"
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
    currentUserId: currentUserSelectors.getCurrentUserId(state),
    tasksDueSoon: currentUserSelectors.getTasksDueSoonArr(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    syncTasksDueWithinDays: (userId, days) =>
      dispatch(currentUserActions.syncTasksDueWithinDays(userId, days))
  };
};

export default withFirebase(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TasksDueSoon)
);
