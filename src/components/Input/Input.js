import React from 'react';
import './Input.scss';

const Input = props => {
  return (
    <div className="input__group">
      {!props.hideLabel && (
        <label htmlFor={props.name} className="input__label">
          {props.title}
        </label>
      )}
      <input
        className="input"
        id={props.name}
        name={props.name}
        type={props.type}
        value={props.value}
        onChange={props.onChange}
        placeholder={props.placeholder}
        required={props.isRequired}
      />
    </div>
  );
};

export default Input;
