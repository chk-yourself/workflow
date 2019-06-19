import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withOutsideClick } from '../withOutsideClick';

class PopoverContent extends Component {
  static defaultProps = {
    className: '',
    style: {}
  };

  static propTypes = {
    innerRef: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({ current: PropTypes.instanceOf(Element) })
    ]).isRequired,
    className: PropTypes.string,
    style: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
  };

  render() {
    const { className, onClick, style, children, isVisible, innerRef } = this.props;
    return (
      <div
        className={`popover ${className}`}
        onClick={onClick}
        style={{ ...style, display: isVisible ? 'block' : 'none' }}
        ref={innerRef}
      >
        {children}
      </div>
    );
  }
}

export default withOutsideClick(PopoverContent);
