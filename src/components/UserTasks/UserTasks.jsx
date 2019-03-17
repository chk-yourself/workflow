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
import { TaskSettings } from '../TaskSettings';
import './UserTasks.scss';

class UserTasks extends Component {
  state = {
    isLoading: true,
    isTaskEditorOpen: false,
    isTaskSettingsOpen: false,
    isSortRuleDropdownActive: false
  };

  async componentDidMount() {
    const {
      userId,
      syncUserTasks,
      syncFolders
    } = this.props;

    await Promise.all([
      syncUserTasks(userId),
      syncFolders(userId)
    ]).then(listeners => {
      this.unsubscribe = listeners;
      this.setState({
        isLoading: false
      });
    });
  }

  componentWillUnmount() {
    this.unsubscribe.forEach(func => func());
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
        firebase.updateDoc(['users', currentUserId, 'folders', newFolderId], {
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

  selectViewFilter = e => {
    const { firebase, currentUserId } = this.props;
    firebase.updateDoc(['users', currentUserId], {
      [`settings.tasks.view`]: e.target.value
    });
  };

  selectSortRule = e => {
    const { firebase, currentUserId } = this.props;
    firebase.updateDoc(['users', currentUserId], {
      [`settings.tasks.sortBy`]: e.target.value
    });
    this.toggleSortRuleDropdown();
  };

  toggleTaskSettings = () => {
    this.setState(prevState => ({
      isTaskSettingsOpen: !prevState.isTaskSettingsOpen
    }));
  };

  toggleSortRuleDropdown = () => {
    this.setState(prevState => ({
      isSortRuleDropdownActive: !prevState.isSortRuleDropdownActive
    }));
  };

  render() {
    const { userId, selectedTaskId, tasksById, folders, taskSettings } = this.props;
    const { isLoading, isTaskEditorOpen, isSortRuleDropdownActive, isTaskSettingsOpen } = this.state;
    console.log(folders);
    if (isLoading) return null;
    return (
      <Main title="All Tasks" classes={{title: 'user-tasks__title'}}>
        <TaskSettings
          isOpen={isTaskSettingsOpen}
          onToggle={this.toggleTaskSettings}
          classes={{
            wrapper: 'user-tasks__settings-wrapper',
            popover: 'user-tasks__settings',
            item: 'user-tasks__settings-item'
          }}
          filters={[
              {
                filter: 'view',
                options: [
                  {value: 'active', name: 'Active Tasks'},
                  {value: 'completed', name: 'Completed Tasks'},
                  {value: 'all', name: 'All Tasks'}
                  ],
                value: taskSettings.view,
                onChange: this.selectViewFilter
              }
            ]}
            sortRule={{
              options: [{value: "project", name: "Project"}, {value: "folder", name: "Folder"}, {value: "dueDate", name: "Due Date"}],
              value: taskSettings.sortBy,
              onChange: this.selectSortRule,
              isDropdownActive: isSortRuleDropdownActive,
              toggleDropdown: this.toggleSortRuleDropdown
            }} />
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
                      key={`${taskSettings.sortBy}-${folder.folderId || folder.projectId || folder.dueDate}`}
                      userId={userId}
                      folderId={folder.folderId}
                      projectId={folder.projectId}
                      projectName={folder.projectName}
                      dueDate={folder.dueDate}
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
    selectedTaskId: getSelectedTaskId(state),
    assignedTasks: currentUserSelectors.getAssignedTasks(state),
    taskSettings: currentUserSelectors.getTaskSettings(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    syncFolders: userId => dispatch(currentUserActions.syncFolders(userId)),
    selectTask: taskId => dispatch(selectTaskAction(taskId)),
    syncUserTasks: userId => dispatch(currentUserActions.syncUserTasks(userId)),
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
