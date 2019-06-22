import React from 'react';
import PropTypes from 'prop-types';
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

Logo.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md']),
  link: PropTypes.string
};

export default Logo;
