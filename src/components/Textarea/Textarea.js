import React, { Component } from 'react';
import './Textarea.scss';
import { debounce } from '../../utils/function';

export default class Textarea extends Component {
  static defaultProps = {
    isAutoHeightResizeEnabled: true,
    minHeight: 0,
    tabIndex: 0,
    onMouseDown: () => null,
    onMouseUp: () => null,
    onMouseMove: () => null
  };

  componentDidMount() {
    const { isAutoHeightResizeEnabled } = this.props;
    if (!isAutoHeightResizeEnabled) return;
    this.autoHeightResize();
    this.handleResize = debounce(200, this.autoHeightResize);
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  ref = el => {
    this.el = el;
    const { innerRef } = this.props;
    if (innerRef) {
      innerRef(el);
    }
  };

  autoHeightResize = () => {
    const { isAutoHeightResizeEnabled, minHeight } = this.props;
    if (!isAutoHeightResizeEnabled) return;

    this.el.style.height = `${minHeight}px`; // resets scroll height
    this.el.style.height = `${this.el.scrollHeight}px`;
  };

  render() {
    const {
      className,
      name,
      value,
      onChange,
      placeholder,
      isRequired,
      onBlur,
      onFocus,
      onKeyDown,
      onDragStart,
      isReadOnly,
      onMouseDown,
      onMouseUp,
      onMouseMove,
      tabIndex
    } = this.props;

    return (
      <textarea
        className={`textarea ${className}`}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={isRequired}
        onBlur={onBlur}
        onInput={this.autoHeightResize}
        ref={this.ref}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        onDragStart={onDragStart}
        readOnly={isReadOnly}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        tabIndex={tabIndex}
      />
    );
  }
}
