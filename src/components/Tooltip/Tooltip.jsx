import React, { Component, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { Positioner } from '../Positioner';
import * as Position from '../../constants/positions';
import TooltipView from './TooltipView';

export default class Tooltip extends Component {
  static propTypes = {
    position: PropTypes.oneOf([
      Position.TOP,
      Position.TOP_LEFT,
      Position.TOP_RIGHT,
      Position.BOTTOM,
      Position.BOTTOM_LEFT,
      Position.BOTTOM_RIGHT,
      Position.LEFT,
      Position.RIGHT
    ]),
    isVisible: PropTypes.bool,
    children: PropTypes.node.isRequired,
    hasArrow: PropTypes.bool
  };

  static defaultProps = {
    position: Position.BOTTOM,
    isVisible: false,
    hasArrow: false
  };

  state = {
    isVisible: this.props.isVisible
  };

  renderTarget = ({ getRef }) => {
    const { children } = this.props;
    const targetProps = {
      onMouseEnter: this.show,
      onMouseLeave: this.hide,
      onMouseDown: this.toggle
    };
    return cloneElement(children, {
      ...targetProps,
      innerRef: ref => {
        getRef(ref);
      }
    });
  };

  hide = () => {
    if (!this.state.isVisible) return;
    this.setState({
      isVisible: false
    });
  };

  show = () => {
    if (this.state.isVisible) return;
    this.timer = setTimeout(() => {
      this.setState({
        isVisible: true
      });
    });
  };

  toggle = () => {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.setState(prevState => ({
      isVisible: !prevState.isVisible
    }));
  };

  render() {
    const { position, content, portalId, hasArrow } = this.props;
    const { isVisible } = this.state;
    return (
      <Positioner
        target={({ getRef }) => {
          return this.renderTarget({ getRef });
        }}
        position={position}
        isVisible={isVisible}
        portalId={portalId}
      >
        {({ style, position: finalPosition, getRef }) => (
          <TooltipView
            style={style}
            innerRef={getRef}
            hasArrow={hasArrow}
            position={finalPosition}
          >
            {content}
          </TooltipView>
        )}
      </Positioner>
    );
  }
}
