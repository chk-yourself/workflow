import React from 'react';
import './UserFormPage.scss';

const UserFormPage = ({ title, children }) => (
  <main className="user-form__container">
    <h1 className="user-form__title">{title}</h1>
    {children}
  </main>
);

export default UserFormPage;