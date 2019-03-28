import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { withAuthorization } from '../../components/Session';
import * as ROUTES from '../../constants/routes';
import { userActions } from '../../ducks/users';
import { ProjectGridContainer } from '../../components/ProjectGrid';
import { ProjectComposer } from '../../components/ProjectComposer';
import { BoardContainer } from '../../components/Board';
import { projectSelectors } from '../../ducks/projects';
import { currentUserActions } from '../../ducks/currentUser';
import { Main } from '../../components/Main';
import { Dashboard } from '../../components/Dashboard';
import { UserTasks } from '../../components/UserTasks';
import { UserProfile } from '../UserProfile';
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
      fetchUsersById,
      userId,
      firebase,
      syncUserTags
    } = this.props;
    console.log('mounted home');

    await Promise.all([fetchUsersById(), syncUserTags(userId)]).then(listeners => {
      this.unsubscribe = listeners[1];
      this.setState({
        isLoading: false
      })
    });
  }

  toggleProjectComposer = () => {
    this.setState(prevState => ({
      isProjectComposerOpen: !prevState.isProjectComposerOpen
    }));
  };

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const { isProjectComposerOpen, isLoading } = this.state;
    if (isLoading) return null;
    const { userId, projectsById } = this.props;
    return (
      <>
        {isProjectComposerOpen && (
          <ProjectComposer
            onClose={this.toggleProjectComposer}
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
              <Main title="Projects" classes={{title: "project-grid__header"}}>
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
          <Route
            path={ROUTES.USER_PROFILE}
            render={props => <UserProfile userId={props.match.params.id} {...props} />}
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
    fetchUsersById: () => dispatch(userActions.fetchUsersById()),
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
