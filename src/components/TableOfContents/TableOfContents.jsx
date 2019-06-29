import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './TableOfContents.scss';

const TableOfContents = ({ title, sections, classes }) => (
  <div className={`table-of-contents ${classes.tableOfContents || ''}`}>
    <div className={`table-of-contents__title ${classes.title || ''}`}>{title}</div>
    <ul className={`table-of-contents__list ${classes.list || ''}`}>
      {sections.map(section => (
        <li key={section.title} className={`table-of-contents__item ${classes.item}`}>
          <Link
            className={`table-of-contents__link ${classes.link || ''}`}
            to={section.link}
          >
            {section.title}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

TableOfContents.defaultProps = {
  title: 'Table of Contents',
  sections: [],
  classes: {
    tableOfContents: '',
    list: '',
    item: '',
    link: '',
    title: ''
  }
};

TableOfContents.propTypes = {
  title: PropTypes.string,
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      link: PropTypes.string
    })
  ),
  classes: PropTypes.shape({
    tableOfContents: PropTypes.string,
    list: PropTypes.string,
    item: PropTypes.string,
    link: PropTypes.string,
    title: PropTypes.string
  })
};

export default TableOfContents;
