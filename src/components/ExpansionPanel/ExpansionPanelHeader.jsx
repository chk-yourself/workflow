import React from 'react';

const ExpansionPanelHeader = ({ children, className, onClick }) => {
  return (
      <header
        className={`expansion-panel__header ${className}`}
        role="button"
        onClick={onClick}
        tabIndex={0}
      >
        {children}
      </header>
  );
};

ExpansionPanelHeader.defaultProps = {
  className: ''
};

export default ExpansionPanelHeader;
