import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withAuthorization } from '../Session';
import { Task } from '../Task';
import { taskActions, taskSelectors } from '../../ducks/tasks';
import {
  selectTask as selectTaskAction,
  getSelectedTaskId
} from '../../ducks/selectedTask';
import { TaskEditor } from '../TaskEditor';
import { Main } from '../Main';
import { Icon } from '../Icon';
import './SearchResults.scss';

class TagSearchResults extends Component {
  state = {
    isLoading: true
  };

  async componentDidMount() {
    const { currentUser, syncTaggedTasks, tag } = this.props;

    const { projectIds } = currentUser;
    await Promise.all(
      projectIds.map(projectId => syncTaggedTasks({ projectId, tag }))
    ).then(listeners => {
      this.unsubscribe = listeners;
      this.setState({
        isLoading: false
      });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onTaskClick = taskId => {
    const { selectTask } = this.props;
    selectTask(taskId);
  };

  closeTaskEditor = () => {
    const { selectTask } = this.props;
    selectTask(null);
  };

  render() {
    const { isLoading } = this.state;
    const {
      taggedTasks,
      currentUser,
      selectedTaskId,
      tasksById,
      tag
    } = this.props;
    const { userId } = currentUser;
    const isTaskEditorOpen = !!selectedTaskId;
    if (isLoading) return null;
    return (
      <Main
        title="Search Results"
        classes={{
          main: 'search-results',
          title: 'search-results__title'
        }}
      >
        <h2 className="search-results__subheading">
          <Icon name="tag" />
          {tag}
        </h2>
        <div>
          {taggedTasks.map((task, i) => (
            <Task
              className="search-results__task"
              index={i}
              key={task.taskId}
              onTaskClick={this.onTaskClick}
              {...task}
            />
          ))}
          {isTaskEditorOpen && (
            <TaskEditor
              {...tasksById[selectedTaskId]}
              handleTaskEditorClose={this.closeTaskEditor}
              userId={userId}
              layout="list"
              key={selectedTaskId}
            />
          )}
        </div>
      </Main>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    taggedTasks: taskSelectors.getTaggedTasks(state, ownProps.tag),
    selectedTaskId: getSelectedTaskId(state),
    tasksById: taskSelectors.getTasksById(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectTask: taskId => dispatch(selectTaskAction(taskId)),
    syncTaggedTasks: ({ projectId, tag }) =>
      dispatch(taskActions.syncTaggedTasks({ projectId, tag }))
  };
};

const condition = currentUser => !!currentUser;

export default withAuthorization(condition)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TagSearchResults)
);
