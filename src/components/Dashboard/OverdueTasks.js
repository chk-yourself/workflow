import React from 'react';
import { connect } from 'react-redux';
import { withAuthorization } from '../Session';
import DashboardPanel from './DashboardPanel';
import { Task } from '../Task';
import { currentUserSelectors } from '../../ducks/currentUser';

const OverdueTasks = ({ overdueTasks, currentUser }) => (
  <DashboardPanel
    className="overdue-tasks"
    size="md"
    name="Overdue Tasks"
    link={{ path: `/0/${currentUser.userId}/tasks`, text: 'View all tasks' }}
  >
    {overdueTasks.map((task, i) => (
      <Task
        className="dashboard__task"
        index={i}
        key={task.taskId}
        taskId={task.taskId}
      />
    ))}
  </DashboardPanel>
);

const mapStateToProps = state => {
  return {
    overdueTasks: currentUserSelectors.getOverdueTasks(state)
  };
};

const condition = currentUser => !!currentUser;

export default withAuthorization(condition)(
  connect(mapStateToProps)(OverdueTasks)
);
