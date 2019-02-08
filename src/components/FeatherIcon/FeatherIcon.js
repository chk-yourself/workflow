import React from 'react';
import featherIcons from '../../assets/feather/feather-sprite.svg';

function FeatherIcon(props) {
  return (
    <svg
      className={`feather feather-${props.name} ${props.addClass || ''}`.trim()}
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
      <use xlinkHref={`${featherIcons}#${props.name}`} />
    </svg>
  );
}

export default FeatherIcon;
