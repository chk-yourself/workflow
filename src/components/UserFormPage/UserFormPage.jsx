import React from 'react';
import PropTypes from 'prop-types';
import { Main } from '../Main';
import './UserFormPage.scss';

const UserFormPage = ({ title, children, classes }) => (
  <Main
    classes={{
      main: `user-form__container ${classes.main || ''}`,
      title: `user-form__title ${classes.heading || ''}`
    }}
    title={title}
  >
    {children}
  </Main>
);

UserFormPage.defaultProps = {
  classes: {
    main: '',
    heading: ''
  },
  title: ''
};

UserFormPage.propTypes = {
  classes: PropTypes.shape({
    main: PropTypes.string,
    heading: PropTypes.string
  }),
  title: PropTypes.string
};

export default UserFormPage;
