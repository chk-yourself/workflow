import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { withAuthorization } from '../Session';
import { userSelectors } from '../../ducks/users';
import { listActions, listSelectors } from '../../ducks/lists';
import { authUserActions, authUserSelectors } from '../../ducks/authUser';
import { taskSelectors, taskActions } from '../../ducks/tasks';
import { currentActions, currentSelectors } from '../../ducks/current';
import * as keys from '../../constants/keys';
import * as droppableTypes from '../../constants/droppableTypes';
import { Folder } from '../Folder';
import { List } from '../List';
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
      addTask,
      updateTask,
      deleteTask,
      addFolder,
      updateFolder,
      deleteFolder,
      firebase
    } = this.props;
    fetchFolders(userId);
    fetchUserTasks(userId).then(() => {
      this.setState({
        isFetching: false
      });
    });

    this.taskObserver = firebase.db
      .collection('tasks')
      .where('assignedTo', 'array-contains', userId)
      .onSnapshot(querySnapshot => {
        querySnapshot.docChanges().forEach(change => {
          const taskId = change.doc.id;
          const taskData = change.doc.data();
          if (change.type === 'added') {
            console.log('added task');
            addTask({ taskId, taskData });
          } else if (change.type === 'removed') {
            deleteTask(taskId);
          } else {
            updateTask({ taskId, taskData });
          }
        });
      });

    this.folderObserver = firebase
      .getDocRef(`users/${userId}`)
      .collection('folders')
      .onSnapshot(querySnapshot => {
        querySnapshot.docChanges().forEach(change => {
          const folderId = change.doc.id;
          const folderData = change.doc.data();
          if (change.type === 'added') {
            addFolder({ folderId, folderData });
          } else if (change.type === 'removed') {
            deleteFolder(folderId);
          } else {
            updateFolder({ folderId, folderData });
          }
        });
      });
  }

  componentWillUnmount() {
    this.taskObserver();
    this.folderObserver();
  }

  toggleTaskEditor = () => {
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
    const { firebase, authUserId } = this.props;
    if (type === droppableTypes.TASK) {
      const { foldersById } = this.props;
      const { droppableId: origFolderId, index: origIndex } = source;
      const { droppableId: newFolderId, index: newIndex } = destination;
      const isMovedWithinFolder = origFolderId === newFolderId;
      const updatedTaskIds = [...foldersById[newFolderId].taskIds];
      if (isMovedWithinFolder) {
        updatedTaskIds.splice(origIndex, 1);
        updatedTaskIds.splice(newIndex, 0, draggableId);
        firebase.updateDoc(
          `users/${authUserId}/folders/${newFolderId}`,
          {
            taskIds: updatedTaskIds
          }
        );
      } else {
        updatedTaskIds.splice(newIndex, 0, draggableId);
        firebase.moveTaskToFolder({
          userId: authUserId,
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
      firebase.updateDoc(`users/${authUserId}`, {
        folderIds: updatedFolderIds
      });
      reorderFolders(authUserId, updatedFolderIds);
    }
  };

  onDragStart = () => {
    this.setState({
      isDragging: true
    });
  };

  render() {
    const { filters, userId, taskId, tasksById, folders } = this.props;
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
              {...tasksById[taskId]}
              handleTaskEditorClose={this.toggleTaskEditor}
              userId={userId}
              view="list"
              key={taskId}
            />
          )}
        </div>
      </Main>
    );
  }
}

const mapStateToProps = state => {
  return {
    authUserId: authUserSelectors.getAuthUserId(state),
    foldersById: authUserSelectors.getFolders(state),
    folders: authUserSelectors.getFoldersArray(state),
    folderIds: authUserSelectors.getFolderIds(state),
    tasksById: taskSelectors.getTasksById(state),
    taskId: currentSelectors.getCurrentTaskId(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectTask: taskId => dispatch(currentActions.selectTask(taskId)),
    syncUserTasks: userId => dispatch(taskActions.syncUserTasks(userId)),
    fetchFolders: userId => dispatch(authUserActions.fetchFolders(userId)),
    fetchUserTasks: userId => dispatch(taskActions.fetchUserTasks(userId)),
    addTask: ({ taskId, taskData }) =>
      dispatch(taskActions.addTask({ taskId, taskData })),
    updateTask: ({ taskId, taskData }) =>
      dispatch(taskActions.updateTask({ taskId, taskData })),
    deleteTask: taskId => dispatch(taskActions.deleteTask(taskId)),
    addFolder: ({ folderId, folderData }) =>
      dispatch(authUserActions.addFolder({ folderId, folderData })),
    updateFolder: ({ folderId, folderData }) =>
      dispatch(authUserActions.updateFolder({ folderId, folderData })),
    deleteFolder: folderId => dispatch(authUserActions.deleteFolder(folderId)),
    reorderFolders: (userId, folderIds) => dispatch(authUserActions.reorderFolders(userId, folderIds))
  };
};

const condition = authUser => !!authUser;

export default withAuthorization(condition)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(UserTasks)
);
