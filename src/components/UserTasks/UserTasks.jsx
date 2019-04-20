import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { withAuthorization } from '../Session';
import {
  currentUserActions,
  currentUserSelectors
} from '../../ducks/currentUser';
import { taskSelectors } from '../../ducks/tasks';
import {
  selectTask as selectTaskAction,
  getSelectedTaskId,
  getSelectedTask
} from '../../ducks/selectedTask';
import * as droppableTypes from '../../constants/droppableTypes';
import { Folder } from '../Folder';
import { Main } from '../Main';
import { TaskEditor } from '../TaskEditor';
import { Settings } from '../Settings';
import './UserTasks.scss';

class UserTasks extends Component {
  state = {
    isLoading: true,
    isTaskSettingsMenuVisible: false
  };

  async componentDidMount() {
    const { syncFolders } = this.props;
    this.unsubscribe = await syncFolders();
    this.setState({
      isLoading: false
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
    const { selectedTaskId, selectTask } = this.props;
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

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
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
          console.log(newFolderId);
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
          console.log(origFolderId, newFolderId);
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
    const {
      currentUser,
      selectedTaskId,
      selectedTask,
      taskGroups
    } = this.props;
    const { userId, tempSettings } = currentUser;
    const { view, sortBy } = tempSettings.tasks;
    const {
      isLoading,
      isTaskSettingsMenuVisible
    } = this.state;
    const isTaskEditorOpen = !!selectedTaskId;
    if (isLoading) return null;
    return (
      <Main
        title="My Tasks"
        classes={{
          main: `user-tasks__container ${
            isTaskEditorOpen ? 'show-task-editor' : ''
          }`,
          title: 'user-tasks__title'
        }}
      >
        <div className="user-tasks__wrapper">
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
                  <Settings
                    icon="sliders"
                    isActive={isTaskSettingsMenuVisible}
                    onToggle={this.toggleTaskSettingsMenu}
                    onClose={this.closeTaskSettingsMenu}
                    onSave={this.saveTaskSettings}
                    classes={{
                      wrapper: 'user-tasks__settings-wrapper',
                      settings: 'user-tasks__settings'
                    }}
                    settings={[
                      {
                        name: 'View',
                        key: 'view',
                        type: 'radio',
                        options: {
                          active: { value: 'active', name: 'Active Tasks' },
                          completed: {
                            value: 'completed',
                            name: 'Completed Tasks'
                          },
                          all: { value: 'all', name: 'All Tasks' }
                        },
                        value: view,
                        onChange: this.setTempTaskSettings
                      },
                      {
                        name: 'Sort By',
                        key: 'sortBy',
                        type: 'select',
                        options: {
                          folder: { value: 'folder', name: 'Folder' },
                          dueDate: { value: 'dueDate', name: 'Due Date' },
                          project: { value: 'project', name: 'Project'}
                        },
                        value: sortBy,
                        onChange: this.setTempTaskSettings
                      }
                    ]}
                  />
                  {taskGroups.map((taskGroup, i) => (
                    <Folder
                      key={`${sortBy}-${taskGroup[sortBy] ||
                        taskGroup[`${sortBy}Id`]}`}
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
          {isTaskEditorOpen && (
            <TaskEditor
              {...selectedTask}
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

export default withAuthorization(condition)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(UserTasks)
);
