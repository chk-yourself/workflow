import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { projectSelectors } from '../../ducks/projects';
import './ProjectBadge.scss';
import { Badge } from '../Badge';
import { ProjectIcon } from '../ProjectIcon';

const ProjectBadge = ({ projectId, name, color }) => (
  <Link to={`/0/project/${projectId}`} className="project-badge">
    <ProjectIcon color={color} className="project-badge__icon" />
    {name}
  </Link>
);

const mapStateToProps = (state, ownProps) => {
  return {
    color: projectSelectors.getProjectColor(state, ownProps.projectId),
    name: projectSelectors.getProjectName(state, ownProps.projectId)
  };
};

export default connect(mapStateToProps)(ProjectBadge);
