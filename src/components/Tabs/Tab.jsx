import React from 'react';
import PropTypes from 'prop-types';

const Tab = ({ className, id, panelId, isSelected, children, index, onSelect, variant }) => (
  <li
    onClick={onSelect}
    onKeyDown={onSelect}
    id={id}
    role="tab"
    tabIndex={0}
    aria-selected={isSelected}
    aria-controls={panelId}
    className={`tab tab--${variant} ${className} ${isSelected ? 'is-selected' : ''}`}
    data-index={index}
  >
    {children}
  </li>
);

Tab.defaultProps = {
  className: '',
  variant: 'underlined',
  onSelect: () => {}
};

Tab.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(['outlined', 'underlined']),
  isSelected: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  onSelect: PropTypes.func
};

export default Tab;
