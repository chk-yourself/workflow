import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withAuthorization } from '../Session';
import { userActions, userSelectors } from '../../ducks/users';
import { currentActions, currentSelectors } from '../../ducks/current';
import { projectActions, projectSelectors } from '../../ducks/projects';
import { taskActions, taskSelectors } from '../../ducks/tasks';
import { dashboardSelectors } from '../../ducks/dashboard';
import { ProjectGridContainer } from '../ProjectGrid';
import TasksDueSoon from './TasksDueSoon';
import DashboardSection from './DashboardSection';
import { TaskEditor } from '../TaskEditor';
import './Dashboard.scss';

class Dashboard extends Component {
  state = {
    isTaskEditorOpen: false
  };

  toggleTaskEditor = () => {
    this.setState(prevState => ({
      isTaskEditorOpen: !prevState.isTaskEditorOpen
    }));
  };

  handleTaskClick = taskId => {
    const { selectTask } = this.props;
    console.log(taskId);
    selectTask(taskId);
    this.toggleTaskEditor();
  };

  render() {
    const {
      tasksDueSoon,
      toggleProjectComposer,
      userId,
      currentTaskId
    } = this.props;
    const { isTaskEditorOpen } = this.state;
    return (
      <main className="dashboard">
        <h1 className="dashboard__header">Home</h1>
        <TasksDueSoon onTaskClick={this.handleTaskClick} />
        <DashboardSection title="Notifications" icon="bell" size="sm" />
        <DashboardSection title="Projects" icon="grid">
          <ProjectGridContainer openProjectComposer={toggleProjectComposer} />
        </DashboardSection>
        {isTaskEditorOpen && (
          <TaskEditor
            {...tasksDueSoon[currentTaskId]}
            handleTaskEditorClose={this.toggleTaskEditor}
            userId={userId}
            view="board"
          />
        )}
      </main>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentProjectId: currentSelectors.getCurrentProjectId(state),
    projectsById: projectSelectors.getProjectsById(state),
    currentTaskId: currentSelectors.getCurrentTaskId(state),
    tasksDueSoon: dashboardSelectors.getTasksDueSoonById(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectTask: taskId => dispatch(currentActions.selectTask(taskId))
  };
};

const condition = authUser => !!authUser;

export default withAuthorization(condition)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Dashboard)
);
