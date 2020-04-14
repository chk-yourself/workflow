import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DragDropContext } from 'react-beautiful-dnd';
import { withAuthorization } from '../Session';
import { projectActions, projectSelectors } from '../../ducks/projects';
import { selectTask as selectTaskAction, getSelectedTask } from '../../ducks/selectedTask';
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
import { LIST, TASK } from '../../constants/droppableTypes';
import ProjectDuplicator from './ProjectDuplicator';
import './Project.scss';

class ProjectContainer extends Component {
  static propTypes = {
    projectId: PropTypes.string.isRequired
  };

  state = {
    isProjectDuplicatorOpen: false,
    listIds: this.props.project.listIds
  };

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

    await Promise.all([syncProjectLists(projectId), syncProjectSubtasks(projectId)]).then(
      listeners => {
        this.unsubscribe = listeners;
      }
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.project.listIds !== prevProps.project.listIds) {
      this.resetListOrder();
    }
  }

  componentWillUnmount() {
    const { selectProject, selectTask, selectedTask } = this.props;
    if (selectedTask) {
      selectTask(null);
    }
    selectProject(null);
    this.unsubscribe.forEach(func => func());
  }

  resetListOrder = () => {
    const {
      project: { listIds }
    } = this.props;
    this.setState({
      listIds
    });
  };

  onDragEnd = async ({ destination, draggableId, source, type }) => {
    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index)
      return;
    const { firebase, tasksById, listsById, tempSettings } = this.props;
    const { view, sortBy } = tempSettings.tasks;
    const state = { tasksById, listsById };
    if (type === TASK) {
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
        await firebase.updateDoc(['lists', origListId], {
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
        await firebase.moveTaskToList({
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

    if (type === LIST) {
      const { project, projectId } = this.props;
      const { listIds } = project;
      const updatedListIds = [...listIds];
      updatedListIds.splice(source.index, 1);
      updatedListIds.splice(destination.index, 0, draggableId);
      // Update state locally to prevent drag and drop flickering
      this.setState({
        listIds: updatedListIds
      });
      await firebase
        .updateDoc(['projects', projectId], {
          listIds: updatedListIds
        })
        .catch(() => {
          this.resetListOrder();
        });
    }
  };

  deleteProject = () => {
    const { firebase, currentUser, selectProject, history, projectId, project } = this.props;
    const { workspaceId, listIds, memberIds } = project;
    const { userId } = currentUser;
    firebase.deleteProject({
      userId,
      projectId,
      workspaceId,
      listIds,
      memberIds
    });
    selectProject(null);
    history.push(`/0/home/${userId}`);
  };

  setTempProjectSettings = (key, value) => {
    const { projectId } = this.props;
    const { setTempProjectSettings } = this.props;
    setTempProjectSettings({
      projectId,
      [key]: value
    });
  };

  toggleProjectDuplicator = () => {
    this.setState(prevState => ({
      isProjectDuplicatorOpen: !prevState.isProjectDuplicatorOpen
    }));
  };

  closeProjectDuplicator = () => {
    this.setState({
      isProjectDuplicatorOpen: false
    });
  };

  render() {
    const { selectedTask, projectId, isLoaded, project, tempSettings, currentUser } = this.props;
    const {
      name,
      // listIds,
      color,
      ownerId,
      memberIds,
      settings: { isPrivate }
    } = project;
    const {
      layout,
      tasks: { view, sortBy }
    } = tempSettings;
    const { isProjectDuplicatorOpen, listIds } = this.state;
    const isTaskEditorOpen = !!selectedTask;
    if (!isLoaded.tasks || !isLoaded.subtasks || !isLoaded.lists) return null;
    return (
      <>
        <main
          className={`project-container project-container--${layout} ${
            isTaskEditorOpen ? 'show-task-editor' : ''
          }`}
        >
          <div className="project__wrapper">
            <DragDropContext onDragEnd={this.onDragEnd} onDragStart={this.onDragStart}>
              <Project
                currentUser={currentUser}
                onChangeTempSettings={this.setTempProjectSettings}
                onDelete={this.deleteProject}
                onDuplicate={this.toggleProjectDuplicator}
                projectId={projectId}
                name={name}
                color={color}
                ownerId={ownerId}
                isPrivate={isPrivate}
                layout={layout}
                viewFilter={view}
                sortBy={sortBy}
                memberIds={memberIds}
                listIds={listIds}
              >
                {listIds.map((listId, i) => {
                  return (
                    <List
                      viewFilter={view}
                      sortBy={sortBy}
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
            {isTaskEditorOpen && <TaskEditor {...selectedTask} layout={layout} />}
          </div>
        </main>
        {isProjectDuplicatorOpen && (
          <ProjectDuplicator onClose={this.closeProjectDuplicator} projectId={projectId} />
        )}
      </>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    selectedProjectId: getSelectedProjectId(state),
    selectedTask: getSelectedTask(state),
    tasksById: taskSelectors.getTasksById(state),
    listsById: listSelectors.getListsById(state),
    project: projectSelectors.getProject(state, ownProps.projectId),
    isLoaded: projectSelectors.getProjectLoadedState(state, ownProps.projectId),
    tempSettings: projectSelectors.getTempProjectSettings(state, ownProps.projectId)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectProject: projectId => dispatch(selectProjectAction(projectId)),
    selectTask: taskId => dispatch(selectTaskAction(taskId)),
    syncProjectLists: projectId => dispatch(listActions.syncProjectLists(projectId)),
    syncProjectTasks: projectId => dispatch(taskActions.syncProjectTasks(projectId)),
    syncProjectSubtasks: projectId => dispatch(subtaskActions.syncProjectSubtasks(projectId)),
    syncProject: projectId => dispatch(projectActions.syncProject(projectId)),
    setTempProjectSettings: ({ projectId, view, sortBy, layout }) =>
      dispatch(
        projectActions.setTempProjectSettings({
          projectId,
          view,
          sortBy,
          layout
        })
      )
  };
};

const condition = (currentUser, activeWorkspace) => !!currentUser && !!activeWorkspace;

export default withAuthorization(condition)(
  connect(mapStateToProps, mapDispatchToProps)(ProjectContainer)
);
