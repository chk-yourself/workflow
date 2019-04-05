import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Droppable } from 'react-beautiful-dnd';
import { withFirebase } from '../Firebase';
import * as droppableTypes from '../../constants/droppableTypes';
import { ListComposer } from '../ListComposer';
import { Button } from '../Button';
import { Input } from '../Input';
import { Toolbar } from '../Toolbar';
import { TaskSettings } from '../TaskSettings';
import { projectActions } from '../../ducks/projects';
import { ProjectIcon } from '../ProjectIcon';

class Project extends Component {
  state = {
    name: this.props.name,
    isListComposerActive: false,
    isTaskSettingsMenuVisible: false,
    isSortRuleDropdownVisible: false
  };

  toggleListComposer = () => {
    this.setState(prevState => ({
      isListComposerActive: !prevState.isListComposerActive
    }));
  };

  setInputRef = ref => {
    this.listComposerInput = ref;
  };

  onNameChange = e => {
    this.setState({
      name: e.target.value
    });
  };

  onNameBlur = e => {
    const { name: prevName, projectId, firebase } = this.props;
    const { name } = this.state;

    // When field loses focus, update list title if change is detected

    if (prevName !== name) {
      firebase.updateProjectName({ projectId, name });
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
    const { projectId, color, children, layout, tempSettings } = this.props;

    const {
      name,
      isListComposerActive,
      isTaskSettingsMenuVisible,
      isSortRuleDropdownVisible
    } = this.state;
    return (
      <div className={`project is-${layout}-layout`}>
        <div className="project__header">
          <div className="project__header-content">
            <div className="project__name-wrapper">
            <ProjectIcon className="project__icon" color={color} />
            <span className="project__name">{name}</span>
            </div>
            <Input
              className="project__input--name"
              name="projectName"
              type="text"
              value={name}
              onChange={this.onNameChange}
              required
              hideLabel
              onBlur={this.onNameBlur}
            />
          </div>
        </div>
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
                    value: tempSettings.tasks.view,
                    onChange: this.setTempProjectSettings
                  }
                ]}
                sortRule={{
                  options: [
                    { value: 'none', name: 'None' },
                    { value: 'dueDate', name: 'Due Date' }
                  ],
                  value: tempSettings.tasks.sortBy,
                  onChange: this.setTempProjectSettings,
                  isDropdownVisible: isSortRuleDropdownVisible,
                  toggleDropdown: this.toggleSortRuleDropdown,
                  hideDropdown: this.hideSortRuleDropdown
                }}
              />
            </Toolbar>
        <Droppable
          droppableId={projectId}
          type={droppableTypes.LIST}
          direction={layout === 'board' ? 'horizontal' : 'vertical'}
        >
          {provided => (
            <div
              className="project__lists"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {children}
              {provided.placeholder}
              <ListComposer
                inputRef={this.setInputRef}
                toggle={this.toggleListComposer}
                isActive={isListComposerActive}
                layout={layout}
                projectId={projectId}
              />
            </div>
          )}
        </Droppable>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setTempProjectSettings: ({ projectId, view, sortBy }) =>
      dispatch(
        projectActions.setTempProjectSettings({ projectId, view, sortBy })
      )
  };
};

export default withFirebase(
  connect(
    null,
    mapDispatchToProps
  )(Project)
);
