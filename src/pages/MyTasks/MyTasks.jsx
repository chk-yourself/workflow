import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { withAuthorization } from '../../components/Session';
import { currentUserActions, currentUserSelectors } from '../../ducks/currentUser';
import { taskSelectors } from '../../ducks/tasks';
import {
  selectTask as selectTaskAction,
  getSelectedTaskId,
  getSelectedTask
} from '../../ducks/selectedTask';
import * as droppableTypes from '../../constants/droppableTypes';
import { Folder } from '../../components/Folder';
import { Main } from '../../components/Main';
import { TaskEditor } from '../../components/TaskEditor';
import { setDocTitle } from '../../utils/react';
import TaskSettings from './TaskSettings';
import './MyTasks.scss';

class MyTasks extends Component {
  state = {
    isLoading: true,
    isTaskSettingsMenuVisible: false
  };

  async componentDidMount() {
    const {
      activeWorkspace: { name }
    } = this.props;
    setDocTitle(`My Tasks in ${name} - Workflow`);
    const { syncFolders } = this.props;
    this.unsubscribe = await syncFolders();
    this.setState({
      isLoading: false
    });
  }

  componentWillUnmount() {
    const { selectedTaskId, selectTask } = this.props;
    this.unsubscribe && this.unsubscribe();
    if (selectedTaskId) {
      selectTask(null);
    }
  }

  closeTaskEditor = () => {
    const { selectTask } = this.props;
    selectTask(null);
  };

  handleTaskClick = taskId => {
    const { selectTask } = this.props;
    selectTask(taskId);
  };

