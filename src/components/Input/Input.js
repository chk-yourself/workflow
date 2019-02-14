import React from 'react';
import './Input.scss';

const Input = props => {
  return (
    <>
      {!props.hideLabel && (
        <label htmlFor={props.name} className="input__label">
          {props.title}
        </label>
      )}
      <input
        className={props.className}
        id={props.name}
        name={props.name}
        type={props.type}
        value={props.value}
        onChange={props.onChange}
        placeholder={props.placeholder}
        required={props.isRequired}
        onBlur={props.onBlur}
      />
    </>
  );
};

export default Input;
