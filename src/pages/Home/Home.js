import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { withAuthorization } from '../../components/Session';
import * as ROUTES from '../../constants/routes';
import { userActions } from '../../ducks/users';
import { ProjectGrid } from '../../components/ProjectGrid';
import { ProjectComposer } from '../../components/ProjectComposer';
import { ProjectContainer } from '../../components/Project';
import { projectActions, projectSelectors } from '../../ducks/projects';
import { taskActions } from '../../ducks/tasks';
import { currentUserActions } from '../../ducks/currentUser';
import { Main } from '../../components/Main';
import { Dashboard } from '../../components/Dashboard';
import { UserTasks } from '../../components/UserTasks';
import { UserProfile } from '../UserProfile';
import { SearchResults, TagSearchResults } from '../../components/Search';
import { AccountPage } from '../Account';
import { getParams } from '../../utils/string';
import './Home.scss';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isProjectComposerOpen: false,
      isLoading: true
    };
  }

  async componentDidMount() {
    const {
      syncUsersById,
      currentUser,
      syncUserProjects,
      syncUserProjectTasks,
      syncUserMiscTasks,
      syncUserTags
    } = this.props;
    const { userId, projectIds } = currentUser;
    console.log('mounted home');

    await Promise.all([
      syncUsersById(),
      syncUserProjects(userId),
      syncUserMiscTasks(userId),
      syncUserTags(userId),
      ...projectIds.map(projectId =>
        syncUserProjectTasks({ userId, projectId })
      )
    ]).then(listeners => {
      this.unsubscribe = listeners;
      this.setState({
        isLoading: false
      });
    });
  }

  componentWillUnmount() {
    this.unsubscribe.forEach(func => func());
    console.log('home unmounted');
  }

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
                projectName={projectsById[props.match.params.id].name}
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
              <UserProfile userId={props.match.params.id} {...props} />
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
    projectsById: projectSelectors.getProjectsById(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    syncUsersById: () => dispatch(userActions.syncUsersById()),
    syncUserTags: userId => dispatch(currentUserActions.syncUserTags(userId)),
    syncUserProjects: userId =>
      dispatch(projectActions.syncUserProjects(userId)),
    syncUserProjectTasks: ({ userId, projectId }) =>
      dispatch(taskActions.syncUserProjectTasks({ userId, projectId })),
    syncUserMiscTasks: userId => dispatch(taskActions.syncUserMiscTasks(userId))
  };
};

const condition = currentUser => !!currentUser;

export default withAuthorization(condition)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(HomePage)
);
