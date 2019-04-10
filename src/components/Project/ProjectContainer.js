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
import { taskActions, taskSelectors } from '../../ducks/tasks';
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
    const { selectProject, selectTask, selectedTaskId } = this.props;
    selectProject(null);
    if (selectedTaskId) {
      selectTask(null);
    }
    this.unsubscribe.forEach(func => func());
  }

  onDragEnd = ({ destination, draggableId, source, type }) => {
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;
    const { firebase, listsById, tempProjectSettings, state } = this.props;
    const { view, sortBy } = tempProjectSettings.tasks;
    if (type === droppableTypes.TASK) {
      const { droppableId: newListId, index: newIndex } = destination;
      const { droppableId: origListId, index: prevIndex } = source;
      const isMovedWithinList = origListId === newListId;
      const taskIdsByView = taskSelectors.getTaskIdsByViewFilter(state, {
        listId: newListId
      });
      const updatedTaskIds = taskSelectors.getSortedTaskIds(
        state,
        [...taskIdsByView[view]],
        sortBy
      );
      if (isMovedWithinList) {
        updatedTaskIds.splice(prevIndex, 1);
        updatedTaskIds.splice(newIndex, 0, draggableId);
        firebase.updateDoc(['lists', origListId], {
          taskIds:
            view === 'all'
              ? updatedTaskIds
              : view === 'active'
              ? [...taskIdsByView.completed, ...updatedTaskIds]
              : [...updatedTaskIds, ...taskIdsByView.active]
        });
      } else {
        const newListName = listsById[destination.droppableId].name;
        updatedTaskIds.splice(newIndex, 0, draggableId);
        firebase.moveTaskToList({
          taskId: draggableId,
          origListId: source.droppableId,
          newListId: destination.droppableId,
          updatedTaskIds:
            view === 'all'
              ? updatedTaskIds
              : view === 'active'
              ? [...taskIdsByView.completed, ...updatedTaskIds]
              : [...updatedTaskIds, ...taskIdsByView.active],
          newListName
        });
      }
    }

    if (type === droppableTypes.LIST) {
      const { project, projectId } = this.props;
      const updatedListIds = [...project.listIds];
      updatedListIds.splice(source.index, 1);
      updatedListIds.splice(destination.index, 0, draggableId);
      firebase.updateDoc(['projects', projectId], {
        listIds: updatedListIds
      });
    }
  };

  closeTaskEditor = () => {
    const { selectTask } = this.props;
    selectTask(null);
  };


  render() {
    const {
      selectedTask,
      projectId,
      userId,
      selectedTaskId,
      isLoaded,
      project,
      tempProjectSettings
    } = this.props;
    const { name, listIds } = project;
    const { layout } = tempProjectSettings;
    const isTaskEditorOpen = !!selectedTaskId;
    if (!isLoaded.tasks || !isLoaded.subtasks || !isLoaded.lists) return null;
    return (
      <main
        className={`project-container project-container--${layout} ${
          isTaskEditorOpen ? 'show-task-editor' : ''
        }`}
      >
        <div className="project__wrapper">
          <DragDropContext
            onDragEnd={this.onDragEnd}
            onDragStart={this.onDragStart}
          >
            <Project {...project}>
              {listIds.map((listId, i) => {
                return (
                  <List
                    viewFilter={tempProjectSettings.tasks.view}
                    sortBy={tempProjectSettings.tasks.sortBy}
                    listId={listId}
                    key={listId}
                    index={i}
                    projectId={projectId}
                    projectName={name}
                    layout={layout}
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
              layout={layout}
            />
          )}
        </div>
      </main>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    state,
    selectedProjectId: getSelectedProjectId(state),
    selectedTaskId: getSelectedTaskId(state),
    selectedTask: getSelectedTask(state),
    listsById: listSelectors.getListsById(state),
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
