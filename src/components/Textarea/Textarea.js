import React, { Component, createRef } from 'react';
import './Textarea.scss';
import { debounce } from '../../utils/function';

export default class Textarea extends Component {
  static defaultProps = {
    isAutoHeightResizeEnabled: true,
    minHeight: 0
  };

  constructor(props) {
    super(props);
    this.textareaEl = createRef();
  }

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

  autoHeightResize = () => {
    const { isAutoHeightResizeEnabled, minHeight } = this.props;
    if (!isAutoHeightResizeEnabled) return;

    this.textareaEl.current.style.height = `${minHeight}px`; // resets scroll height
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
