import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../Icon';

const ProjectTile = ({ projectId, name, layout, onClick, color }) => {
  return (
    <li className={`project-grid__tile project-grid__tile--${color}`}>
      <Link
        className="project-grid__link"
        to={`/0/projects/${projectId}/tasks`}
        onClick={onClick}
      >
        <span className="project-grid__title">{name}</span>
        <span className="project-grid__icon">
          <Icon name={layout === 'board' ? 'trello' : 'list'} />
        </span>
      </Link>
    </li>
  );
};

export default ProjectTile;
