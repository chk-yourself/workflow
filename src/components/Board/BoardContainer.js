import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DragDropContext } from 'react-beautiful-dnd';
import { withFirebase } from '../Firebase';
import { projectActions, projectSelectors } from '../../ducks/projects';
import { currentActions, currentSelectors } from '../../ducks/current';
import { listActions, listSelectors } from '../../ducks/lists';
import { taskActions, taskSelectors } from '../../ducks/tasks';
import { subtaskActions, subtaskSelectors } from '../../ducks/subtasks';
import * as ROUTES from '../../constants/routes';
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
      isDragging: false,
      isTaskEditorOpen: false,
      projectName: this.props.projectName
    };
  }

  componentDidMount() {
    const {
      current,
      fetchListsById,
      fetchProjectTasks,
      fetchTaskSubtasks,
      firebase,
      updateProject,
      updateListsById,
      addTask,
      deleteTask,
      updateTask,
      updateProjectTags,
      projectId,
      project,
      updateListIds,
      addSubtask,
      updateSubtask,
      deleteSubtask,
      selectProject
    } = this.props;

    if (current.projectId !== projectId) {
      selectProject(projectId);
    }

    fetchListsById(projectId);
    fetchProjectTasks(projectId);
    fetchTaskSubtasks(projectId).then(() => {
      this.setState({
        isFetching: false
      });
    });
    this.projectObserver = firebase.getProjectDoc(projectId).onSnapshot(snapshot => {
      const updatedProject = snapshot.data();
      if (!utils.isEqual(updatedProject.listIds, project.listIds)) {
        updateListIds(projectId, updatedProject.listIds);
      } else if (!utils.isEqual(updatedProject.tags, project.tags)) {
        updateProjectTags(projectId, updatedProject.tags);
      } else {
        updateProject(projectId, updatedProject);
      }
    });
    this.listObserver = firebase.db
      .collection('lists')
      .where('projectId', '==', projectId)
      .onSnapshot(querySnapshot => {
        querySnapshot.docChanges().forEach(change => {
          const list = {
            [change.doc.id]: change.doc.data()
          };
          updateListsById(list);
        });
      });
    this.subtaskObserver = firebase.db
      .collection('subtasks')
      .where('projectId', '==', projectId)
      .onSnapshot(querySnapshot => {
        querySnapshot.docChanges().forEach(change => {
          const subtaskId = change.doc.id;
          const subtaskData = change.doc.data();
          if (change.type === 'added') {
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
    this.taskObserver = firebase.db
      .collection('tasks')
      .where('projectId', '==', projectId)
      .onSnapshot(querySnapshot => {
        querySnapshot.docChanges().forEach(change => {
          const taskId = change.doc.id;
          const taskData = change.doc.data();
          if (change.type === 'added') {
            addTask({ taskId, taskData });
          } else if (change.type === 'removed') {
            deleteTask(taskId);
          } else {
            updateTask({ taskId, taskData });
          }
        });
      });
    console.log('mounted');
  }

  componentWillUnmount() {
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

    this.setState({
      isDragging: false
    });
  };

  toggleTaskEditor = () => {
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
      firebase.updateProject(projectId, {
        name: newProjectName
      });
      console.log('updated project name!');
    }
  };

  render() {
    const { isFetching, isTaskEditorOpen, projectName } = this.state;
    const { current, listsArray, tasksById, projectId, userId } = this.props;
    if (isFetching) return null;
    const { taskId } = current;

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
          {listsArray.map((list, listIndex) => {
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
            {...tasksById[taskId]}
            handleTaskEditorClose={this.toggleTaskEditor}
            userId={userId}
          />
        )}
      </main>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    projectsById: projectSelectors.getProjectsById(state),
    current: currentSelectors.getCurrent(state),
    listsById: listSelectors.getListsById(state),
    listsArray: listSelectors.getListsArray(state),
    tasksById: taskSelectors.getTasksById(state),
    project: projectSelectors.getProject(state, ownProps.projectId)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateProject: (projectId, projectData) =>
      dispatch(projectActions.updateProject(projectId, projectData)),
    selectProject: projectId => dispatch(currentActions.selectProject(projectId)),
    selectTask: taskId => dispatch(currentActions.selectTask(taskId)),
    fetchListsById: projectId => dispatch(listActions.fetchListsById(projectId)),
    updateListsById: list => dispatch(listActions.updateListsById(list)),
    fetchProjectTasks: projectId => dispatch(taskActions.fetchProjectTasks(projectId)),
    fetchTaskSubtasks: projectId =>
      dispatch(subtaskActions.fetchTaskSubtasks(projectId)),
    reorderLists: (projectId, listIds) =>
      dispatch(projectActions.reorderLists(projectId, listIds)),
    updateListIds: (projectId, listIds) =>
      dispatch(projectActions.updateListIds(projectId, listIds)),
    updateProjectTags: (projectId, tags) =>
      dispatch(projectActions.updateProjectTags(projectId, tags)),
    addTask: ({ taskId, taskData }) =>
      dispatch(taskActions.addTask({ taskId, taskData })),
    updateTask: ({ taskId, taskData }) =>
      dispatch(taskActions.updateTask({ taskId, taskData })),
    deleteTask: taskId => dispatch(taskActions.deleteTask(taskId)),
    addSubtask: ({ subtaskId, subtaskData }) =>
      dispatch(subtaskActions.addSubtask({ subtaskId, subtaskData })),
    deleteSubtask: subtaskId =>
      dispatch(subtaskActions.deleteSubtask(subtaskId)),
    updateSubtask: ({ subtaskId, subtaskData }) =>
      dispatch(subtaskActions.updateSubtask({ subtaskId, subtaskData }))
  };
};

export default withFirebase(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(BoardContainer)
);
