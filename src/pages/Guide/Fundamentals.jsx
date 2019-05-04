import React from 'react';
import GuidePanel, { GuidePanelSection } from './GuidePanel';
import GuideArticle from './GuideArticle';
import './Fundamentals.scss';

const Fundamentals = () => (
  <GuideArticle title="Fundamentals" icon="square" color="secondary">
    <GuidePanel title="Navigating Workflow">
      <GuidePanelSection title="Top Bar">
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
      </GuidePanelSection>
      <GuidePanelSection title="Sidebar">
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
      </GuidePanelSection>
      <GuidePanelSection title="Search Bar">
        <p>
          Use the search bar to quickly find tasks by name, keywords, tags, and
          project. Auto-suggestions will appear as you type to help you narrow
          down your search.
        </p>
      </GuidePanelSection>
    </GuidePanel>
    <GuidePanel title="Home Page" />
    <GuidePanel title="My Tasks" />
    <GuidePanel title="Search" />
  </GuideArticle>
);
export default Fundamentals;
