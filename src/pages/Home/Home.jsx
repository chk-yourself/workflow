import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { withAuthorization } from '../../components/Session';
import * as ROUTES from '../../constants/routes';
import { userActions } from '../../ducks/users';
import { ProjectComposer } from '../../components/ProjectComposer';
import { ProjectContainer } from '../../components/Project';
import { projectActions } from '../../ducks/projects';
import { taskActions } from '../../ducks/tasks';
import { currentUserActions } from '../../ducks/currentUser';
import { Dashboard } from '../../components/Dashboard';
import { MyTasks } from '../MyTasks';
import { QuerySearchResults, TagSearchResults } from '../../components/Search';
import { Profile } from '../Profile';
import { EditProfile } from '../EditProfile';
import { Inbox } from '../Inbox';
import { getParams } from '../../utils/string';
import { Projects } from '../Projects';

class HomePage extends Component {
  state = {
    isProjectComposerOpen: false,
    isLoading: true
  };

  componentDidMount() {
    const { firebase, currentUser } = this.props;
    const { initPresenceDetection } = firebase;
    const { userId } = currentUser;
    this.setListeners();
    initPresenceDetection(userId);
  }

  componentWillUnmount() {
    if (this.listeners) {
      this.listeners.forEach(unsubscribe => unsubscribe());
    }
  }

  setListeners = async () => {
    const {
      currentUser,
      activeWorkspace,
      syncWorkspaceMembers,
      syncUserWorkspaceData,
      syncWorkspaceProjects,
      syncPrivateProjects,
      syncUserWorkspaceTasks,
      syncUserPrivateTasks,
      syncNotifications
    } = this.props;
    const { userId } = currentUser;
    const { workspaceId } = activeWorkspace;

    await Promise.all([
      syncWorkspaceMembers(workspaceId),
      syncUserWorkspaceData({ userId, workspaceId }),
      syncWorkspaceProjects(workspaceId),
      syncPrivateProjects({ userId, workspaceId }),
      syncUserWorkspaceTasks({ userId, workspaceId }),
      syncUserPrivateTasks({ userId, workspaceId }),
      syncNotifications({ userId, workspaceId })
    ])
      .then(async listeners => {
        this.listeners = listeners;
        this.setState({
          isLoading: false
        });
      })
      .catch(error => {
        console.error(error);
      });
  };

  toggleProjectComposer = () => {
    this.setState(prevState => ({
      isProjectComposerOpen: !prevState.isProjectComposerOpen
    }));
  };

  render() {
    const { isProjectComposerOpen, isLoading } = this.state;
    if (isLoading) return null;
    return (
      <>
        {isProjectComposerOpen && <ProjectComposer onClose={this.toggleProjectComposer} />}
        <Switch>
          <Route
            exact
            path={ROUTES.HOME}
            render={props => (
              <Dashboard toggleProjectComposer={this.toggleProjectComposer} {...props} />
            )}
          />
          <Route path={ROUTES.INBOX} component={Inbox} />
          <Route
            path={ROUTES.PROJECT}
            render={props => <ProjectContainer projectId={props.match.params.id} {...props} />}
          />
          <Route
            path={ROUTES.PROJECTS}
            render={({ location: { state } }) => (
              <Projects
                openProjectComposer={this.toggleProjectComposer}
                selectedTabIndex={state ? state.selectedTabIndex : 0}
              />
            )}
          />
          <Route path={ROUTES.MY_TASKS} component={MyTasks} />
          <Route
            path={ROUTES.PROFILE}
            render={props => <Profile userId={props.match.params.id} {...props} />}
          />
          <Route
            path={ROUTES.EDIT_PROFILE}
            render={props => <EditProfile userId={props.match.params.id} {...props} />}
          />
          <Route
            path={ROUTES.GLOBAL_SEARCH}
            render={props => {
              const { search } = props.location;
              const params = getParams(search);
              return <QuerySearchResults query={params.q} {...props} />;
            }}
          />
          <Route
            path={ROUTES.TASK_SEARCH}
            render={props => {
              const { search } = props.location;
              const params = getParams(search);
              if (params.tag) {
                return <TagSearchResults tag={params.tag} {...props} />;
              }
            }}
          />
        </Switch>
      </>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    syncWorkspaceMembers: workspaceId => dispatch(userActions.syncWorkspaceMembers(workspaceId)),
    syncUserPresence: () => dispatch(userActions.syncUserPresence()),
    syncPrivateProjects: ({ userId, workspaceId }) =>
      dispatch(projectActions.syncPrivateProjects({ userId, workspaceId })),
    syncWorkspaceProjects: workspaceId =>
      dispatch(projectActions.syncWorkspaceProjects(workspaceId)),
    syncProjectTags: projectId => dispatch(projectActions.syncProjectTags(projectId)),
    syncUserWorkspaceTasks: ({ userId, workspaceId }) =>
      dispatch(taskActions.syncUserWorkspaceTasks({ userId, workspaceId })),
    syncUserPrivateTasks: ({ userId, workspaceId }) =>
      dispatch(taskActions.syncUserPrivateTasks({ userId, workspaceId })),
    syncUserWorkspaceData: ({ userId, workspaceId }) =>
      dispatch(currentUserActions.syncUserWorkspaceData({ userId, workspaceId })),
    syncNotifications: ({ userId, workspaceId }) =>
      dispatch(currentUserActions.syncNotifications({ userId, workspaceId }))
  };
};

const condition = (currentUser, activeWorkspace) => !!currentUser && !!activeWorkspace;

export default withAuthorization(condition)(connect(null, mapDispatchToProps)(HomePage));
