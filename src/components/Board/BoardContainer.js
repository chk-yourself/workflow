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
import { utils } from '../../utils';
import './Board.scss';

class BoardContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: true,
      isTaskEditorOpen: false,
      projectName: this.props.projectName
    };
  }

  componentDidMount() {
    const {
      firebase,
      updateProject,
      updateProjectTags,
      projectId,
      project,
      addSubtask,
      updateSubtask,
      deleteSubtask,
      selectProject,
      selectedProjectId,
      fetchProjectContent,
      syncProjectLists,
      syncProjectTasks
    } = this.props;

    if (selectedProjectId !== projectId) {
      selectProject(projectId);
    }

    fetchProjectContent(projectId).then(() => {
      this.setState({
        isFetching: false
      });

      const { subtasksById } = this.props;

      this.listObserver = () => syncProjectLists(projectId);
      this.listObserver();

      this.taskObserver = () => syncProjectTasks(projectId);
      this.taskObserver();

      this.projectObserver = firebase
        .getProjectDoc(projectId)
        .onSnapshot(snapshot => {
          const updatedProject = snapshot.data();
          updateProject(projectId, updatedProject);
        });

      this.subtaskObserver = firebase.db
        .collection('subtasks')
        .where('projectId', '==', projectId)
        .onSnapshot(querySnapshot => {
          querySnapshot.docChanges().forEach(change => {
            const subtaskId = change.doc.id;
            const subtaskData = change.doc.data();
            if (change.type === 'added') {
              if (subtaskId in subtasksById) return;
              addSubtask({ subtaskId, subtaskData });
            }
            if (change.type === 'modified') {
              updateSubtask({ subtaskId, subtaskData });
            }
            if (change.type === 'removed') {
              deleteSubtask(subtaskId);
            }
          });
        });
    });
    console.log('mounted');
  }

  componentWillUnmount() {
    const { selectProject } = this.props;
    selectProject(null);
    this.projectObserver();
    this.listObserver();
    this.taskObserver();
    this.subtaskObserver();
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
    const { firebase } = this.props;
    if (type === droppableTypes.TASK) {
      const { listsById } = this.props;
      const isMovedWithinList = source.droppableId === destination.droppableId;
      const updatedTaskIds = [...listsById[destination.droppableId].taskIds];
      if (isMovedWithinList) {
        updatedTaskIds.splice(source.index, 1);
        updatedTaskIds.splice(destination.index, 0, draggableId);
        firebase.updateList(source.droppableId, {
          taskIds: updatedTaskIds
        });
      } else {
        updatedTaskIds.splice(destination.index, 0, draggableId);
        firebase.moveTaskToList({
          taskId: draggableId,
          origListId: source.droppableId,
          newListId: destination.droppableId,
          updatedTaskIds
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
    const { isFetching, isTaskEditorOpen, projectName } = this.state;
    const { lists, tasksById, projectId, userId, selectedTaskId } = this.props;
    if (isFetching) return null;
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
            {lists.map((list, listIndex) => {
              const { listId, name: listName, taskIds } = list;
              return (
                <List
                  listId={listId}
                  key={listId}
                  listIndex={listIndex}
                  name={listName}
                  taskIds={taskIds}
                  isFetchingTasks={isFetching}
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
    project: projectSelectors.getProject(state, ownProps.projectId)
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
      dispatch(taskActions.syncProjectTasks(projectId))
  };
};

export default withFirebase(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(BoardContainer)
);
