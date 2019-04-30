import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, NavLink } from 'react-router-dom';
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
import ProjectOverview from './ProjectOverview';
import { PopoverWrapper } from '../Popover';
import { MemberAssigner } from '../MemberAssigner';
import { Menu, MenuItem } from '../Menu';
import ProjectDuplicator from './ProjectDuplicator';
import {selectProject as selectProjectAction} from '../../ducks/selectedProject';
import * as ROUTES from '../../constants/routes';

class Project extends Component {
  state = {
    name: this.props.name,
    prevName: this.props.name,
    isListComposerActive: false,
    isProjectSettingsActive: false,
    isMoreActionsMenuVisible: false,
    isProjectDuplicatorOpen: false
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

    if (prevName !== name) {
      firebase.updateProjectName({ projectId, name });
    }
  };

  activateListComposer = e => {
    this.listComposerInput.focus();
  };

  saveProjectSettings = () => {
    const { firebase, projectId, tempSettings } = this.props;
    firebase.updateDoc(['projects', projectId], {
      'settings.layout': tempSettings.layout,
      'settings.tasks.view': tempSettings.tasks.view,
      'settings.tasks.sortBy': tempSettings.tasks.sortBy
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

  handleMemberAssignment = (userId, e) => {
    const { firebase, projectId, name: projectName, memberIds, activeWorkspace } = this.props;
    const { workspaceId } = activeWorkspace;

    if (memberIds.includes(userId)) {
      firebase.removeAssignee({ projectId, userId, workspaceId });
    } else {
      firebase.addAssignee({ projectId, projectName, userId, workspaceId });
    }

    e.preventDefault();
  };

  toggleMoreActionsMenu = e => {
    this.setState(prevState => ({
      isMoreActionsMenuVisible: !prevState.isMoreActionsMenuVisible
    }));
  };

  closeMoreActionsMenu = e => {
    this.setState({
      isMoreActionsMenuVisible: false
    });
  };

  toggleProjectDuplicator = e => {
    this.setState(prevState => ({
      isProjectDuplicatorOpen: !prevState.isProjectDuplicatorOpen
    }));
  };

  closeProjectDuplicator = e => {
    this.setState({
      isProjectDuplicatorOpen: false
    });
  };

  deleteProject = () => {
    const { firebase, currentUser, selectProject, history, projectId, workspaceId, listIds, memberIds } = this.props;
    const { userId } = currentUser;
    firebase.deleteProject({
      userId,
      projectId,
      workspaceId,
      listIds,
      memberIds
    });
    selectProject(null);
    history.push(`/0/home/${userId}`);
  }

  render() {
    const {
      projectId,
      color,
      children,
      memberIds,
      ownerId,
      currentUser,
      tempSettings: {
        layout,
        tasks: { view, sortBy }
      },
      match: {
        params: { section }
      }
    } = this.props;

    const { name, isListComposerActive, isProjectSettingsActive, isMoreActionsMenuVisible, isProjectDuplicatorOpen } = this.state;
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
            <PopoverWrapper
                  isActive={isMoreActionsMenuVisible}
                  onOutsideClick={this.closeMoreActionsMenu}
                  classes={{
                    wrapper: 'project__more-actions-wrapper',
                    popover: 'project__more-actions'
                  }}
                  align={{ inner: 'right' }}
                  buttonProps={{
                    size: 'sm',
                    iconOnly: true,
                    isActive: isMoreActionsMenuVisible,
                    className: 'project__btn--more-actions',
                    children: <Icon name="more-vertical" />,
                    onClick: this.toggleMoreActionsMenu
                  }}
                >
                  <Menu>
                    <MenuItem className="project__more-actions-item">
                    <Button
                      className="project__more-actions-btn"
                      onClick={this.deleteProject}
                      disabled={ownerId !== currentUser.userId && currentUser.role !== 'admin'}
                    >
                      Delete Project
                    </Button>
                    <Button
                      className="project__more-actions-btn"
                      onClick={this.toggleProjectDuplicator}
                    >
                      Duplicate Project
                    </Button>
                    </MenuItem>
                  </Menu>
                </PopoverWrapper>
            <div className="project__links">
              <NavLink
                className="project__link"
                to={`/0/projects/${projectId}/tasks`}
              >
                Tasks
              </NavLink>
              <NavLink
                className="project__link"
                to={`/0/projects/${projectId}/overview`}
              >
                Overview
              </NavLink>
            </div>
          </div>
        </div>
        {isProjectDuplicatorOpen && (
          <ProjectDuplicator onClose={this.closeProjectDuplicator} projectId={projectId} />
        )}
        <Switch>
          <Route
            path={ROUTES.PROJECT_TASKS}
            render={props => (
              <>
                <Toolbar className="project__toolbar">
                  {layout === 'list' && (
                    <Button
                      className="project__btn project__btn--add-list"
                      onClick={this.activateListComposer}
                      color="primary"
                      variant="contained"
                      size="sm"
                    >
                      Add List
                    </Button>
                  )}
                  <MemberAssigner
                    placeholder="Add or remove member"
                    memberIds={memberIds}
                    onSelectMember={this.handleMemberAssignment}
                    classes={{
                      memberAssigner: 'project__member-assigner',
                      avatar: 'project__avatar',
                      button: 'project__btn--add-member'
                    }}
                    isSelfAssignmentDisabled
                    align='right'
                    showOnlineStatus
                  />
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
                        value: view,
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
                        value: sortBy,
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
                        value: layout,
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
    selectProject: projectId => dispatch(selectProjectAction(projectId)),
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
