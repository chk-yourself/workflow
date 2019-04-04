import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../Button';
import { Icon } from '../Icon';
import './Tag.scss';

const Tag = ({ name, color, size, onDelete, className, innerRef, variant }) => (
  <span
    className={`tag tag--${size} bg--${color} ${
      variant !== 'default' ? `tag--${variant}` : ''
    } ${className}`}
    ref={innerRef}
  >
    <Link to={`/0/tasks?tag=${name}`} className="tag__link">
      {name}
    </Link>
    {size === 'md' && (
      <Button
        type="button"
        size="sm"
        className="tag__btn--delete"
        onClick={onDelete}
        iconOnly
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
  variant: 'default'
};

export default Tag;
