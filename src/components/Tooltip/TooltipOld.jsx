import React, { Component } from 'react';
import './Tooltip.scss';

class Tooltip extends Component {
  static defaultProps = {
    classes: {
      tooltip: '',
      arrow: ''
    },
    text: '',
    alignY: 'bottom',
    alignX: 'center',
    arrow: 'show',
    arrowLength: 10,
    axis: 'y'
  };

  state = {
    width: 0,
    height: 0,
    arrowLength: this.props.arrow === 'show' ? this.props.arrowLength : 0
  };

  componentDidUpdate(prevProps) {
    const { anchorEl, arrow, arrowLength } = this.props;
    if (anchorEl !== prevProps.anchorEl) {
      const { width, height } = window.getComputedStyle(this.tooltip);
      const isArrowVisible = arrow === 'show';
      this.setState({
        width: anchorEl ? parseFloat(width) : 0,
        height: anchorEl ? parseFloat(height) : 0,
        arrowLength: isArrowVisible ? arrowLength : 0
      });
    }
  }

  setTooltipRef = el => {
    this.tooltip = el;
  };

  getPosition = () => {
    const { anchorEl, alignX, alignY, axis } = this.props;
    if (!this.tooltip || !anchorEl) {
      return {
        tooltip: null,
        arrow: {
          align: '',
          position: null
        }
      };
    }
    const borderRadius = window.getComputedStyle(this.tooltip)['border-radius'];
    const { height, width, arrowLength } = this.state;
    const {
      top: anchorTop,
      bottom: anchorBottom,
      left: anchorLeft,
      right: anchorRight,
      height: anchorHeight,
      width: anchorWidth
    } = anchorEl.getBoundingClientRect();
    const viewportWidth =
      window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;
    const tooltip = {};
    let arrowAlign = '';
    const arrowPosition = {};
    if (axis === 'y') {
      switch (alignY) {
        case 'top': {
          const positionTop = anchorTop - height - arrowLength;
          const isVisible = positionTop >= 0;
          tooltip.top = isVisible ? positionTop : anchorBottom + arrowLength;
          arrowAlign = isVisible ? 'bottom' : 'top';
          arrowPosition.top = isVisible ? '100%' : `-${arrowLength}px`;
          break;
        }
        case 'bottom': {
          const positionBottom = anchorBottom + height + arrowLength;
          const isVisible = positionBottom <= viewportHeight;
          tooltip.top = isVisible
            ? anchorBottom + arrowLength
            : anchorTop - height - arrowLength;
          arrowAlign = isVisible ? 'top' : 'bottom';
          arrowPosition.top = isVisible ? `-${arrowLength}px` : '100%';
          break;
        }
        default: {
          const centerY = anchorTop - height / 2;
          if (centerY >= 0) {
            tooltip.top = centerY;
            arrowPosition.top = `calc(50% - ${arrowLength}px)`;
          } else {
            tooltip.top = anchorTop;
            arrowPosition.top = anchorHeight - arrowLength / 2;
          }
        }
      }
      switch (alignX) {
        case 'left': {
          tooltip.left = anchorLeft;
          arrowPosition.left = anchorWidth / 2 - arrowLength;
          break;
        }
        case 'right': {
          tooltip.left = anchorLeft - width + arrowLength;
          arrowPosition.left = `calc(100% - ${anchorWidth / 2 +
            arrowLength}px)`;
          break;
        }
        default: {
          const centerX = anchorLeft - width / 2;
          if (centerX >= 0 && centerX <= viewportWidth) {
            tooltip.left = centerX;
            arrowPosition.left = `calc(50% - ${arrowLength / 2}px)`;
          } else if (anchorLeft + width <= viewportWidth) {
            tooltip.left = anchorLeft;
            arrowPosition.left = anchorWidth / 2 - arrowLength / 2;
          } else {
            tooltip.right = anchorRight;
            arrowPosition.right = anchorWidth / 2 - arrowLength / 2;
          }
        }
      }
      return {
        tooltip,
        arrow: {
          align: arrowAlign,
          position: arrowPosition
        }
      };
    }

    if (axis === 'x') {
      switch (alignY) {
        case 'top': {
          tooltip.top = anchorTop;
          arrowPosition.top = anchorHeight / 2 - arrowLength / 2;
          break;
        }
        case 'bottom': {
          tooltip.bottom = anchorBottom;
          arrowPosition.bottom = anchorHeight / 2 - arrowLength / 2;
          break;
        }
        default: {
          const centerY = anchorTop - height / 2;
          if (centerY >= 0) {
            tooltip.top = centerY;
            arrowPosition.top = `calc(50% - ${arrowLength}px)`;
          } else {
            tooltip.top = anchorTop;
            arrowPosition.top = anchorHeight / 2 + arrowLength / 2;
          }
        }
      }
      switch (alignX) {
        case 'left': {
          const positionX = anchorLeft - width - arrowLength;
          if (positionX >= 0) {
            tooltip.left = positionX;
            arrowAlign = 'right';
            arrowPosition.left = '100%';
          } else {
            tooltip.left = anchorRight;
            arrowAlign = 'left';
            arrowPosition.left = `-${anchorWidth}px`;
          }
          break;
        }
        case 'right': {
          const positionX = anchorRight + width + arrowLength;
          if (positionX <= viewportWidth) {
            tooltip.left = anchorRight + arrowLength;
            arrowAlign = 'left';
            arrowPosition.left = `-${anchorWidth}px`;
          } else {
            tooltip.left = anchorLeft - width - arrowLength;
            arrowAlign = 'right';
            arrowPosition.left = '100%';
          }
          break;
        }
        default: {
          const centerX = anchorLeft - width / 2;
          if (centerX >= 0 && centerX <= viewportWidth) {
            tooltip.left = centerX;
            arrowPosition.left = `calc(50% - ${arrowLength}px)`;
          } else if (anchorLeft + width <= viewportWidth) {
            tooltip.left = anchorLeft;
            arrowPosition.left = anchorWidth / 2 - arrowLength / 2;
          } else {
            tooltip.left = anchorRight;
            arrowPosition.right = arrowLength;
          }
        }
      }
      return {
        tooltip,
        arrow: {
          align: arrowAlign,
          position: arrowPosition
        }
      };
    }
  };

  render() {
    const { anchorEl, classes, text, arrowLength } = this.props;
    const isArrowVisible = this.props.arrow === 'show';
    const position = this.getPosition();
    const { tooltip, arrow } = position;
    return (
      <div
        ref={this.setTooltipRef}
        style={{ ...tooltip, display: !anchorEl ? 'none' : 'block' }}
        className={`tooltip ${classes.tooltip || ''}`}
      >
        <div
          className={`tooltip__arrow tooltip__arrow--${
            arrow.align
          } ${classes.arrow || ''}`}
          style={
            isArrowVisible
              ? {
                  ...arrow.position,
                  borderWidth: `${arrowLength}px`
                }
              : { display: 'none' }
          }
        />
        {text}
      </div>
    );
  }
}

export default Tooltip;
