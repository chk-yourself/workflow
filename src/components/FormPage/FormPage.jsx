import React from 'react';
import PropTypes from 'prop-types';
import './FormPage.scss';

const FormPage = ({ children, title, classes, footer }) => (
  <main className={`form-page ${classes.main || ''}`}>
    <div className={`form-page__container ${classes.container || ''}`}>
      <h1 className={`form-page__title ${classes.title || ''}`}>{title}</h1>
      {children}
    </div>
    {footer && <footer className={`form-page__footer ${classes.footer || ''}`}>{footer}</footer>}
  </main>
);

FormPage.defaultProps = {
  title: '',
  classes: {
    main: '',
    container: '',
    title: '',
    footer: ''
  }
};

FormPage.propTypes = {
  title: PropTypes.string,
  classes: PropTypes.shape({
    main: PropTypes.string,
    container: PropTypes.string,
    title: PropTypes.string,
    footer: PropTypes.string
  })
};

export default FormPage;
