import React from 'react';
import jamIcons from '../../assets/jam/jam-sprite.svg';

const JamIcon = ({ name, className, width, height }) => (
  <svg
    className={`jam jam-${name} ${className}`}
    preserveAspectRatio="xMinYMin"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 24 24"
    width={width}
    height={height}
    fill="currentColor"
  >
    <use xlinkHref={`${jamIcons}#${name}`} />
  </svg>
);

JamIcon.defaultProps = {
  className: '',
  width: 24,
  height: 24
};

export default JamIcon;
