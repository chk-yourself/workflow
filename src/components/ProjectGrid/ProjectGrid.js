import React from 'react';
import { Link } from 'react-router-dom';

const ProjectTile = ({ projectId, projectName, onClick }) => {
  return (
    <li className="project-grid__tile">
      <Link
        className="project-grid__link"
        to={`/0/project/${projectId}`}
        onClick={onClick}
      >
        <span className="project-grid__title">{projectName}</span>
      </Link>
    </li>
  );
};

const ProjectGrid = ({ children }) => <ul className="project-grid">{children}</ul>;

export { ProjectTile, ProjectGrid };
