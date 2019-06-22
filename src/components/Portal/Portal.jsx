import React from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { usePortal } from '../../hooks/usePortal';

const Portal = ({ id, children }) => {
  const target = usePortal(id);
  return createPortal(children, target);
};

Portal.propTypes = {
  id: PropTypes.string.isRequired
};

export default Portal;
