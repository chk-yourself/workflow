import React from 'react';
import './UserFormPage.scss';

const UserFormPage = ({ title, children, classes }) => (
  <main className={`user-form__container ${classes.main || ''}`}>
    <h1 className={`user-form__title ${classes.heading || ''}`}>{title}</h1>
    {children}
  </main>
);

UserFormPage.defaultProps = {
  classes: {
    main: '',
    heading: ''
  },
  title: ''
};

export default UserFormPage;
