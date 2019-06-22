import React, { Component } from 'react';
import { ErrorMessage } from '../Error';
import './Input.scss';

let idCounter = 0;

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
    helper: null,
    helperClass: '',
    isInvalid: false
  };

  state = {
    isFocused: false,
    id: (this.props.id || ++idCounter).toString()
  };

  onFocus = e => {
    const { onFocus } = this.props;
    this.setState(prevState => ({
      isFocused: !prevState.isFocused
    }));
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

  render() {
    const {
      className,
      name,
      type,
      value,
      onChange,
      onFocus,
      onBlur,
      placeholder,
      isRequired,
      autoComplete,
      innerRef,
      label,
      labelClass,
      hint,
      hintClass,
      onKeyDown,
      maxLength,
      minLength,
      isReadOnly,
      id: unusedId,
      validationMessage,
      isInvalid,
      ...rest
    } = this.props;

    const { isFocused, id } = this.state;
    const hintId = hint ? `${id}__hint` : '';
    const validationMessageId = validationMessage ? `${id}__validation` : '';
    return (
      <>
        {label && (
          <label
            htmlFor={id}
            className={`input__label ${labelClass} ${isFocused ? 'is-focused' : ''}`}
          >
            {label}
          </label>
        )}
        <input
          id={id}
          className={`input ${className} ${isInvalid ? 'is-invalid' : ''}`}
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
          onKeyDown={onKeyDown}
          maxLength={maxLength}
          minLength={minLength}
          readOnly={isReadOnly}
          tabIndex={isReadOnly ? -1 : 0}
          aria-invalid={isInvalid}
          aria-describedby={`${hintId} ${validationMessageId}`.trim() || null}
          {...rest}
        />
        {validationMessage && <ErrorMessage id={validationMessageId} text={validationMessage} />}
        {hint && (
          <p id={hintId} className={`input__helper ${hintClass} ${isFocused ? 'is-focused' : ''}`}>
            {hint}
          </p>
        )}
      </>
    );
  }
}

export default Input;
