import React from 'react';
import { connect } from 'react-redux';
import { projectSelectors } from '../../ducks/projects';
import './ProjectBadge.scss';
import { Badge } from '../Badge';

const ProjectBadge = ({ name, color }) => (
  <Badge className={`project-badge project-badge--${color}`}>{name}</Badge>
);

const mapStateToProps = (state, ownProps) => {
  return {
    color: projectSelectors.getProjectColor(state, ownProps.projectId),
    name: projectSelectors.getProjectName(state, ownProps.projectId)
  };
};

export default connect(mapStateToProps)(ProjectBadge);
