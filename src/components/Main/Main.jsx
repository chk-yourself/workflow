import React from 'react';
import './Main.scss';

const Main = ({ classes, children, title }) => (
  <main className={`main ${classes.main || ''}`}>
  {title && (
    <h1 className={`main__title ${classes.title || ''}`}>{title}</h1>
  )}
    {children}
  </main>
);

Main.defaultProps = {
  classes: {
    main: '',
    title: ''
  },
  title: ''
};

export default Main;
