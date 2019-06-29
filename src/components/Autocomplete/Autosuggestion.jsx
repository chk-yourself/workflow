import React from 'react';
import PropTypes from 'prop-types';
import { MenuItem } from '../Menu';

const Autosuggestion = ({
  onSelect,
  index,
  value,
  item,
  renderItem,
  isSelected,
  className
}) => {
  return (
    <MenuItem
      data-autosuggest-index={index}
      data-autosuggest-value={value}
      onClick={onSelect}
      onKeyDown={onSelect}
      tabIndex={0}
      className={`${className} ${isSelected ? 'is-selected' : ''}`}
    >
      {renderItem(item)}
    </MenuItem>
  );
};

Autosuggestion.defaultProps = {
  className: '',
  renderMatch: () => {}
};

Autosuggestion.propTypes = {
  className: PropTypes.string,
  index: PropTypes.number.isRequired,
  selectedIndex: PropTypes.oneOfType([() => null, PropTypes.number]).isRequired,
  renderMatch: PropTypes.func
};

export default Autosuggestion;