  onDragEnd = ({ destination, draggableId, source, type }) => {
    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index)
      return;
    const { firebase, currentUser, state, activeWorkspace } = this.props;
    const { workspaceId } = activeWorkspace;
    const { userId, folderIds, tempSettings } = currentUser;
    const { view, sortBy } = tempSettings.tasks;
    switch (type) {
      case droppableTypes.TASK: {
        const { droppableId: origFolderId, index: origIndex } = source;
        const { droppableId: newFolderId, index: newIndex } = destination;
        const isMovedWithinFolder = origFolderId === newFolderId;
        const taskIdsByView = taskSelectors.getTaskIdsByViewFilter(state, {
          folderId: newFolderId
        });
        const updatedTaskIds = [...taskIdsByView[view]];

        if (isMovedWithinFolder) {
          updatedTaskIds.splice(origIndex, 1);
          updatedTaskIds.splice(newIndex, 0, draggableId);
          firebase.updateDoc(['users', userId, 'workspaces', workspaceId, 'folders', newFolderId], {
            taskIds:
              view === 'all'
                ? updatedTaskIds
                : view === 'active'
                ? [...taskIdsByView.completed, ...updatedTaskIds]
                : [...updatedTaskIds, ...taskIdsByView.active]
          });
        } else {
          updatedTaskIds.splice(newIndex, 0, draggableId);
          firebase.moveTaskToFolder({
            workspaceId,
            userId,
            taskId: draggableId,
            origFolderId,
            newFolderId,
            updatedTaskIds:
              view === 'all'
                ? updatedTaskIds
                : view === 'active'
                ? [...taskIdsByView.completed, ...updatedTaskIds]
                : [...updatedTaskIds, ...taskIdsByView.active],
            type: sortBy === 'folder' ? 'default' : sortBy
          });
        }
        break;
      }
      case droppableTypes.FOLDER: {
        const { reorderFolders } = this.props;
        const updatedFolderIds = [...folderIds];
        updatedFolderIds.splice(source.index, 1);
        updatedFolderIds.splice(destination.index, 0, draggableId);
        firebase.updateDoc(['users', userId, 'workspaces', workspaceId], {
          folderIds: updatedFolderIds
        });
        reorderFolders(userId, updatedFolderIds);
        break;
      }
      default: {
        const { droppableId: origFolderId, index: origIndex } = source;
        const { droppableId: newFolderId, index: newIndex } = destination;
        const isMovedWithinFolder = origFolderId === newFolderId;
        const taskIdsByView = taskSelectors.getTaskIdsByViewFilter(state, {
          folderId: newFolderId
        });
        const updatedTaskIds = [...taskIdsByView[view]];
        if (isMovedWithinFolder) {
          updatedTaskIds.splice(origIndex, 1);
          updatedTaskIds.splice(newIndex, 0, draggableId);
          firebase.updateDoc(['users', userId, 'workspaces', workspaceId, 'folders', newFolderId], {
            taskIds:
              view === 'all'
                ? updatedTaskIds
                : view === 'active'
                ? [...taskIdsByView.completed, ...updatedTaskIds]
                : [...updatedTaskIds, ...taskIdsByView.active]
          });
        }
      }
    }
  };

  saveTaskSettings = () => {
    const { firebase, currentUser } = this.props;
    const { userId, tempSettings } = currentUser;
    const { view, sortBy } = tempSettings.tasks;
    firebase.updateDoc(['users', userId], {
      [`settings.tasks.view`]: view,
      [`settings.tasks.sortBy`]: sortBy
    });
    this.closeTaskSettingsMenu();
  };

  setTempTaskSettings = e => {
    const { setTempTaskSettings } = this.props;
    const { name, value } = e.target;
    setTempTaskSettings({
      [name]: value
    });
  };

  toggleTaskSettingsMenu = e => {
    e.stopPropagation();
    this.setState(prevState => ({
      isTaskSettingsMenuVisible: !prevState.isTaskSettingsMenuVisible
    }));
  };

  closeTaskSettingsMenu = () => {
    this.setState({
      isTaskSettingsMenuVisible: false
    });
  };

  render() {
    const { currentUser, selectedTaskId, selectedTask, taskGroups } = this.props;
    const { userId, tempSettings } = currentUser;
    const { view, sortBy } = tempSettings.tasks;
    const { isLoading, isTaskSettingsMenuVisible } = this.state;
    const isTaskEditorOpen = !!selectedTaskId;
    if (isLoading) return null;
    return (
      <Main
        title="My Tasks"
        classes={{
          main: `user-tasks__container ${isTaskEditorOpen ? 'show-task-editor' : ''}`,
          title: 'user-tasks__title'
        }}
      >
        <div className="user-tasks__wrapper">
          <DragDropContext onDragEnd={this.onDragEnd} onDragStart={this.onDragStart}>
            <Droppable droppableId={userId} type={droppableTypes.FOLDER}>
              {provided => (
                <div className="user-tasks" ref={provided.innerRef} {...provided.droppableProps}>
                  <TaskSettings
                    isVisible={isTaskSettingsMenuVisible}
                    onChange={this.setTempTaskSettings}
                    onToggle={this.toggleTaskSettingsMenu}
                    onSave={this.saveTaskSettings}
                    onClose={this.closeTaskSettingsMenu}
                    view={view}
                    sortBy={sortBy}
                  />
                  {taskGroups.map((taskGroup, i) => (
                    <Folder
                      key={`${sortBy}-${taskGroup[sortBy] || taskGroup[`${sortBy}Id`]}`}
                      userId={userId}
                      folderId={taskGroup.folderId}
                      projectId={taskGroup.projectId}
                      projectName={taskGroup.projectName}
                      dueDate={taskGroup.dueDate}
                      index={i}
                      name={taskGroup.name}
                      taskIds={taskGroup.taskIds}
                      userPermissions={taskGroup.userPermissions}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          {isTaskEditorOpen && <TaskEditor {...selectedTask} layout="list" key={selectedTaskId} />}
        </div>
      </Main>
    );
  }
}

const mapStateToProps = state => {
  return {
    state,
    selectedTask: getSelectedTask(state),
    selectedTaskId: getSelectedTaskId(state),
    taskGroups: currentUserSelectors.getSortedFilteredTaskGroups(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    syncFolders: () => dispatch(currentUserActions.syncFolders()),
    selectTask: taskId => dispatch(selectTaskAction(taskId)),
    reorderFolders: (userId, folderIds) =>
      dispatch(currentUserActions.reorderFolders(userId, folderIds)),
    setTempTaskSettings: ({ view = null, sortBy = null }) =>
      dispatch(currentUserActions.setTempTaskSettings({ view, sortBy }))
  };
};

const condition = (currentUser, activeWorkspace) => !!currentUser && !!activeWorkspace;

export default withAuthorization(condition)(connect(mapStateToProps, mapDispatchToProps)(MyTasks));
