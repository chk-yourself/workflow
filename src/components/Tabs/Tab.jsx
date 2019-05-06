import React from 'react';

const Tab = ({
  className,
  id,
  panelId,
  isActive,
  children,
  index,
  onSelectTab,
  variant
}) => (
  <li
    onClick={onSelectTab}
    onKeyDown={onSelectTab}
    id={id}
    role="tab"
    tabIndex={0}
    aria-selected={isActive}
    aria-controls={panelId}
    className={`tab tab--${variant} ${className} ${
      isActive ? 'is-active' : ''
    }`}
    data-index={index}
  >
    {children}
  </li>
);

Tab.defaultProps = {
  className: '',
  variant: 'underlined'
};

export default Tab;
