import React, { memo } from 'react';
import { NavLink } from 'react-router-dom';

const ProjectLinks = ({ projectId, activeView }) => {
  return (
    <div className="project__links">
      <NavLink className="project__link" to={`/0/projects/${projectId}/tasks`}>
        Tasks
      </NavLink>
      <NavLink className="project__link" to={`/0/projects/${projectId}/overview`}>
        Overview
      </NavLink>
      <NavLink className="project__link" to={`/0/projects/${projectId}/calendar`}>
        Calendar
      </NavLink>
    </div>
  );
};

export default memo(ProjectLinks);
