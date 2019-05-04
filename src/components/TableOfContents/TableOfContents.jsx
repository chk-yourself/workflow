import React from 'react';
import { HashLink } from '../HashLink';
import './TableOfContents.scss';

const TableOfContents = ({ title, sections, classes }) => (
  <div className={`table-of-contents ${classes.tableOfContents || ''}`}>
    <div className={`table-of-contents__title ${classes.title || ''}`}>
      {title}
    </div>
    <ul className={`table-of-contents__list ${classes.list || ''}`}>
      {sections.map(section => (
        <li className={`table-of-contents__item ${classes.item}`}>
          <HashLink
            className={`table-of-contents__link ${classes.link || ''}`}
            to={section.link}
          >
            {section.title}
          </HashLink>
        </li>
      ))}
    </ul>
  </div>
);

TableOfContents.defaultProps = {
  sections: [],
  classes: {
    tableOfContents: '',
    list: '',
    item: '',
    link: '',
    title: ''
  }
};

export default TableOfContents;
