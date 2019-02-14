import React from 'react';
import './Textarea.scss';

const Textarea = props => {
  return (
    <textarea
      className={`textarea ${props.className}`}
      id={props.name}
      name={props.name}
      value={props.value}
      onChange={props.onChange}
      placeholder={props.placeholder}
      required={props.isRequired}
      onBlur={props.onBlur}
    />
  );
};

export default Textarea;
