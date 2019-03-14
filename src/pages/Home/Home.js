import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { withAuthorization } from '../../components/Session';
import * as ROUTES from '../../constants/routes';
import { userActions } from '../../ducks/users';
import { ProjectGridContainer } from '../../components/ProjectGrid';
import { ProjectComposer } from '../../components/ProjectComposer';
import { BoardContainer } from '../../components/Board';
import { projectActions, projectSelectors } from '../../ducks/projects';
import { currentUserActions } from '../../ducks/currentUser';
import { Main } from '../../components/Main';
import { Dashboard } from '../../components/Dashboard';
import { UserTasks } from '../../components/UserTasks';
import './Home.scss';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isProjectComposerOpen: false,
      isFetching: true
    };
  }

  componentDidMount() {
    const {
      fetchUsersById,
      updateUser,
      userId,
      firebase,
      fetchUserTags,
      syncUserTags
    } = this.props;
    console.log('mounted home');
    fetchUsersById()
      .then(() => {
        fetchUserTags(userId).then(() => {
          this.tagsObserver = () => syncUserTags(userId);
          this.tagsObserver();
        });
      })
      .then(() =>
        this.setState({
          isFetching: false
        })
      );
    this.userObserver = firebase.getUserDoc(userId).onSnapshot(snapshot => {
      const userData = snapshot.data();
      updateUser({ userId, userData });
    });
  }

  toggleProjectComposer = () => {
    this.setState(prevState => ({
      isProjectComposerOpen: !prevState.isProjectComposerOpen
    }));
  };

  createProject = name => {
    const { userId, firebase } = this.props;
    firebase.addProject({ userId, name });
  };

  componentWillUnmount() {
    this.userObserver();
    this.tagsObserver();
  }

  render() {
    const { isProjectComposerOpen, isFetching } = this.state;
    if (isFetching) return null;
    const { userId, projectsById } = this.props;
    return (
      <>
        {isProjectComposerOpen && (
          <ProjectComposer
            onClose={this.toggleProjectComposer}
            handleSubmit={this.createProject}
          />
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
              <BoardContainer
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
              <Main title="Projects">
                <ProjectGridContainer
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
    updateUser: ({ userId, userData }) =>
      dispatch(userActions.updateUser({ userId, userData })),
    fetchUsersById: () => dispatch(userActions.fetchUsersById()),
    fetchProjectsById: userId =>
      dispatch(projectActions.fetchProjectsById(userId)),
    fetchUserTags: userId => dispatch(currentUserActions.fetchUserTags(userId)),
    syncUserTags: userId => dispatch(currentUserActions.syncUserTags(userId))
  };
};

const condition = authUser => !!authUser;

export default withAuthorization(condition)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(HomePage)
);
