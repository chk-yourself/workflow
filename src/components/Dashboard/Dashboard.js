import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withAuthorization } from '../Session';
import {
  selectTask as selectTaskAction,
  getSelectedTaskId
} from '../../ducks/selectedTask';
import { currentUserSelectors } from '../../ducks/currentUser';
import { ProjectGridContainer } from '../ProjectGrid';
import TasksDueSoon from './TasksDueSoon';
import Notifications from './Notifications';
import DashboardPanel from './DashboardPanel';
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
      tasksDueSoon,
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
        <TasksDueSoon onTaskClick={this.handleTaskClick} />
        <Notifications onTaskClick={this.handleTaskClick} />
        <DashboardPanel className="projects" name="Projects" icon="grid">
          <ProjectGridContainer
            className="dashboard__project-grid"
            openProjectComposer={toggleProjectComposer}
          />
        </DashboardPanel>
        {isTaskEditorOpen && (
          <TaskEditor
            {...tasksDueSoon[selectedTaskId]}
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
    tasksDueSoon: currentUserSelectors.getTasksDueSoonById(state)
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
