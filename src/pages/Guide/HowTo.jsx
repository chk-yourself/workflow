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
    <GuideArticleSection id="workspaces" title="Workspaces" />
    <GuideArticleSection id="projects" title="Projects" />
    <GuideArticleSection id="lists" title="Lists" />
    <GuideArticleSection id="tasks" title="Tasks" />
  </GuideArticle>
);
export default HowTo;
