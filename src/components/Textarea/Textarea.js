import React, { Component, createRef } from 'react';
import './Textarea.scss';

export default class Textarea extends Component {
  static defaultProps = {
    isAutoHeightResizeEnabled: true
  };

  constructor(props) {
    super(props);
    this.textareaEl = createRef();
  }

  componentDidMount() {
    const { isAutoHeightResizeEnabled } = this.props;
    if (!isAutoHeightResizeEnabled) return;
    this.autoHeightResize();
  }

  autoHeightResize = () => {
    const { isAutoHeightResizeEnabled } = this.props;
    if (!isAutoHeightResizeEnabled) return;

    this.textareaEl.current.style.height = '0px'; // resets scroll height
    this.textareaEl.current.style.height = `${
      this.textareaEl.current.scrollHeight
    }px`;
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
      isReadOnly
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
        ref={this.textareaEl}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        onDragStart={onDragStart}
        readOnly={isReadOnly}
      />
    );
  }
}
