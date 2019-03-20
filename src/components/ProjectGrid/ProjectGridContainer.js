import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import ProjectGrid from './ProjectGrid';
import ProjectTile from './ProjectTile';
import './ProjectGrid.scss';
import { withSubscription } from '../withSubscription';
import { projectActions, projectSelectors } from '../../ducks/projects';
import { selectProject as selectProjectAction } from '../../ducks/selectedProject';
import { Icon } from '../Icon';
import { currentUserSelectors } from '../../ducks/currentUser';

class ProjectGridContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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

const mapStateToProps = (state, ownProps) => {
  return {
    projectsById: projectSelectors.getProjectsById(state),
    projectsArray: projectSelectors.getProjectsArray(state),
    userId: currentUserSelectors.getCurrentUserId(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectProject: projectId => dispatch(selectProjectAction(projectId)),
    syncUserProjects: userId =>
      dispatch(projectActions.syncUserProjects(userId)),
    loadProjectsById: projectsById =>
      dispatch(projectActions.loadProjectsById(projectsById)),
    updateProject: ({ projectId, projectData }) =>
      dispatch(projectActions.updateProject({ projectId, projectData })),
    addProject: ({ projectId, projectData }) =>
      dispatch(projectActions.addProject({ projectId, projectData }))
  };
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withSubscription({
    path: () => 'projects',
    query: props => ['memberIds', 'array-contains', props.userId],
    onLoad: props => changes => {
      const projectsById = {};
      changes.forEach(change => {
        projectsById[change.doc.id] = {
          projectId: change.doc.id,
          isLoaded: {
            subtasks: false,
            tasks: false,
            lists: false
          },
          ...change.doc.data()
        };
      });
      props.loadProjectsById(projectsById);
    },
    onModify: props => (projectId, projectData) =>
      props.updateProject({ projectId, projectData }),
    onAdd: props => (projectId, projectData) =>
      props.addProject({ projectId, projectData })
  })
)(ProjectGridContainer);
