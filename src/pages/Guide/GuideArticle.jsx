import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../../components/Icon';
import * as ROUTES from '../../constants/routes';

const GuideArticle = ({ title, children, icon, color }) => (
  <article className="guide__article">
    <header className="guide__article-header">
      <span className={`guide__icon-wrapper guide__icon-wrapper--${color}`}>
        <Icon name={icon} />
      </span>
      <div className="guide__article-header-content">
        <h1 className="guide__article-title">{title}</h1>
        <Link className="guide__link--guide" to={ROUTES.GUIDE}>
          Workflow Guide
        </Link>
      </div>
    </header>
    {children}
  </article>
);

export default GuideArticle;
