import React from 'react';
import PropTypes from 'prop-types';
import './Main.scss';

const Main = ({ classes, children, title }) => (
  <main className={`main ${classes.main || ''}`}>
    {title && <h1 className={`main__title ${classes.title || ''}`}>{title}</h1>}
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

Main.propTypes = {
  title: PropTypes.string,
  classes: PropTypes.shape({
    main: PropTypes.string,
    title: PropTypes.string
  })
};

export default Main;
