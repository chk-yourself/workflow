import React from 'react';
import GuideArticle, {
  GuideArticleSection,
  GuideArticleSubsection
} from './GuideArticle';
import { TableOfContents } from '../../components/TableOfContents';
import './Fundamentals.scss';
import * as ROUTES from '../../constants/routes';

const Fundamentals = () => (
  <GuideArticle title="Fundamentals" icon="square" color="secondary">
    <TableOfContents
      title="Skip ahead to"
      sections={[
        {
          title: 'Navigating Workflow',
          link: `${ROUTES.FUNDAMENTALS}#navigating-workflow`
        },
        {
          title: 'Home Page',
          link: `${ROUTES.FUNDAMENTALS}#home-page`
        },
        {
          title: 'My Tasks',
          link: `${ROUTES.FUNDAMENTALS}#my-tasks`
        },
        {
          title: 'Search',
          link: `${ROUTES.FUNDAMENTALS}#search`
        }
      ]}
    />
    <GuideArticleSection title="Navigating Workflow" id="navigating-workflow">
      <div className="guide__article-section-wrapper">
        <GuideArticleSubsection title="Top Bar">
          <p>From the top bar, you can:</p>
          <ul className="guide__list">
            <li className="guide__item">
              Access the <strong>search bar</strong>
            </li>
            <li className="guide__item">
              Access your <strong>workspace settings</strong>,{' '}
              <strong>account settings</strong>, and <strong>profile</strong>.
            </li>
            <li className="guide__item">
              Select your active workspace or create a new one.
            </li>
          </ul>
        </GuideArticleSubsection>
        <GuideArticleSubsection title="Sidebar">
          <p>From the sidebar, you can:</p>
          <ul className="guide__list">
            <li className="guide__item">
              Access your <strong>Homepage</strong>, <strong>My Tasks</strong>,
              and <strong>My Projects</strong>
            </li>
            <li className="guide__item">
              Access your <strong>workspace settings</strong>
            </li>
            <li className="guide__item">
              View your workspace <strong>team</strong> and see who's online
            </li>
            <li className="guide__item">Access the Workspace Guide</li>
          </ul>
        </GuideArticleSubsection>
        <GuideArticleSubsection title="Search Bar">
          <p>
            Use the search bar to quickly find tasks by name, keywords, tags,
            and project. Auto-suggestions will appear as you type to help you
            narrow down your search.
          </p>
        </GuideArticleSubsection>
      </div>
    </GuideArticleSection>
    <GuideArticleSection title="Home Page" id="home-page" />
    <GuideArticleSection title="My Tasks" id="my-tasks" />
    <GuideArticleSection title="Search" id="search" />
  </GuideArticle>
);
export default Fundamentals;
