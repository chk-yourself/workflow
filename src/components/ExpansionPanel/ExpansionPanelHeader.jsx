import React from 'react';

const ExpansionPanelHeader = ({ children, className, onClick }) => {
  return (
    <div
      className={`expansion-panel__header ${className}`}
      role="button"
      onClick={onClick}
      tabIndex={0}
      onKeyDown={onClick}
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
