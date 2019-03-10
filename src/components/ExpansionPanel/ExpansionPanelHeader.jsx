import React from 'react';

const ExpansionPanelHeader = ({ children, className, onClick }) => {
  return (
    <div>
      <div
        className={`expansion-panel__header ${className}`}
        role="button"
        onClick={onClick}
        tabIndex={0}
      >
        {children}
      </div>
    </div>
  );
};

ExpansionPanelHeader.defaultProps = {
  className: ''
};

export default ExpansionPanelHeader;
