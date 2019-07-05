import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { usePortal } from '../../hooks/usePortal';

let idCounter = 0;

const Portal = ({ id, children }) => {
  const target = usePortal(id || `portal-${++idCounter}`);
  return target ? createPortal(children, target) : null;
};

Portal.propTypes = {
  id: PropTypes.string
};

export default Portal;
