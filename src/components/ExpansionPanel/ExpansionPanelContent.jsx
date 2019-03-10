import React from 'react';

const ExpansionPanelContent = ({ className, children }) => {
  return <div className={className}>{children}</div>;
};

ExpansionPanelContent.defaultProps = {
  className: ''
};

export default ExpansionPanelContent;
