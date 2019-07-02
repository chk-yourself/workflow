import React, { memo } from 'react';
import PropTypes from 'prop-types';
import featherIcons from 'feather-icons/dist/feather-sprite.svg';

const Icon = ({ name, className, size }) => (
  <svg
    className={`feather feather-${name} ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 24 24"
    width={size}
    height={size}
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
  className: '',
  size: 24
};

Icon.propTypes = {
  className: PropTypes.string,
  size: PropTypes.number,
  name: PropTypes.string.isRequired
};

export default memo(Icon);
