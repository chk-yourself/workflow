import React from 'react';

const ExpansionPanelHeader = ({ children, className, onClick }) => {
  return (
    <header
      className={`expansion-panel__header ${className}`}
      role="button"
      onClick={onClick}
      tabIndex={0}
      onKeyDown={onClick}
      onDragOver={onClick}
    >
      {children}
    </header>
  );
};

ExpansionPanelHeader.defaultProps = {
  className: ''
};

export default ExpansionPanelHeader;
