import React from 'react';
import './Main.scss';

const Main = ({ classes, children, title }) => (
  <main className={`main ${classes.main || ''}`}>
    <h1 className={`main__title ${classes.title || ''}`}>{title}</h1>
    {children}
  </main>
);

Main.defaultProps = {
  classes: {
    main: '',
    title: ''
  }
};

export default Main;
