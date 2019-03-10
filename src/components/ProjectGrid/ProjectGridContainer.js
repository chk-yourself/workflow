import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ProjectGrid, ProjectTile } from './ProjectGrid';
import './ProjectGrid.scss';
import { withAuthorization } from '../Session';
import { projectActions, projectSelectors } from '../../ducks/projects';
import { selectProject as selectProjectAction } from '../../ducks/selectedProject';
import { Icon } from '../Icon';

class ProjectGridContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { userId, firebase, updateProject } = this.props;
    this.projectObserver = firebase.db
      .collection('projects')
      .where('memberIds', 'array-contains', userId)
      .onSnapshot(querySnapshot => {
        querySnapshot.docChanges().forEach(change => {
          const projectId = change.doc.id;
          const projectData = change.doc.data();
          updateProject(projectId, projectData);
        });
      });
  }

  componentWillUnmount() {
    this.projectObserver();
  }

  render() {
    const { projectsArray, selectProject } = this.props;
    const projectTiles = projectsArray.map(project => {
      const { name: projectName, projectId } = project;
      return (
        <ProjectTile
          key={projectId}
          projectName={projectName}
          projectId={projectId}
          onClick={() => selectProject(projectId)}
        />
      );
    });
    return (
      <ProjectGrid>
        {projectTiles}
        <button
          type="button"
          className="project-grid__tile project-grid__btn--add"
          onClick={this.props.openProjectComposer}
        >
          <Icon name="plus-circle" />
          Create project
        </button>
      </ProjectGrid>
    );
  }
}

const condition = authUser => !!authUser;

const mapStateToProps = (state, ownProps) => {
  return {
    projectsById: projectSelectors.getProjectsById(state),
    projectsArray: projectSelectors.getProjectsArray(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchProjectsById: userId =>
      dispatch(projectActions.fetchProjectsById(userId)),
    updateProject: (projectId, projectData) =>
      dispatch(projectActions.updateProject(projectId, projectData)),
    selectProject: projectId => dispatch(selectProjectAction(projectId))
  };
};

export default withAuthorization(condition)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ProjectGridContainer)
);
