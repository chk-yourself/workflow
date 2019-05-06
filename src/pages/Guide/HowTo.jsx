import React from 'react';
import GuidePanel from './GuidePanel';
import GuideArticle, { GuideArticleSection } from './GuideArticle';
import { TableOfContents } from '../../components/TableOfContents';
import * as ROUTES from '../../constants/routes';
import './Guide.scss';

const HowTo = () => (
  <GuideArticle title="How to..." icon="square" color="tertiary">
    <TableOfContents
      title="Skip ahead to"
      sections={[
        {
          title: 'Workspaces',
          link: `${ROUTES.HOW_TO}#workspaces`
        },
        {
          title: 'Projects',
          link: `${ROUTES.HOW_TO}#projects`
        },
        {
          title: 'Lists',
          link: `${ROUTES.HOW_TO}#lists`
        },
        {
          title: 'Tasks',
          link: `${ROUTES.HOW_TO}#tasks`
        }
      ]}
    />
    <GuideArticleSection id="workspaces" title="Workspaces">
      <div className="guide__article-section-wrapper">
        <GuidePanel title="Create a workspace" />
        <GuidePanel title="Edit a workspace" />
      </div>
    </GuideArticleSection>
    <GuideArticleSection id="projects" title="Projects">
      <div className="guide__article-section-wrapper">
        <GuidePanel title="Create a project" />
        <GuidePanel title="Edit a project" />
      </div>
    </GuideArticleSection>
    <GuideArticleSection id="lists" title="Lists">
      <div className="guide__article-section-wrapper">
        <GuidePanel title="Create a list" />
        <GuidePanel title="Edit a list" />
      </div>
    </GuideArticleSection>
    <GuideArticleSection id="tasks" title="Tasks">
      <div className="guide__article-section-wrapper">
        <GuidePanel title="Create a task" />
        <GuidePanel title="Customize a task" />
      </div>
    </GuideArticleSection>
  </GuideArticle>
);
export default HowTo;
