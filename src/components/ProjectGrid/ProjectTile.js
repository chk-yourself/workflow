import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../Icon';

const ProjectTile = ({ projectId, name, view, onClick, color }) => {
  return (
    <li className={`project-grid__tile project-grid__tile--${color}`}>
      <Link
        className="project-grid__link"
        to={`/0/project/${projectId}`}
        onClick={onClick}
      >
        <span className="project-grid__title">{name}</span>
        <span className="project-grid__icon">
          <Icon name={view === 'board' ? 'trello' : 'list'} />
        </span>
      </Link>
    </li>
  );
};

export default ProjectTile;
