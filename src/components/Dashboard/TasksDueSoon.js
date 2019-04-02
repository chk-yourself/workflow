import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withAuthorization } from '../Session';
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
    const { currentUser, syncTasksDueWithinDays } = this.props;
    const { userId } = currentUser;

    this.unsubscribe = await syncTasksDueWithinDays(userId, 7);
    this.setState({
      isLoading: false
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const { isLoading } = this.state;
    const { tasksDueSoon, onTaskClick, currentUser } = this.props;
    const { userId } = currentUser;
    if (isLoading) return null;
    return (
      <DashboardPanel
        className="tasks-due-soon"
        size="md"
        name="Tasks Due Soon"
        link={{ path: `/0/${userId}/tasks`, text: 'View all tasks' }}
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

const mapStateToProps = state => {
  return {
    tasksDueSoon: currentUserSelectors.getTasksDueSoonArr(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    syncTasksDueWithinDays: (userId, days) =>
      dispatch(currentUserActions.syncTasksDueWithinDays(userId, days))
  };
};

const condition = currentUser => !!currentUser;

export default withAuthorization(condition)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TasksDueSoon)
);
