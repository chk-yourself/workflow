import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Button } from '../Button';
import EditorIcon from './EditorIcon';

const EditorIconButton = ({ size, icon, className, type, isActive, onMouseDown }) => {
  return (
    <Button
      onMouseDown={onMouseDown}
      isActive={isActive}
      value={type}
      className={`rich-text-editor__btn ${className}`}
      size={size}
      ariaLabel={type}
      iconOnly
    >
      <EditorIcon name={icon} />
    </Button>
  );
};

EditorIconButton.defaultProps = {
  size: 'sm',
  className: ''
};

EditorIconButton.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  icon: PropTypes.string.isRequired,
  onMouseDown: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired
};

export default memo(EditorIconButton);
