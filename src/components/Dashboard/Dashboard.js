import React from 'react';
import { connect } from 'react-redux';
import { getSelectedTask } from '../../ducks/selectedTask';
import { currentUserSelectors } from '../../ducks/currentUser';
import { ProjectGrid } from '../ProjectGrid';
import TasksDueSoon from './TasksDueSoon';
import Notifications from './DashboardNotifications';
import DashboardPanel from './DashboardPanel';
import { TaskEditor } from '../TaskEditor';
import { Main } from '../Main';
import './Dashboard.scss';

const Dashboard = ({ toggleProjectComposer, selectedTask, userId }) => (
  <Main
    title="Home"
    classes={{ main: 'dashboard', title: 'dashboard__header' }}
  >
    <TasksDueSoon />
    <Notifications userId={userId} />
    <DashboardPanel className="projects" name="My Projects" icon="grid">
      <ProjectGrid
        className="dashboard__project-grid"
        openProjectComposer={toggleProjectComposer}
      />
    </DashboardPanel>
    {selectedTask && <TaskEditor {...selectedTask} layout="board" />}
  </Main>
);

const mapStateToProps = state => {
  return {
    selectedTask: getSelectedTask(state),
    userId: currentUserSelectors.getCurrentUserId(state)
  };
};

export default connect(mapStateToProps)(Dashboard);
