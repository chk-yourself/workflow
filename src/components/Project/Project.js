import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { Droppable } from 'react-beautiful-dnd';
import { withAuthorization } from '../Session';
import * as droppableTypes from '../../constants/droppableTypes';
import { ListComposer } from '../ListComposer';
import { Button } from '../Button';
import { Input } from '../Input';
import { Toolbar } from '../Toolbar';
import { Icon } from '../Icon';
import { Settings } from '../Settings';
import { projectActions } from '../../ducks/projects';
import { ProjectIcon } from '../ProjectIcon';
import { DropdownMenu } from '../DropdownMenu';
import ProjectOverview from './ProjectOverview';
import * as ROUTES from '../../constants/routes';

class Project extends Component {
  state = {
    name: this.props.name,
    prevName: this.props.name,
    isListComposerActive: false,
    isProjectSettingsActive: false
  };

  static getDerivedStateFromProps(props, state) {
    if (props.name !== state.prevName) {
      return {
        name: props.name,
        prevName: props.name
      };
    }
    return null;
  }

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
      [`settings.layout`]: tempProjectSettings.layout,
      [`settings.tasks.view`]: tempProjectSettings.tasks.view,
      [`settings.tasks.sortBy`]: tempProjectSettings.tasks.sortBy
    });
    this.closeSettingsMenu();
  };

  setTempProjectSettings = e => {
    const { projectId } = this.props;
    const { setTempProjectSettings } = this.props;
    const { name, value } = e.target;
    setTempProjectSettings({
      projectId,
      [name]: value
    });
  };

  toggleSettingsMenu = e => {
    this.setState(prevState => ({
      isProjectSettingsActive: !prevState.isProjectSettingsActive
    }));
  };

  closeSettingsMenu = () => {
    this.setState({
      isProjectSettingsActive: false
    });
  };

  render() {
    const {
      projectId,
      color,
      children,
      tempSettings,
      match: {
        params: { section }
      }
    } = this.props;
    const { layout } = tempSettings;

    const { name, isListComposerActive, isProjectSettingsActive } = this.state;
    return (
      <div className={`project project--${layout} project--${section}`}>
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
              onBlur={this.onNameBlur}
              isRequired
            />
            <DropdownMenu
              classes={{
                wrapper: 'project__submenu-wrapper',
                menu: 'project__submenu',
                link: 'project__link',
                button: 'project__btn--toggle-submenu'
              }}
              links={[
                { href: `/0/projects/${projectId}/tasks`, text: 'Tasks' },
                { href: `/0/projects/${projectId}/overview`, text: 'Overview' }
              ]}
              activeLink={section}
              align={{
                outer: 'left',
                inner: 'right'
              }}
            />
          </div>
        </div>
        <Switch>
          <Route
            path={ROUTES.PROJECT_TASKS}
            render={props => (
              <>
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
                  <Settings
                    icon="sliders"
                    isActive={isProjectSettingsActive}
                    onToggle={this.toggleSettingsMenu}
                    onClose={this.closeSettingsMenu}
                    onSave={this.saveProjectSettings}
                    classes={{
                      wrapper: 'project__settings-wrapper',
                      settings: 'project__settings',
                      button: 'project__settings-btn'
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
                        value: tempSettings.tasks.view,
                        onChange: this.setTempProjectSettings
                      },
                      {
                        name: 'Sort By',
                        key: 'sortBy',
                        type: 'select',
                        options: {
                          none: { value: 'none', name: 'None' },
                          dueDate: { value: 'dueDate', name: 'Due Date' }
                        },
                        value: tempSettings.tasks.sortBy,
                        onChange: this.setTempProjectSettings
                      },
                      {
                        name: 'Layout',
                        key: 'layout',
                        type: 'select',
                        options: {
                          board: { value: 'board', name: 'Board' },
                          list: { value: 'list', name: 'List' }
                        },
                        value: tempSettings.layout,
                        onChange: this.setTempProjectSettings
                      }
                    ]}
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
              </>
            )}
          />
          <Route
            path={ROUTES.PROJECT_OVERVIEW}
            render={({ match }) => (
              <ProjectOverview projectId={match.params.id} />
            )}
          />
        </Switch>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setTempProjectSettings: ({ projectId, view, sortBy, layout }) =>
      dispatch(
        projectActions.setTempProjectSettings({
          projectId,
          view,
          sortBy,
          layout
        })
      )
  };
};

const condition = currentUser => !!currentUser;

export default withAuthorization(condition)(
  connect(
    null,
    mapDispatchToProps
  )(Project)
);
