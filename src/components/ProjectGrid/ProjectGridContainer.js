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
  static defaultProps = {
    className: ''
  };

  render() {
    const { projectsArray, selectProject, className } = this.props;
    return (
      <ProjectGrid className={className}>
        {projectsArray.map(project => (
        <ProjectTile
          key={project.projectId}
          layout={project.layout}
          name={project.name}
          color={project.color}
          projectId={project.projectId}
          onClick={() => selectProject(project.projectId)}
        />
      ))}
        <button
          type="button"
          className="project-grid__tile project-grid__btn--add"
          onClick={this.props.openProjectComposer}
        >
        <span className="project-grid__btn--text">Create project</span>
          <Icon name="plus" />
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
        const projectId = change.doc.id;
        const projectData = change.doc.data();
        projectsById[projectId] = {
          projectId,
          isLoaded: {
            subtasks: false,
            tasks: false,
            lists: false
          },
          tempSettings: {
            tasks: {...projectData.settings.tasks}
          },
          ...projectData
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
