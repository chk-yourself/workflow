import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { IconButton } from '../Button';
import './Tag.scss';

const Tag = ({
  name,
  color,
  size,
  onDelete,
  className,
  innerRef,
  isFocused,
  variant,
  isLinkDisabled,
  tooltip,
  ...rest
}) => (
  <span
    className={`tag tag--${size} bg--${color} ${variant !== 'default' ? `tag--${variant}` : ''} ${
      isFocused ? 'is-focused' : ''
    } ${className}`}
    ref={innerRef}
    data-tooltip={tooltip || name}
    {...rest}
  >
    {!isLinkDisabled ? (
      <Link to={`/0/tasks?tag=${name}`} className="tag__link">
        <span className="tag__name">{name}</span>
      </Link>
    ) : (
      <span className="tag__link">{name}</span>
    )}
    {size === 'md' && (
      <IconButton
        size="sm"
        className="tag__btn--delete"
        onClick={onDelete}
        icon="x"
        data-name={name}
        label="Remove tag"
      />
    )}
  </span>
);

Tag.defaultProps = {
  className: '',
  onDelete: () => null,
  color: 'default',
  size: 'md',
  variant: 'default',
  isFocused: false,
  isLinkDisabled: false,
  tooltip: ''
};

Tag.propTypes = {
  className: PropTypes.string,
  onDelete: PropTypes.func,
  size: PropTypes.oneOf(['sm', 'md']),
  variant: PropTypes.string,
  isFocused: PropTypes.bool,
  isLinkDisabled: PropTypes.bool,
  tooltip: PropTypes.string
};

export default Tag;
