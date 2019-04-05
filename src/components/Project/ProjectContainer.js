import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DragDropContext } from 'react-beautiful-dnd';
import { withAuthorization } from '../Session';
import { projectActions, projectSelectors } from '../../ducks/projects';
import {
  selectTask as selectTaskAction,
  getSelectedTask,
  getSelectedTaskId
} from '../../ducks/selectedTask';
import {
  selectProject as selectProjectAction,
  getSelectedProjectId
} from '../../ducks/selectedProject';
import { listActions, listSelectors } from '../../ducks/lists';
import { taskActions } from '../../ducks/tasks';
import { subtaskActions } from '../../ducks/subtasks';
import Project from './Project';
import { List } from '../List';
import { TaskEditor } from '../TaskEditor';
import * as droppableTypes from '../../constants/droppableTypes';
import './Project.scss';

class ProjectContainer extends Component {

  async componentDidMount() {
    const {
      projectId,
      selectProject,
      selectedProjectId,
      syncProjectLists,
      syncProjectSubtasks
    } = this.props;

    if (selectedProjectId !== projectId) {
      selectProject(projectId);
    }

    await Promise.all([
      syncProjectLists(projectId),
      syncProjectSubtasks(projectId)
    ]).then(listeners => {
      this.unsubscribe = listeners;
    });
    console.log('mounted');
  }

  componentWillUnmount() {
    const { selectProject } = this.props;
    selectProject(null);
    this.unsubscribe.forEach(func => func());
  }

  onDragStart = () => {
    this.setState({
      isDragging: true
    });
  };

  onDragEnd = ({ destination, draggableId, source, type }) => {
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;
    const { firebase, listsById } = this.props;
    if (type === droppableTypes.TASK) {
      const isMovedWithinList = source.droppableId === destination.droppableId;
      const updatedTaskIds = [...listsById[destination.droppableId].taskIds];
      if (isMovedWithinList) {
        updatedTaskIds.splice(source.index, 1);
        updatedTaskIds.splice(destination.index, 0, draggableId);
        firebase.updateDoc(['lists', source.droppableId], {
          taskIds: updatedTaskIds
        });
      } else {
        const newListName = listsById[destination.droppableId].name;
        updatedTaskIds.splice(destination.index, 0, draggableId);
        firebase.moveTaskToList({
          taskId: draggableId,
          origListId: source.droppableId,
          newListId: destination.droppableId,
          updatedTaskIds,
          newListName
        });
      }
    }

    if (type === droppableTypes.LIST) {
      const { project, projectId, reorderLists } = this.props;
      const updatedListIds = [...project.listIds];
      updatedListIds.splice(source.index, 1);
      updatedListIds.splice(destination.index, 0, draggableId);
      firebase.updateDoc(['projects', projectId], {
        listIds: updatedListIds
      });
      reorderLists(projectId, updatedListIds);
    }
  };

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
      lists,
      selectedTask,
      projectId,
      userId,
      selectedTaskId,
      isLoaded,
      project,
      tempProjectSettings
    } = this.props;
    const isTaskEditorOpen = !!selectedTaskId;
    if (!isLoaded.tasks || !isLoaded.subtasks || !isLoaded.lists) return null;
    return (
      <main
        className={`project-container project-container--${project.layout} ${
          isTaskEditorOpen ? 'show-task-editor' : ''
        }`}
      >
        <div className="project__wrapper">
          <DragDropContext
            onDragEnd={this.onDragEnd}
            onDragStart={this.onDragStart}
          >
            <Project {...project}>
              {lists.map((list, i) => {
                const { listId, name: listName, taskIds } = list;
                return (
                  <List
                    viewFilter={tempProjectSettings.tasks.view}
                    sortBy={tempProjectSettings.tasks.sortBy}
                    listId={listId}
                    key={listId}
                    index={i}
                    name={listName}
                    taskIds={taskIds}
                    onTaskClick={this.handleTaskClick}
                    projectId={projectId}
                    layout={project.layout}
                    isRestricted={false}
                  />
                );
              })}
            </Project>
          </DragDropContext>
          {isTaskEditorOpen && (
            <TaskEditor
              {...selectedTask}
              handleTaskEditorClose={this.closeTaskEditor}
              userId={userId}
              layout={project.layout}
            />
          )}
        </div>
      </main>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    selectedProjectId: getSelectedProjectId(state),
    selectedTaskId: getSelectedTaskId(state),
    selectedTask: getSelectedTask(state),
    listsById: listSelectors.getListsById(state),
    lists: listSelectors.getSelectedProjectLists(state),
    project: projectSelectors.getProject(state, ownProps.projectId),
    isLoaded: projectSelectors.getProjectLoadedState(state, ownProps.projectId),
    tempProjectSettings: projectSelectors.getTempProjectSettings(
      state,
      ownProps.projectId
    )
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectProject: projectId => dispatch(selectProjectAction(projectId)),
    selectTask: taskId => dispatch(selectTaskAction(taskId)),
    reorderLists: (projectId, listIds) =>
      dispatch(projectActions.reorderLists(projectId, listIds)),
    updateProjectTags: (projectId, tags) =>
      dispatch(projectActions.updateProjectTags(projectId, tags)),
    syncProjectLists: projectId =>
      dispatch(listActions.syncProjectLists(projectId)),
    syncProjectTasks: projectId =>
      dispatch(taskActions.syncProjectTasks(projectId)),
    syncProjectSubtasks: projectId =>
      dispatch(subtaskActions.syncProjectSubtasks(projectId)),
    syncProject: projectId => dispatch(projectActions.syncProject(projectId)),
    setTempProjectSettings: ({ projectId, view, sortBy }) =>
      dispatch(
        projectActions.setTempProjectSettings({ projectId, view, sortBy })
      )
  };
};

const condition = currentUser => !!currentUser;

export default withAuthorization(condition)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ProjectContainer)
);
