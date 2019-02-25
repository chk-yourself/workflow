import React, { Component, forwardRef } from 'react';

const withOutsideClick = WrappedComponent => {
  class WithOutsideClick extends Component {
    static defaultProps = {
      onOutsideClick: () => null
    };

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

    handleOutsideClick = e => {
      const { onOutsideClick } = this.props;
      console.log(this.props.forwardedRef.current);
      /*
      if (!this.ref) {
        throw new Error(`No ref for component ${WrappedComponent.name}.`);
      }
      if (this.forwardedRef.contains(e.target)) return;
      */
      onOutsideClick(e);
    };

    render() {
      const { forwardedRef, ...rest } = this.props;
      console.log(forwardedRef);
      return (
        <WrappedComponent
          ref={forwardedRef}
          {...rest}
          onOutsideClick={this.handleOutsideClick}
        />
      );
    }
  }

  return forwardRef((props, ref) => {
    console.log(ref.current);
    return <WithOutsideClick {...props} forwardedRef={ref} />;
  });
};

export default withOutsideClick;
