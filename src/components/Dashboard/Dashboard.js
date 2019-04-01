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
  state = {
    isTaskEditorOpen: false
  };

  toggleTaskEditor = () => {
    const { isTaskEditorOpen } = this.state;
    if (isTaskEditorOpen) {
      const { selectTask } = this.props;
      selectTask(null);
    }
    this.setState(prevState => ({
      isTaskEditorOpen: !prevState.isTaskEditorOpen
    }));
  };

  handleTaskClick = taskId => {
    const { selectTask } = this.props;
    selectTask(taskId);
    this.toggleTaskEditor();
  };

  render() {
    const {
      tasksDueSoon,
      toggleProjectComposer,
      userId,
      selectedTaskId
    } = this.props;
    const { isTaskEditorOpen } = this.state;
    return (
      <Main
        title="Home"
        classes={{ main: 'dashboard', title: 'dashboard__header' }}
      >
        <TasksDueSoon onTaskClick={this.handleTaskClick} />
        <Notifications onTaskClick={this.handleTaskClick} />
        <DashboardPanel className="projects" name="Projects" icon="grid">
          <ProjectGridContainer className="dashboard__project-grid" openProjectComposer={toggleProjectComposer} />
        </DashboardPanel>
        {isTaskEditorOpen && (
          <TaskEditor
            {...tasksDueSoon[selectedTaskId]}
            handleTaskEditorClose={this.toggleTaskEditor}
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

const condition = authUser => !!authUser;

export default withAuthorization(condition)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Dashboard)
);
