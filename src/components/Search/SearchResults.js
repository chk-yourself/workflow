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

class SearchResults extends Component {
  onTaskClick = taskId => {
    const { selectTask } = this.props;
    selectTask(taskId);
  };

  closeTaskEditor = () => {
    const { selectTask } = this.props;
    selectTask(null);
  };

  render() {
    const { currentUser, selectedTaskId, tasksById, tasks, query } = this.props;
    const { userId } = currentUser;
    const isTaskEditorOpen = !!selectedTaskId;
    return (
      <Main
        title="Search Results"
        classes={{
          main: `search-results ${isTaskEditorOpen ? 'show-task-editor' : ''}`,
          title: 'search-results__title'
        }}
      >
        <h2 className="search-results__subheading">
          <Icon name="search" />
          {query}
        </h2>
        <div className="search-results__tasks-wrapper">
          <div className="search-results__tasks">
            {tasks.map((task, i) => (
              <Task
                className="search-results__task"
                index={i}
                key={task.taskId}
                onTaskClick={this.onTaskClick}
                {...task}
              />
            ))}
          </div>
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
    tasks: taskSelectors.getTasksMatchingQuery(state, ownProps.query),
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
  )(SearchResults)
);
