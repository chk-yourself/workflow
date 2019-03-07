import React from 'react';
import './ProjectIcon.scss';

const ProjectIcon = ({className, color}) => (
  <span className={`project-icon bg--${color} ${className}`} />
);

ProjectIcon.defaultProps = {
  className: '',
  color: 'default'
};

export default ProjectIcon;