import React, { Component, createRef } from 'react';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

const withOutsideClick = WrappedComponent => {
  class WithOutsideClick extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isTouchEnabled: false
      };
      this.componentInstance = createRef();
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

    handleOutsideClick = e => {
      if (!this.componentEl) {
        throw new Error('Must set component ref to prop innerRef!');
      }
      console.log(this.componentEl.contains(e.target));
      if (
        this.componentEl.contains(e.target) ||
        (!this.componentInstance.current.onOutsideClick &&
          !this.props.onOutsideClick)
      )
        return;
        if (this.componentInstance.current.onOutsideClick) {
          this.componentInstance.current.onOutsideClick(e);
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
          ref={this.componentInstance}
          innerRef={el => (this.componentEl = el)}
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
