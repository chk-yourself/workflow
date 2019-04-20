import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { withAuthorization } from '../../components/Session';
import * as ROUTES from '../../constants/routes';
import { userActions, userSelectors } from '../../ducks/users';
import { ProjectGrid } from '../../components/ProjectGrid';
import { ProjectComposer } from '../../components/ProjectComposer';
import { ProjectContainer } from '../../components/Project';
import { projectActions, projectSelectors } from '../../ducks/projects';
import { taskActions } from '../../ducks/tasks';
import { currentUserActions } from '../../ducks/currentUser';
import { Main } from '../../components/Main';
import { Dashboard } from '../../components/Dashboard';
import { UserTasks } from '../../components/UserTasks';
import { SearchResults, TagSearchResults } from '../../components/Search';
import { Profile } from '../Profile';
import { AccountPage } from '../Account';
import { getParams } from '../../utils/string';
import './Home.scss';

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
    console.log('mounted home');
  }

  componentWillUnmount() {
    if (this.listeners) {
      this.listeners.forEach(unsubscribe => unsubscribe());
    }
    console.log('home unmounted');
  }

  setListeners = async () => {
    const {
      currentUser,
      activeWorkspace,
      syncWorkspaceMembers,
      syncUserWorkspaceData,
      syncUserWorkspaceProjects,
      syncUserWorkspaceTasks,
      syncUserPrivateTasks
    } = this.props;
    const { userId, projectIds } = currentUser;
    const { workspaceId } = activeWorkspace;

    await Promise.all([
      syncWorkspaceMembers(workspaceId),
      syncUserWorkspaceData({ userId, workspaceId }),
      syncUserWorkspaceProjects({ userId, workspaceId }),
      syncUserWorkspaceTasks({ userId, workspaceId }),
      syncUserPrivateTasks({ userId, workspaceId })
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
    const { userId, projectsById } = this.props;
    return (
      <>
        {isProjectComposerOpen && (
          <ProjectComposer onClose={this.toggleProjectComposer} />
        )}
        <Switch>
          <Route
            exact
            path={ROUTES.HOME}
            render={props => (
              <Dashboard
                toggleProjectComposer={this.toggleProjectComposer}
                {...props}
              />
            )}
          />
          <Route
            path={ROUTES.PROJECT}
            render={props => (
              <ProjectContainer
                userId={userId}
                projectId={props.match.params.id}
                {...props}
              />
            )}
          />
          <Route
            path={ROUTES.USER_PROJECTS}
            render={props => (
              <Main
                title="Projects"
                classes={{
                  main: 'project-grid__container',
                  title: 'project-grid__header'
                }}
              >
                <ProjectGrid
                  userId={userId}
                  openProjectComposer={this.toggleProjectComposer}
                  {...props}
                />
              </Main>
            )}
          />
          <Route
            path={ROUTES.USER_TASKS}
            render={props => <UserTasks userId={userId} {...props} />}
          />
          <Route
            path={ROUTES.USER_PROFILE}
            render={props => (
              <Profile userId={props.match.params.id} {...props} />
            )}
          />
          <Route
            path={ROUTES.GLOBAL_SEARCH}
            render={props => {
              const { search } = props.location;
              const params = getParams(search);
              return <SearchResults query={params.q} {...props} />;
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
          <Route path={ROUTES.ACCOUNT} component={AccountPage} />
        </Switch>
      </>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    projectsById: projectSelectors.getProjectsById(state),
    membersById: userSelectors.getUsersById(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    syncWorkspaceMembers: workspaceId =>
      dispatch(userActions.syncWorkspaceMembers(workspaceId)),
    syncUserPresence: () => dispatch(userActions.syncUserPresence()),
    syncUserWorkspaceProjects: ({ userId, workspaceId }) =>
      dispatch(
        projectActions.syncUserWorkspaceProjects({ userId, workspaceId })
      ),
    syncUserWorkspaceTasks: ({ userId, workspaceId }) =>
      dispatch(taskActions.syncUserWorkspaceTasks({ userId, workspaceId })),
    syncUserPrivateTasks: ({ userId, workspaceId }) =>
      dispatch(taskActions.syncUserPrivateTasks({ userId, workspaceId })),
    syncUserWorkspaceData: ({ userId, workspaceId }) =>
      dispatch(
        currentUserActions.syncUserWorkspaceData({ userId, workspaceId })
      )
  };
};

const condition = (currentUser, activeWorkspace) =>
  !!currentUser && !!activeWorkspace;

export default withAuthorization(condition)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(HomePage)
);
