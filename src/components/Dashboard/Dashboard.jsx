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
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import './Dashboard.scss';

const Dashboard = ({
  toggleProjectComposer,
  selectedTask,
  currentUser,
  activeWorkspace
}) => {
  useDocumentTitle('Home - Workflow');
  return (
    <Main title="Home" classes={{ main: 'dashboard', title: 'dashboard__header' }}>
      <TasksDueSoon />
      <Notifications userId={currentUser.userId} />
      <DashboardPanel
        className="projects"
        name="My Projects"
        icon="grid"
        link={{
          to: {
            pathname: `/0/${activeWorkspace.workspaceId}/projects`,
            state: { selectedTabIndex: 1 }
          },
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
};

const mapStateToProps = state => {
  return {
    selectedTask: getSelectedTask(state)
  };
};

const condition = (currentUser, activeWorkspace) => !!currentUser && !!activeWorkspace;

export default withAuthorization(condition)(connect(mapStateToProps)(Dashboard));
