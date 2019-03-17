import React from 'react';
import './ProjectIcon.scss';

const ProjectIcon = ({ className, color }) => (
  <span className={`project-icon project-icon--${color} ${className}`} />
);

ProjectIcon.defaultProps = {
  className: '',
  color: 'default'
};

export default ProjectIcon;
