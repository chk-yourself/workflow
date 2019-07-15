import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '../Icon';
import { JamIcon } from '../JamIcon';
import './ProjectIcon.scss';

const icons = {
  board: <Icon name="trello" />,
  list: <JamIcon name="task-list" />
};

const ProjectIcon = ({ className, color, layout, colorOnly, size }) => (
  <span
    className={`project-icon project-icon--${color} ${className}`}
    style={{ width: size, height: size }}
  >
    {!colorOnly && layout && icons[layout]}
  </span>
);

ProjectIcon.defaultProps = {
  className: '',
  color: 'default',
  colorOnly: false,
  layout: null,
  size: null
};

ProjectIcon.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  colorOnly: PropTypes.bool,
  layout: PropTypes.oneOf([null, 'board', 'list']),
  size: PropTypes.oneOfType([() => null, PropTypes.number, PropTypes.string])
};

export default memo(ProjectIcon);
