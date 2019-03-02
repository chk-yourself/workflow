import React from 'react';
import featherIcons from '../../assets/feather/feather-sprite.svg';

const Icon = ({ name, className }) => (
  <svg
    className={`feather feather-${name} ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <use xlinkHref={`${featherIcons}#${name}`} />
  </svg>
);

Icon.defaultProps = {
  className: ''
};

export default Icon;
