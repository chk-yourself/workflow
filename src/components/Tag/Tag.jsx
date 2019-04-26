import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../Button';
import { Icon } from '../Icon';
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
  ...rest
}) => (
  <span
    className={`tag tag--${size} bg--${color} ${
      variant !== 'default' ? `tag--${variant}` : ''
    } ${isFocused ? 'is-focused' : ''} ${className}`}
    ref={innerRef}
    {...rest}
  >
    {!isLinkDisabled ? (
      <Link to={`/0/tasks?tag=${name}`} className="tag__link">
        {name}
      </Link>
    ) : (
      <span className="tag__link">{name}</span>
    )}
    {size === 'md' && (
      <Button
        type="button"
        size="sm"
        className="tag__btn--delete"
        onClick={onDelete}
        iconOnly
        data-name={name}
      >
        <Icon name="x" />
      </Button>
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
  isLinkDisabled: false
};

export default Tag;
