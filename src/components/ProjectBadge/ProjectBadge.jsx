import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { projectSelectors } from '../../ducks/projects';
import './ProjectBadge.scss';
import { ProjectIcon } from '../ProjectIcon';

const ProjectBadge = memo(({ projectId, size, variant, name, color, classes }) => (
  <Link
    to={`/0/projects/${projectId}/tasks`}
    className={`project-badge project-badge--${size} ${
      variant === 'contained' ? `project-badge--contained project-badge--${color}` : ''
    } ${classes.badge || ''}`}
  >
    {variant === 'icon' && (
      <ProjectIcon
        colorOnly
        color={color}
        className={`project-badge__icon ${classes.icon || ''}`}
      />
    )}
    <span className="project-badge__name">{name}</span>
  </Link>
));

ProjectBadge.defaultProps = {
  classes: {
    badge: '',
    icon: ''
  },
  variant: 'icon',
  size: 'md'
};

ProjectBadge.propTypes = {
  classes: PropTypes.shape({
    badge: PropTypes.string,
    icon: PropTypes.string
  }),
  variant: PropTypes.string,
  size: PropTypes.oneOf(['md', 'sm'])
};

const mapStateToProps = (state, ownProps) => {
  return {
    color: projectSelectors.getProjectColor(state, ownProps.projectId),
    name: projectSelectors.getProjectName(state, ownProps.projectId)
  };
};

export default connect(mapStateToProps)(ProjectBadge);
