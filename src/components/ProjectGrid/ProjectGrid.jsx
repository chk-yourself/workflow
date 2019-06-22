import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ProjectTile from './ProjectTile';
import './ProjectGrid.scss';
import { projectSelectors } from '../../ducks/projects';
import { selectProject as selectProjectAction } from '../../ducks/selectedProject';
import { Icon } from '../Icon';

const ProjectGrid = ({ projects, selectProject, className, openProjectComposer }) => (
  <ul className={`project-grid ${className}`}>
    {projects.map(project => (
      <ProjectTile
        key={project.projectId}
        layout={project.settings.layout}
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
  className: '',
  selectProject: () => {},
  projects: []
};

ProjectGrid.propTypes = {
  className: PropTypes.string,
  selectProject: PropTypes.func,
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      projectId: PropTypes.string,
      name: PropTypes.string,
      color: PropTypes.string,
      settings: PropTypes.shape({
        layout: PropTypes.oneOf(['list', 'board'])
      })
    })
  )
};

const mapStateToProps = (state, ownProps) => {
  return {
    projects: projectSelectors.getProjectsArray(state, ownProps.userId)
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
