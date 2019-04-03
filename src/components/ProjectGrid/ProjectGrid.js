import React from 'react';
import { connect } from 'react-redux';
import ProjectTile from './ProjectTile';
import './ProjectGrid.scss';
import { projectSelectors } from '../../ducks/projects';
import { selectProject as selectProjectAction } from '../../ducks/selectedProject';
import { Icon } from '../Icon';
import { currentUserSelectors } from '../../ducks/currentUser';

const ProjectGrid = ({
  projects,
  selectProject,
  className,
  openProjectComposer
}) => (
  <ul className={`project-grid ${className}`}>
    {projects.map(project => (
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
      onClick={openProjectComposer}
    >
      <span className="project-grid__btn--text">Create project</span>
      <Icon name="plus" />
    </button>
  </ul>
);

ProjectGrid.defaultProps = {
  className: ''
};

const mapStateToProps = (state, ownProps) => {
  return {
    projectsById: projectSelectors.getProjectsById(state),
    projects: projectSelectors.getProjectsArray(state),
    userId: currentUserSelectors.getCurrentUserId(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectProject: projectId => dispatch(selectProjectAction(projectId))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectGrid);
