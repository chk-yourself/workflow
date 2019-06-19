import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Textarea.scss';
import { debounce } from '../../utils/function';

export default class Textarea extends Component {
  static defaultProps = {
    className: '',
    label: '',
    labelClass: '',
    isAutoHeightResizeEnabled: true,
    minHeight: 0,
    tabIndex: 0
  };

  static propTypes = {
    className: PropTypes.string,
    label: PropTypes.string,
    labelClass: PropTypes.string,
    minHeight: PropTypes.number,
    tabIndex: PropTypes.number,
    isAutoHeightResizeEnabled: PropTypes.bool
  };

  state = {
    isFocused: false
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

  setRef = el => {
    this.el = el;
    const { innerRef } = this.props;
    if (innerRef) {
      innerRef(el);
    }
  };

  onFocus = e => {
    const { onFocus } = this.props;
    this.setState({
      isFocused: true
    });
    if (onFocus) {
      onFocus(e);
    }
  };

  onBlur = e => {
    const { onBlur } = this.props;
    this.setState({
      isFocused: false
    });

    if (onBlur) {
      onBlur(e);
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
      isReadOnly,
      tabIndex,
      label,
      id,
      labelClass,
      isAutoHeightResizeEnabled,
      innerRef,
      minHeight,
      onFocus,
      onBlur,
      ...rest
    } = this.props;

    const { isFocused } = this.state;

    return (
      <>
        {label !== '' && (
          <label className={`${labelClass} ${isFocused ? 'is-focused' : ''}`} htmlFor={id}>
            {label}
          </label>
        )}
        <textarea
          id={id}
          className={`textarea ${className}`}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={isRequired}
          onBlur={this.onBlur}
          onInput={this.autoHeightResize}
          ref={this.setRef}
          onFocus={this.onFocus}
          readOnly={isReadOnly}
          tabIndex={tabIndex}
          {...rest}
        />
      </>
    );
  }
}
