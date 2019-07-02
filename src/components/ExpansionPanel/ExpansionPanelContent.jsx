import React from 'react';
import PropTypes from 'prop-types';

const ExpansionPanelContent = ({ className, children }) => {
  return <div className={className}>{children}</div>;
};

ExpansionPanelContent.defaultProps = {
  className: '',
  children: null
};

ExpansionPanelContent.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
};

export default ExpansionPanelContent;
