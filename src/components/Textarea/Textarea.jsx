import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Textarea.scss';
import { debounce } from '../../utils/function';

export default class Textarea extends Component {
  static defaultProps = {
    className: '',
    label: '',
    labelClass: '',
    autoResize: true,
    minHeight: 0,
    tabIndex: 0
  };

  static propTypes = {
    className: PropTypes.string,
    label: PropTypes.string,
    labelClass: PropTypes.string,
    minHeight: PropTypes.number,
    tabIndex: PropTypes.number,
    autoResize: PropTypes.bool
  };

  state = {
    isFocused: false
  };

  componentDidMount() {
    const { autoResize } = this.props;
    if (!autoResize) return;
    this.autoHeightResize();
    this.handleResize = debounce(this.autoHeightResize, 200);
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
    const { autoResize, minHeight } = this.props;
    if (!autoResize) return;
    this.el.style.height = `${minHeight}px`; // resets scroll height
    this.el.style.height = `${this.el.scrollHeight}px`;
  };

  onInput = e => {
    const { onInput } = this.props;
    this.autoHeightResize();
    if (onInput) {
      onInput(e);
    }
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
      autoResize,
      innerRef,
      minHeight,
      onFocus,
      onBlur,
      onInput,
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
          onInput={this.onInput}
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
