import React from 'react';
import { connect } from 'react-redux';
import { withAuthorization } from '../Session';
import DashboardPanel from './DashboardPanel';
import { Task } from '../Task';
import { currentUserSelectors } from '../../ducks/currentUser';
import { Tooltip } from '../Tooltip';
import { IconButton } from '../Button';

const InfoTooltip = () => (
  <Tooltip portalId={'WORKFLOW_PORTAL'} content="Your most urgent tasks due within the next 7 days.">
  <IconButton className="tasks-due-soon__btn--info" color="neutral" size="sm" icon="info" label="Info" />
  </Tooltip>
);

const TasksDueSoon = ({ tasksDueSoon, currentUser }) => (
  <DashboardPanel
    className="tasks-due-soon"
    size="md"
    name={<>
    Tasks Due Soon
    <InfoTooltip />
    </>}
    link={{ to: `/0/${currentUser.userId}/tasks`, text: 'View all tasks' }}
  >
    {tasksDueSoon.length > 0 ? (
      <ul className="dashboard__tasks">
        {tasksDueSoon.map((task, i) => (
          <Task
            className="dashboard__task"
            index={i}
            key={task.taskId}
            taskId={task.taskId}
          />
        ))}
      </ul>
    ) : (
      <div className="dashboard__info--empty">
        No tasks due in the next 7 days.
      </div>
    )}
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
