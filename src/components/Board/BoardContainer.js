import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DragDropContext } from 'react-beautiful-dnd';
import { withFirebase } from '../Firebase';
import { projectActions, projectSelectors } from '../../ducks/projects';
import {
  selectTask as selectTaskAction,
  getSelectedTaskId
} from '../../ducks/selectedTask';
import {
  selectProject as selectProjectAction,
  getSelectedProjectId
} from '../../ducks/selectedProject';
import { listActions, listSelectors } from '../../ducks/lists';
import { taskActions, taskSelectors } from '../../ducks/tasks';
import { subtaskActions, subtaskSelectors } from '../../ducks/subtasks';
import Board from './Board';
import { Input } from '../Input';
import { List } from '../List';
import { TaskEditor } from '../TaskEditor';
import * as droppableTypes from '../../constants/droppableTypes';
import './Board.scss';

class BoardContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isTaskEditorOpen: false,
      projectName: props.projectName
    };
  }

  async componentDidMount() {
    const {
      firebase,
      updateProject,
      projectId,
      selectProject,
      selectedProjectId,
      syncProjectLists,
      syncProjectTasks,
      syncProjectSubtasks,
      syncProject
    } = this.props;

    if (selectedProjectId !== projectId) {
      selectProject(projectId);
    }

    await Promise.all([
      syncProject(projectId),
      syncProjectLists(projectId),
      syncProjectTasks(projectId),
      syncProjectSubtasks(projectId)
    ]).then(listeners => {
      this.unsubscribe = listeners;
      this.setState({
        isLoading: false
      });
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
        firebase.updateList(source.droppableId, {
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
      const { projectsById, projectId, reorderLists } = this.props;
      const updatedListIds = [...projectsById[projectId].listIds];
      updatedListIds.splice(source.index, 1);
      updatedListIds.splice(destination.index, 0, draggableId);
      firebase.updateProject(projectId, {
        listIds: updatedListIds
      });
      reorderLists(projectId, updatedListIds);
    }
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

  onNameChange = e => {
    this.setState({
      projectName: e.target.value
    });
  };

  onNameBlur = e => {
    const { projectName, projectId, firebase } = this.props;
    const { projectName: newProjectName } = this.state;

    // When field loses focus, update list title if change is detected

    if (newProjectName !== projectName) {
      firebase.updateProjectName({ projectId, name: newProjectName });
      console.log('updated project name!');
    }
  };

  render() {
    const { isTaskEditorOpen, projectName } = this.state;
    const {
      lists,
      tasksById,
      projectId,
      userId,
      selectedTaskId,
      isLoaded
    } = this.props;
    if (!isLoaded.tasks || !isLoaded.subtasks || !isLoaded.lists) return null;
    return (
      <main className="board-container">
        <Input
          className="board__input--title"
          name="projectName"
          type="text"
          value={projectName}
          onChange={this.onNameChange}
          required
          hideLabel
          onBlur={this.onNameBlur}
        />
        <DragDropContext
          onDragEnd={this.onDragEnd}
          onDragStart={this.onDragStart}
        >
          <Board projectId={projectId}>
            {lists.map((list, i) => {
              const { listId, name: listName, taskIds } = list;
              return (
                <List
                  listId={listId}
                  key={listId}
                  index={i}
                  name={listName}
                  taskIds={taskIds}
                  onTaskClick={this.handleTaskClick}
                  projectId={projectId}
                  view="board"
                  isRestricted={false}
                />
              );
            })}
          </Board>
        </DragDropContext>
        {isTaskEditorOpen && (
          <TaskEditor
            {...tasksById[selectedTaskId]}
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
    projectsById: projectSelectors.getProjectsById(state),
    selectedProjectId: getSelectedProjectId(state),
    selectedTaskId: getSelectedTaskId(state),
    listsById: listSelectors.getListsById(state),
    lists: listSelectors.getSelectedProjectLists(state),
    subtasksById: subtaskSelectors.getSubtasksById(state),
    tasksById: taskSelectors.getTasksById(state),
    project: projectSelectors.getProject(state, ownProps.projectId),
    isLoaded: projectSelectors.getProjectLoadedState(state, ownProps.projectId)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchProjectContent: projectId =>
      dispatch(projectActions.fetchProjectContent(projectId)),
    updateProject: (projectId, projectData) =>
      dispatch(projectActions.updateProject(projectId, projectData)),
    selectProject: projectId => dispatch(selectProjectAction(projectId)),
    selectTask: taskId => dispatch(selectTaskAction(taskId)),
    fetchListsById: projectId =>
      dispatch(listActions.fetchListsById(projectId)),
    updateList: ({ listId, listData }) =>
      dispatch(listActions.updateList(listId, listData)),
    fetchProjectTasks: projectId =>
      dispatch(taskActions.fetchProjectTasks(projectId)),
    fetchProjectSubtasks: projectId =>
      dispatch(subtaskActions.fetchProjectSubtasks(projectId)),
    reorderLists: (projectId, listIds) =>
      dispatch(projectActions.reorderLists(projectId, listIds)),
    updateProjectTags: (projectId, tags) =>
      dispatch(projectActions.updateProjectTags(projectId, tags)),
    addSubtask: ({ subtaskId, subtaskData }) =>
      dispatch(subtaskActions.addSubtask({ subtaskId, subtaskData })),
    deleteSubtask: subtaskId =>
      dispatch(subtaskActions.deleteSubtask(subtaskId)),
    updateSubtask: ({ subtaskId, subtaskData }) =>
      dispatch(subtaskActions.updateSubtask({ subtaskId, subtaskData })),
    syncProjectLists: projectId =>
      dispatch(listActions.syncProjectLists(projectId)),
    syncProjectTasks: projectId =>
      dispatch(taskActions.syncProjectTasks(projectId)),
    syncProjectSubtasks: projectId =>
      dispatch(subtaskActions.syncProjectSubtasks(projectId)),
    syncProject: projectId => dispatch(projectActions.syncProject(projectId))
  };
};

export default withFirebase(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(BoardContainer)
);
