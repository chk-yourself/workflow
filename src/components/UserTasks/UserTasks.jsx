import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { withAuthorization } from '../Session';
import {
  currentUserActions,
  currentUserSelectors
} from '../../ducks/currentUser';
import { taskSelectors, taskActions } from '../../ducks/tasks';
import {
  selectTask as selectTaskAction,
  getSelectedTaskId
} from '../../ducks/selectedTask';
import * as droppableTypes from '../../constants/droppableTypes';
import { Folder } from '../Folder';
import { Main } from '../Main';
import { TaskEditor } from '../TaskEditor';
import './UserTasks.scss';

class UserTasks extends Component {
  state = {
    isFetching: true,
    isTaskEditorOpen: false
  };

  componentDidMount() {
    const {
      userId,
      fetchFolders,
      fetchUserTasks,
      syncUserTasks,
      syncFolders
    } = this.props;
    fetchFolders(userId);
    fetchUserTasks(userId).then(() => {
      this.setState({
        isFetching: false
      });

      this.taskObserver = () => syncUserTasks(userId);
      this.taskObserver();
    });

    this.folderObserver = () => syncFolders(userId);
    this.folderObserver();
  }

  componentWillUnmount() {
    this.taskObserver();
    this.folderObserver();
  }

  toggleTaskEditor = () => {
    const { isTaskEditorOpen } = this.state;
    const { selectTask } = this.props;

    if (isTaskEditorOpen) {
      selectTask(null);
    }

    this.setState(prevState => ({
      isTaskEditorOpen: !prevState.isTaskEditorOpen
    }));
  };

  handleTaskClick = taskId => {
    const { selectTask } = this.props;
    const { isTaskEditorOpen } = this.state;
    selectTask(taskId);
    if (!isTaskEditorOpen) {
      this.toggleTaskEditor();
    }
  };

  onDragEnd = ({ destination, draggableId, source, type }) => {
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;
    const { firebase, currentUserId } = this.props;
    if (type === droppableTypes.TASK) {
      const { foldersById } = this.props;
      const { droppableId: origFolderId, index: origIndex } = source;
      const { droppableId: newFolderId, index: newIndex } = destination;
      const isMovedWithinFolder = origFolderId === newFolderId;
      const updatedTaskIds = [...foldersById[newFolderId].taskIds];
      if (isMovedWithinFolder) {
        updatedTaskIds.splice(origIndex, 1);
        updatedTaskIds.splice(newIndex, 0, draggableId);
        firebase.updateDoc(`users/${currentUserId}/folders/${newFolderId}`, {
          taskIds: updatedTaskIds
        });
      } else {
        updatedTaskIds.splice(newIndex, 0, draggableId);
        firebase.moveTaskToFolder({
          userId: currentUserId,
          taskId: draggableId,
          origFolderId,
          newFolderId,
          updatedTaskIds
        });
      }
    }

    if (type === droppableTypes.FOLDER) {
      const { folderIds, reorderFolders } = this.props;
      const updatedFolderIds = [...folderIds];
      updatedFolderIds.splice(source.index, 1);
      updatedFolderIds.splice(destination.index, 0, draggableId);
      firebase.updateDoc(`users/${currentUserId}`, {
        folderIds: updatedFolderIds
      });
      reorderFolders(currentUserId, updatedFolderIds);
    }
  };

  onDragStart = () => {
    this.setState({
      isDragging: true
    });
  };

  render() {
    const { filters, userId, selectedTaskId, tasksById, folders } = this.props;
    const { isFetching, isTaskEditorOpen } = this.state;
    if (isFetching) return null;
    return (
      <Main title="All Tasks">
        <div
          className={`user-tasks__wrapper ${
            isTaskEditorOpen ? 'show-task-editor' : ''
          }`}
        >
          <DragDropContext
            onDragEnd={this.onDragEnd}
            onDragStart={this.onDragStart}
          >
            <Droppable droppableId={userId} type={droppableTypes.FOLDER}>
              {provided => (
                <div
                  className="user-tasks"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {folders.map((folder, i) => (
                    <Folder
                      key={folder.folderId}
                      userId={userId}
                      folderId={folder.folderId}
                      index={i}
                      name={folder.name}
                      taskIds={folder.taskIds}
                      onTaskClick={this.handleTaskClick}
                      isRestricted={folder.isDefault}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          {isTaskEditorOpen && (
            <TaskEditor
              {...tasksById[selectedTaskId]}
              handleTaskEditorClose={this.toggleTaskEditor}
              userId={userId}
              view="list"
              key={selectedTaskId}
            />
          )}
        </div>
      </Main>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentUserId: currentUserSelectors.getCurrentUserId(state),
    foldersById: currentUserSelectors.getFolders(state),
    folders: currentUserSelectors.getFoldersArray(state),
    folderIds: currentUserSelectors.getFolderIds(state),
    tasksById: taskSelectors.getTasksById(state),
    selectedTaskId: getSelectedTaskId(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    syncFolders: userId => dispatch(currentUserActions.syncFolders(userId)),
    selectTask: taskId => dispatch(selectTaskAction(taskId)),
    syncUserTasks: userId => dispatch(taskActions.syncUserTasks(userId)),
    fetchFolders: userId => dispatch(currentUserActions.fetchFolders(userId)),
    fetchUserTasks: userId => dispatch(taskActions.fetchUserTasks(userId)),
    reorderFolders: (userId, folderIds) =>
      dispatch(currentUserActions.reorderFolders(userId, folderIds))
  };
};

const condition = authUser => !!authUser;

export default withAuthorization(condition)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(UserTasks)
);
