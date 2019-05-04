import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../../components/Icon';
import * as ROUTES from '../../constants/routes';

const GuideArticleSection = ({ title, children, id }) => (
  <section id={id} className="guide__article-section">
    <h2 className="guide__article-section-title">{title}</h2>
    {children}
  </section>
);

const GuideArticleSubsection = ({ title, children }) => (
  <section className="guide__article-subsection">
    <h3 className="guide__article-subsection-title">{title}</h3>
    {children}
  </section>
);

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

export { GuideArticle as default, GuideArticleSection, GuideArticleSubsection };
