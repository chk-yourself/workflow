import React from 'react';

const GuideArticle = ({ title, children }) => (
  <article className="guide__article">
    <h1 className="guide__article-title">{title}</h1>
    {children}
  </article>
);

export default GuideArticle;
