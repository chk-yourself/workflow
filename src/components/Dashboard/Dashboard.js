import React from 'react';
import { connect } from 'react-redux';
import { withAuthorization } from '../Session';
import { getSelectedTask } from '../../ducks/selectedTask';
import { ProjectGrid } from '../ProjectGrid';
import TasksDueSoon from './TasksDueSoon';
import Notifications from './DashboardNotifications';
import DashboardPanel from './DashboardPanel';
import { TaskEditor } from '../TaskEditor';
import { Main } from '../Main';
import './Dashboard.scss';

const Dashboard = ({
  toggleProjectComposer,
  selectedTask,
  currentUser,
  activeWorkspace
}) => (
  <Main
    title="Home"
    classes={{ main: 'dashboard', title: 'dashboard__header' }}
  >
    <TasksDueSoon />
    <Notifications userId={currentUser.userId} />
    <DashboardPanel
      className="projects"
      name="My Projects"
      icon="grid"
      link={{
        path: `/0/workspaces/${activeWorkspace.workspaceId}/projects`,
        text: 'View all projects'
      }}
    >
      <ProjectGrid
        className="dashboard__project-grid"
        openProjectComposer={toggleProjectComposer}
        userId={currentUser.userId}
      />
    </DashboardPanel>
    {selectedTask && <TaskEditor {...selectedTask} layout="board" />}
  </Main>
);

const mapStateToProps = state => {
  return {
    selectedTask: getSelectedTask(state)
  };
};

const condition = (currentUser, activeWorkspace) =>
  !!currentUser && !!activeWorkspace;

export default withAuthorization(condition)(
  connect(mapStateToProps)(Dashboard)
);
