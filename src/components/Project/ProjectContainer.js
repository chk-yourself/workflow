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
import Project from './Project';
import { Toolbar } from '../Toolbar';
import { Button } from '../Button';
import { Input } from '../Input';
import { List } from '../List';
import { TaskEditor } from '../TaskEditor';
import * as droppableTypes from '../../constants/droppableTypes';
import { TaskSettings } from '../TaskSettings';
import './Project.scss';

class ProjectContainer extends Component {
  state = {
    isTaskEditorOpen: false,
    projectName: this.props.projectName,
    isListComposerActive: false,
    isTaskSettingsMenuVisible: false,
    isSortRuleDropdownVisible: false
  };

  async componentDidMount() {
    const {
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

  toggleListComposer = e => {
    this.setState(prevState => ({
      isListComposerActive: !prevState.isListComposerActive
    }));
  };

  inputRef = ref => {
    this.listComposerInput = ref;
  };

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
        firebase.updateDoc(['lists', source.droppableId], {
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
      firebase.updateDoc(['projects', projectId], {
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
    }
  };

  activateListComposer = e => {
    this.listComposerInput.focus();
  };

  saveProjectSettings = () => {
    const { firebase, projectId, tempProjectSettings } = this.props;
    firebase.updateDoc(['projects', projectId], {
      [`settings.tasks.view`]: tempProjectSettings.tasks.view,
      [`settings.tasks.sortBy`]: tempProjectSettings.tasks.sortBy
    });
    this.closeTaskSettingsMenu();
  };

  setTempProjectSettings = e => {
    const { projectId } = this.props;
    const { setTempProjectSettings } = this.props;
    const { name, value } = e.target;
    setTempProjectSettings({
      projectId,
      [name]: value
    });
    if (name === 'sortBy') {
      this.hideSortRuleDropdown();
    }
  };

  toggleTaskSettingsMenu = e => {
    this.setState(prevState => ({
      isTaskSettingsMenuVisible: !prevState.isTaskSettingsMenuVisible,
      isSortRuleDropdownVisible:
        prevState.isSortRuleDropdownVisible &&
        prevState.isTaskSettingsMenuVisible
          ? !prevState.isSortRuleDropdownVisible
          : prevState.isSortRuleDropdownVisible
    }));
  };

  closeTaskSettingsMenu = () => {
    this.setState({
      isTaskSettingsMenuVisible: false,
      isSortRuleDropdownVisible: false
    });
  };

  toggleSortRuleDropdown = () => {
    this.setState(prevState => ({
      isSortRuleDropdownVisible: !prevState.isSortRuleDropdownVisible
    }));
  };

  hideSortRuleDropdown = () => {
    this.setState({
      isSortRuleDropdownVisible: false
    });
  };


  render() {
    const { isTaskEditorOpen, projectName, isListComposerActive, isTaskSettingsMenuVisible, isSortRuleDropdownVisible } = this.state;
    const {
      lists,
      tasksById,
      projectId,
      userId,
      selectedTaskId,
      isLoaded,
      project,
      tempProjectSettings
    } = this.props;
    if (!isLoaded.tasks || !isLoaded.subtasks || !isLoaded.lists) return null;
    return (
      <main className={`project-container is-${project.layout}-layout ${isTaskEditorOpen ? 'show-task-editor' : ''}`}>
      <div className="project__header">
        <div className="project__header-content">
        <Input
          className="project__input--title"
          name="projectName"
          type="text"
          value={projectName}
          onChange={this.onNameChange}
          required
          hideLabel
          onBlur={this.onNameBlur}
        />
          <Toolbar className="project__toolbar">
          <Button
            className="project__btn project__btn--add-list"
            onClick={this.activateListComposer}
            color="primary"
            variant="contained"
            size="sm"
          >
            Add List
          </Button>
          <TaskSettings
          isVisible={isTaskSettingsMenuVisible}
          onToggle={this.toggleTaskSettingsMenu}
          onClose={this.closeTaskSettingsMenu}
          onSave={this.saveProjectSettings}
          classes={{
            wrapper: 'project__task-settings-wrapper',
            popover: 'project__task-settings',
            item: 'project__task-settings-item',
            button: 'project__task-settings-btn'
          }}
          filters={[
            {
              filter: 'view',
              options: [
                { value: 'active', name: 'Active Tasks' },
                { value: 'completed', name: 'Completed Tasks' },
                { value: 'all', name: 'All Tasks' }
              ],
              value: tempProjectSettings.tasks.view,
              onChange: this.setTempProjectSettings
            }
          ]}
          sortRule={{
            options: [
              { value: 'none', name: 'None' },
              { value: 'dueDate', name: 'Due Date' }
            ],
            value: tempProjectSettings.tasks.sortBy,
            onChange: this.setTempProjectSettings,
            isDropdownVisible: isSortRuleDropdownVisible,
            toggleDropdown: this.toggleSortRuleDropdown,
            hideDropdown: this.hideSortRuleDropdown
          }}
        />
          </Toolbar>
        </div>
        </div>
        <div className="project__wrapper">
        <DragDropContext
          onDragEnd={this.onDragEnd}
          onDragStart={this.onDragStart}
        >
          <Project projectId={projectId} layout={project.layout} inputRef={this.inputRef} toggleListComposer={this.toggleListComposer} isListComposerActive={isListComposerActive}>
            {lists.map((list, i) => {
              const { listId, name: listName, taskIds } = list;
              return (
                <List
                  viewFilter={tempProjectSettings.tasks.view}
                  sortBy={tempProjectSettings.tasks.sortBy}
                  listId={listId}
                  key={listId}
                  index={i}
                  name={listName}
                  taskIds={taskIds}
                  onTaskClick={this.handleTaskClick}
                  projectId={projectId}
                  layout={project.layout}
                  isRestricted={false}
                />
              );
            })}
          </Project>
        </DragDropContext>
        {isTaskEditorOpen && (
          <TaskEditor
            {...tasksById[selectedTaskId]}
            handleTaskEditorClose={this.toggleTaskEditor}
            userId={userId}
            layout={project.layout}
          />
        )}
        </div>
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
    isLoaded: projectSelectors.getProjectLoadedState(state, ownProps.projectId),
    tempProjectSettings: projectSelectors.getTempProjectSettings(state, ownProps.projectId)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectProject: projectId => dispatch(selectProjectAction(projectId)),
    selectTask: taskId => dispatch(selectTaskAction(taskId)),
    reorderLists: (projectId, listIds) =>
      dispatch(projectActions.reorderLists(projectId, listIds)),
    updateProjectTags: (projectId, tags) =>
      dispatch(projectActions.updateProjectTags(projectId, tags)),
    syncProjectLists: projectId =>
      dispatch(listActions.syncProjectLists(projectId)),
    syncProjectTasks: projectId =>
      dispatch(taskActions.syncProjectTasks(projectId)),
    syncProjectSubtasks: projectId =>
      dispatch(subtaskActions.syncProjectSubtasks(projectId)),
    syncProject: projectId => dispatch(projectActions.syncProject(projectId)),
    setTempProjectSettings: ({projectId, view, sortBy}) => dispatch(projectActions.setTempProjectSettings({projectId, view, sortBy}))
  };
};

export default withFirebase(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ProjectContainer)
);
