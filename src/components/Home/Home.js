import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { withAuthorization } from '../Session';
import * as ROUTES from '../../constants/routes';
import { userActions, userSelectors } from '../../ducks/users';
import { currentActions, currentSelectors } from '../../ducks/current';
import { ProjectGridContainer } from '../ProjectGrid';
import { ProjectComposer } from '../ProjectComposer';
import { BoardContainer } from '../Board';
import { projectActions, projectSelectors } from '../../ducks/projects';
import { Icon } from '../Icon';
import { Main } from '../Main';
import { Dashboard } from '../Dashboard';
import { UserTasks } from '../UserTasks';
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
      selectUser,
      fetchUsersById,
      fetchProjectsById,
      userId
    } = this.props;
    selectUser(userId);
    console.log('mounted home');
    fetchUsersById()
      .then(() => fetchProjectsById(userId))
      .then(() =>
        this.setState({
          isFetching: false
        })
      );
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
    currentProjectId: currentSelectors.getCurrentProjectId(state),
    projectsById: projectSelectors.getProjectsById(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchUsersById: () => dispatch(userActions.fetchUsersById()),
    fetchProjectsById: userId =>
      dispatch(projectActions.fetchProjectsById(userId)),
    selectUser: userId => dispatch(currentActions.selectUser(userId))
  };
};

const condition = authUser => !!authUser;

export default withAuthorization(condition)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(HomePage)
);
