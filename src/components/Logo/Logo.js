import React from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { Icon } from '../Icon';
import './Logo.scss';

const Logo = ({ size, className, onClick }) => {
  return (
    <div className={`logo logo--${size} ${className}`}>
      <Link className="logo__link" to={ROUTES.LANDING} onClick={onClick}>
        <span className="logo__text">workflow</span>
      </Link>
    </div>
  );
};

export default Logo;
