import React from 'react';
import { Main } from '../Main';
import './UserFormPage.scss';

const UserFormPage = ({ title, children, classes }) => (
  <Main classes={{main: `user-form__container ${classes.main || ''}`,
  title: `user-form__title ${classes.heading || ''}`}}
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

export default UserFormPage;
