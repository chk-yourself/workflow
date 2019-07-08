import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Switch, Route } from 'react-router-dom';
import { Droppable } from 'react-beautiful-dnd';
import { withFirebase } from '../Firebase';
import { LIST } from '../../constants/droppableTypes';
import { ListComposer } from '../ListComposer';
import { Button } from '../Button';
import { Input } from '../Input';
import { Toolbar } from '../Toolbar';
import { ProjectIcon } from '../ProjectIcon';
import ProjectOverview from './ProjectOverview';
import { MemberAssigner } from '../MemberAssigner';
import ProjectCalendar from './ProjectCalendar';
import ProjectLinks from './ProjectLinks';
import MoreProjectActions from './MoreProjectActions';
import ProjectSettings from './ProjectSettings';
import {
  PROJECT_CALENDAR,
  PROJECT_OVERVIEW,
  PROJECT_TASKS
} from '../../constants/routes';
import { Confirm } from '../Confirm';

class Project extends Component {
  static defaultProps = {
    onDelete: () => {},
    onChangeTempSettings: () => {},
    onDuplicate: () => {}
  };

  static propTypes = {
    name: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    layout: PropTypes.oneOf(['board', 'list']).isRequired,
    isPrivate: PropTypes.bool.isRequired,
    viewFilter: PropTypes.oneOf(['all', 'completed', 'active']).isRequired,
    onDelete: PropTypes.func,
    onDuplicate: PropTypes.func,
    onChangeTempSettings: PropTypes.func,
    memberIds: PropTypes.arrayOf(PropTypes.string),
    listIds: PropTypes.arrayOf(PropTypes.string)
  };

  state = {
    name: this.props.name,
    prevName: this.props.name,
    isListComposerActive: false,
    isProjectSettingsActive: false,
    isNameFocused: false
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

  resetName = () => {
    this.setState({
      name: this.props.name
    });
  };

  onNameChange = e => {
    this.setState({
      name: e.target.value
    });
  };

  onNameBlur = () => {
    const { name: prevName, projectId, firebase } = this.props;
    const { name } = this.state;
    this.setState({
      isNameFocused: false
    });
    if (name === prevName) return;
    if (name === '') {
      this.resetName();
    } else {
      firebase.updateProjectName({ projectId, name });
    }
  };

  activateListComposer = () => {
    this.listComposerInput.focus();
  };

  saveProjectSettings = () => {
    const { firebase, projectId, layout, viewFilter, sortBy } = this.props;
    firebase.updateDoc(['projects', projectId], {
      'settings.layout': layout,
      'settings.tasks.view': viewFilter,
      'settings.tasks.sortBy': sortBy
    });
    this.closeSettingsMenu();
  };

  setTempProjectSettings = e => {
    const { onChangeTempSettings } = this.props;
    const { name, value } = e.target;
    onChangeTempSettings(name, value);
  };

  toggleSettingsMenu = () => {
    this.setState(prevState => ({
      isProjectSettingsActive: !prevState.isProjectSettingsActive
    }));
  };

  closeSettingsMenu = () => {
    this.setState({
      isProjectSettingsActive: false
    });
  };

  handleMembership = (userId, e) => {
    const { firebase, projectId, memberIds, workspaceId } = this.props;

    if (memberIds.includes(userId)) {
      firebase.removeProjectMember({ projectId, userId, workspaceId });
    } else {
      firebase.addProjectMember({ projectId, userId, workspaceId });
    }

    e.preventDefault();
  };

  onFocus = () => {
    this.setState({
      isNameFocused: true
    });
  };

  render() {
    const {
      projectId,
      color,
      children,
      memberIds,
      ownerId,
      currentUser,
      onDelete,
      onDuplicate,
      isPrivate,
      layout,
      viewFilter,
      sortBy,
      match: {
        params: { section }
      }
    } = this.props;

    const {
      name,
      isListComposerActive,
      isProjectSettingsActive,
      isNameFocused
    } = this.state;

    return (
      <Confirm>
        {confirm => (
          <div className={`project project--${layout} project--${section}`}>
            <div className="project__header">
              <div className="project__header-content">
                <div
                  className={`project__name-wrapper ${isNameFocused ? 'is-focused' : ''}`}
                >
                  <ProjectIcon className="project__icon" color={color} layout={layout} />
                  <Input
                    className="project__input--name"
                    name="projectName"
                    type="text"
                    value={name}
                    onChange={this.onNameChange}
                    onFocus={this.onFocus}
                    onBlur={this.onNameBlur}
                    size={!isNameFocused ? name.length : undefined}
                    isRequired
                  />
                  <MoreProjectActions
                    allowDelete={
                      ownerId === currentUser.userId || currentUser.role === 'admin'
                    }
                    onDelete={confirm(onDelete, {
                      label: 'Delete Project',
                      intent: 'danger',
                      title: `Delete "${name}" project?`
                    })}
                    onDuplicate={onDuplicate}
                  />
                </div>
                <ProjectLinks projectId={projectId} activeView={section} />
              </div>
            </div>
            <Switch>
              <Route
                path={PROJECT_TASKS}
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
                        onSelectMember={this.handleMembership}
                        classes={{
                          memberAssigner: 'project__member-assigner',
                          avatar: 'project__avatar',
                          button: 'project__btn--add-member'
                        }}
                        align="right"
                        showOnlineStatus
                        isMemberSearchDisabled={isPrivate}
                      />
                      <ProjectSettings
                        isActive={isProjectSettingsActive}
                        onToggle={this.toggleSettingsMenu}
                        onClose={this.closeSettingsMenu}
                        onSave={this.saveProjectSettings}
                        view={viewFilter}
                        sortBy={sortBy}
                        layout={layout}
                        onChange={this.setTempProjectSettings}
                      />
                    </Toolbar>
                    <Droppable
                      droppableId={projectId}
                      type={LIST}
                      direction={layout === 'board' ? 'horizontal' : 'vertical'}
                    >
                      {provided => (
                        <div className="project__lists" ref={provided.innerRef}>
                          {children}
                          {provided.placeholder}
                          <ListComposer
                            inputRef={this.setInputRef}
                            onToggle={this.toggleListComposer}
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
                path={PROJECT_OVERVIEW}
                render={props => (
                  <ProjectOverview
                    onSelectMember={this.handleMembership}
                    projectId={projectId}
                    {...props}
                  />
                )}
              />
              <Route
                path={PROJECT_CALENDAR}
                render={props => <ProjectCalendar projectId={projectId} {...props} />}
              />
            </Switch>
          </div>
        )}
      </Confirm>
    );
  }
}

export default withRouter(withFirebase(Project));
