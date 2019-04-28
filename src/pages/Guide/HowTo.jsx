import React from 'react';
import GuidePanel from './GuidePanel';
import GuideArticle from './GuideArticle';
import './Guide.scss';

const HowTo = () => (
  <GuideArticle title="How to...">
    <GuidePanel title="Create a project" />
    <GuidePanel title="Edit a project" />
    <GuidePanel title="Create a task" />
    <GuidePanel title="Edit a task" />
    <GuidePanel title="Create a workspace" />
  </GuideArticle>
);
export default HowTo;
