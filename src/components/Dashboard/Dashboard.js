import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withAuthorization } from '../Session';
import { userActions, userSelectors } from '../../ducks/users';
import { currentActions, currentSelectors } from '../../ducks/current';
import { taskActions, taskSelectors } from '../../ducks/tasks';
import { dashboardSelectors } from '../../ducks/dashboard';
import { ProjectGridContainer } from '../ProjectGrid';
import TasksDueSoon from './TasksDueSoon';
import DashboardPanel from './DashboardPanel';
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
        <DashboardPanel name="Notifications" icon="bell" size="sm" />
        <DashboardPanel name="Projects" icon="grid">
          <ProjectGridContainer openProjectComposer={toggleProjectComposer} />
        </DashboardPanel>
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
