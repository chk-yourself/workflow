import React from 'react';

const ProjectGrid = ({ children, className }) => (
  <ul className={`project-grid ${className}`}>{children}</ul>
);

ProjectGrid.defaultProps = {
  className: ''
};

export default ProjectGrid;
