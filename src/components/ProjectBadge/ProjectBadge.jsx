import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { projectSelectors } from '../../ducks/projects';
import './ProjectBadge.scss';
import { ProjectIcon } from '../ProjectIcon';

const ProjectBadge = ({ projectId, size, variant, name, color, classes }) => (
  <Link
    to={`/0/projects/${projectId}`}
    className={`project-badge project-badge--${size} ${
      variant === 'contained'
        ? `project-badge--contained project-badge--${color}`
        : ''
    } ${classes.badge || ''}`}
  >
    {variant === 'icon' && (
      <ProjectIcon
        color={color}
        className={`project-badge__icon ${classes.icon || ''}`}
      />
    )}
    <span className="project-badge__name">{name}</span>
  </Link>
);

ProjectBadge.defaultProps = {
  classes: {
    badge: '',
    icon: ''
  },
  variant: 'icon',
  size: 'md'
};

const mapStateToProps = (state, ownProps) => {
  return {
    color: projectSelectors.getProjectColor(state, ownProps.projectId),
    name: projectSelectors.getProjectName(state, ownProps.projectId)
  };
};

export default connect(mapStateToProps)(ProjectBadge);
