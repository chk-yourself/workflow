import React from 'react';

const ExpansionPanelHeader = ({ children, className, onClick, onKeyDown }) => {
  return (
    <div
      className={`expansion-panel__header ${className}`}
      role="button"
      onClick={onClick}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onDragOver={onClick}
    >
      {children}
    </div>
  );
};

ExpansionPanelHeader.defaultProps = {
  className: ''
};

export default ExpansionPanelHeader;
