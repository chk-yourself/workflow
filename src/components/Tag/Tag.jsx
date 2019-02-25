import React from 'react';
import { Button } from '../Button';
import { Icon } from '../Icon';
import './Tag.scss';

const Tag = ({ text, color, size, onDelete, className, tagRef }) => (
  <span className={`tag tag--${size} bg--${color} ${className}`} ref={tagRef}>
    {text}
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
  className: ''
};

export default Tag;
