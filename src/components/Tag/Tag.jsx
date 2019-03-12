import React from 'react';
import { Button } from '../Button';
import { Icon } from '../Icon';
import './Tag.scss';

const Tag = ({ name, color, size, onDelete, className, tagRef, variant }) => (
  <span
    className={`tag tag--${size} bg--${color} ${
      variant !== 'default' ? `tag--${variant}` : ''
    } ${className}`}
    ref={tagRef}
  >
    {name}
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
