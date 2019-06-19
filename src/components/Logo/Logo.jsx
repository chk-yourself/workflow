import React from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import './Logo.scss';

const Logo = ({ size, className, onClick, link }) => {
  return (
    <div className={`logo logo--${size} ${className}`}>
      <Link className="logo__link" to={link} onClick={onClick}>
        <span className="logo__text">workflow</span>
      </Link>
    </div>
  );
};

Logo.defaultProps = {
  className: '',
  size: 'md',
  link: ROUTES.LANDING
};

export default Logo;
