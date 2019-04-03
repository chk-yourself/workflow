import React from 'react';
import { connect } from 'react-redux';
import { withAuthorization } from '../Session';
import DashboardPanel from './DashboardPanel';
import { Task } from '../Task';
import { currentUserSelectors } from '../../ducks/currentUser';

const TasksDueSoon = ({ tasksDueSoon, onTaskClick, currentUser }) => (
  <DashboardPanel
    className="tasks-due-soon"
    size="md"
    name="Tasks Due Soon"
    link={{ path: `/0/${currentUser.userId}/tasks`, text: 'View all tasks' }}
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

const mapStateToProps = state => {
  return {
    tasksDueSoon: currentUserSelectors.getTasksDueWithinDays(state, 7)
  };
};

const condition = currentUser => !!currentUser;

export default withAuthorization(condition)(
  connect(mapStateToProps)(TasksDueSoon)
);
