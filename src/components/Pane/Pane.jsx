import React from 'react';
import PropTypes from 'prop-types';
import { isFunction } from '../../utils/validate';

const Pane = ({ children, innerRef, is, ...props }) => {
  const functions = {};
  const styleProps = {};
  if (
    Object.keys(props).forEach(key => {
      if (isFunction(props[key])) {
        functions[key] = props[key];
      } else {
        styleProps[key] = props[key];
      }
    })
  );
  return React.createElement(
    is,
    {
      ref: innerRef,
      style: {
        ...styleProps
      },
      ...functions
    },
    children
  );
};

Pane.defaultProps = {
  is: 'div',
  innerRef: () => null
};

Pane.propTypes = {
  innerRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
  is: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
};

export default Pane;
