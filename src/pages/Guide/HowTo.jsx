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
        <GuidePanel title="Change workspace name" />
      </div>
    </GuideArticleSection>
    <GuideArticleSection id="projects" title="Projects">
      <div className="guide__article-section-wrapper">
        <GuidePanel title="Create a project" />
        <GuidePanel title="Change project name" />
        <GuidePanel title="Add or remove a project member" />
        <GuidePanel title="Change project layout (board or list)" />
        <GuidePanel title="Add or edit project description" />
      </div>
    </GuideArticleSection>
    <GuideArticleSection id="lists" title="Lists">
      <div className="guide__article-section-wrapper">
        <GuidePanel title="Create a list" />
        <GuidePanel title="Change list name" />
        <GuidePanel title="Move task to different list" />
        <GuidePanel title="Delete a list" />
      </div>
    </GuideArticleSection>
    <GuideArticleSection id="tasks" title="Tasks">
      <div className="guide__article-section-wrapper">
        <GuidePanel title="Create a task" />
        <GuidePanel title="Set task due date" />
        <GuidePanel title="Add or remove task assignees" />
        <GuidePanel title="Submit or view task comments" />
        <GuidePanel title="Organize tasks with custom, color-coded tag labels" />
      </div>
    </GuideArticleSection>
  </GuideArticle>
);
export default HowTo;
