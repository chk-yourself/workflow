import React, { Component } from 'react';
import './Input.scss';

class Input extends Component {
  static defaultProps = {
    className: '',
    innerRef: null,
    labelClass: '',
    type: 'text',
    isRequired: false,
    isReadOnly: false,
    label: '',
    id: null,
    onFocus: () => null,
    onBlur: () => null
  };

  state = {
    isFocused: false
  };

  onFocus = e => {
    const { onFocus } = this.props;
    this.setState(prevState => ({
      isFocused: !prevState.isFocused
    }));
    onFocus(e);
  };

  onBlur = e => {
    const { onBlur } = this.props;
    this.setState({
      isFocused: false
    });
    onBlur(e);
  };

  render() {
    const {
      className = '',
      name,
      type,
      value,
      onChange,
      onInput,
      onFocus,
      onBlur,
      placeholder,
      isRequired,
      autoComplete,
      innerRef,
      label,
      labelClass,
      onKeyDown,
      maxLength,
      minLength,
      isReadOnly,
      id,
      ...rest
    } = this.props;

    const { isFocused } = this.state;
    return (
      <>
        {label && (
          <label
            htmlFor={id || name}
            className={`input__label ${labelClass} ${
              isFocused ? 'is-focused' : ''
            }`}
          >
            {label}
          </label>
        )}
        <input
          id={label ? id || name : id}
          className={`input ${className}`}
          name={name}
          type={type}
          value={value}
          onFocus={this.onFocus}
          onChange={onChange}
          placeholder={placeholder}
          required={isRequired}
          onBlur={this.onBlur}
          autoComplete={autoComplete}
          ref={innerRef}
          onInput={onInput}
          onKeyDown={onKeyDown}
          maxLength={maxLength}
          minLength={minLength}
          readOnly={isReadOnly}
          tabIndex={isReadOnly ? -1 : 0}
          {...rest}
        />
      </>
    );
  }
}

export default Input;
