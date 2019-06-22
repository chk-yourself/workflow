import React from 'react';
import PropTypes from 'prop-types';

const Tablist = ({ className, children }) => (
  <ul role="tablist" className={`tablist ${className}`}>
    {children}
  </ul>
);

Tablist.defaultProps = {
  className: ''
};

Tablist.propTypes = {
  className: PropTypes.string
};

export default Tablist;
