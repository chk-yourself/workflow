import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withAuthorization } from '../Session';
import {
  selectTask as selectTaskAction,
  getSelectedTaskId
} from '../../ducks/selectedTask';
import { taskSelectors } from '../../ducks/tasks';
import { ProjectGrid } from '../ProjectGrid';
import TasksDueSoon from './TasksDueSoon';
import Notifications from './Notifications';
import DashboardPanel from './DashboardPanel';
import OverdueTasks from './OverdueTasks';
import { TaskEditor } from '../TaskEditor';
import { Main } from '../Main';
import './Dashboard.scss';

class Dashboard extends Component {
  closeTaskEditor = () => {
    const { selectTask } = this.props;
    selectTask(null);
  };

  handleTaskClick = taskId => {
    const { selectTask } = this.props;
    selectTask(taskId);
  };

  render() {
    const {
      tasksById,
      toggleProjectComposer,
      currentUser,
      selectedTaskId
    } = this.props;
    const { userId } = currentUser;
    const isTaskEditorOpen = !!selectedTaskId;
    return (
      <Main
        title="Home"
        classes={{ main: 'dashboard', title: 'dashboard__header' }}
      >
        <TasksDueSoon />
        <Notifications onTaskClick={this.handleTaskClick} />
        <DashboardPanel className="projects" name="My Projects" icon="grid">
          <ProjectGrid
            className="dashboard__project-grid"
            openProjectComposer={toggleProjectComposer}
          />
        </DashboardPanel>
        {isTaskEditorOpen && (
          <TaskEditor
            {...tasksById[selectedTaskId]}
            handleTaskEditorClose={this.closeTaskEditor}
            userId={userId}
            layout="board"
          />
        )}
      </Main>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    selectedTaskId: getSelectedTaskId(state),
    tasksById: taskSelectors.getTasksById(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectTask: taskId => dispatch(selectTaskAction(taskId))
  };
};

const condition = currentUser => !!currentUser;

export default withAuthorization(condition)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Dashboard)
);
