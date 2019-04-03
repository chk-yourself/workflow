import React, { Component } from 'react';
import { getDisplayName } from '../../utils/react';

const withOutsideClick = WrappedComponent => {
  class WithOutsideClick extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isTouchEnabled: false
      };
    }

    componentDidMount() {
      document.addEventListener('touchstart', this.handleTouch);
      document.addEventListener('click', this.handleOutsideClick, false);
    }

    componentWillUnmount() {
      const { isTouchEnabled } = this.state;
      if (isTouchEnabled) {
        document.removeEventListener('touchstart', this.handleOutsideClick);
      } else {
        document.removeEventListener('click', this.handleOutsideClick);
        document.removeEventListener('touchstart', this.handleTouch);
      }
    }

    handleTouch = () => {
      this.setState({
        isTouchEnabled: true
      });
      // if touch is detected, listen for touch events instead of click events
      // to improve detection on touch devices
      // remove touch handler to prevent unnecessary refires
      document.removeEventListener('touchstart', this.handleTouch);
      // remove outside click handler from click events
      document.removeEventListener('click', this.handleOutsideClick);
      // reattach outside click handler to touchstart events
      document.addEventListener('touchstart', this.handleOutsideClick);
    };

    setRef = ref => {
      this.component = ref;
    };

    setInstance = ref => {
      this.instance = ref;
    };

    handleOutsideClick = e => {
      if (!this.component) {
        throw new Error('Must set component ref to prop innerRef!');
      }
      if (
        this.component.contains(e.target) ||
        (!this.instance.onOutsideClick && !this.props.onOutsideClick)
      )
        return;
      if (this.instance.onOutsideClick) {
        this.instance.onOutsideClick(e);
      } else {
        const { onOutsideClick } = this.props;
        if (onOutsideClick) {
          onOutsideClick(e);
        }
      }
      e.stopPropagation();
    };

    render() {
      return (
        <WrappedComponent
          ref={this.setInstance}
          innerRef={this.setRef}
          {...this.props}
        />
      );
    }
  }
  WithOutsideClick.displayName = `WithOutsideClick(${getDisplayName(
    WrappedComponent
  )})`;
  return WithOutsideClick;
};

export default withOutsideClick;
