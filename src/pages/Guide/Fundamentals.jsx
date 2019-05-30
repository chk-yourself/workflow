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
          title: 'Homepage',
          link: `${ROUTES.FUNDAMENTALS}#homepage`
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
        <p className="guide__article-section-intro">
          Workflow's interface is divided into 5 areas:
        </p>
        <ol className="guide__list guide__list--ordered">
          <li className="guide__item">
            <strong>Top Bar</strong> - access Search Bar, Workspace Settings,
            Account Settings, and Profile Settings
          </li>
          <li className="guide__item">
            <strong>Sidebar</strong> - access Homepage, My Tasks, Inbox, Teams,
            and projects in active Workspace
          </li>
          <li className="guide__item">
            <strong>Header</strong> - contains additional actions and views for
            the project or page
          </li>
          <li className="guide__item">
            <strong>Main Pane</strong> - displays main page content, which may
            be a list of tasks, project overview, search results, Inbox
            notifications, or a collection of projects
          </li>
          <li className="guide__item">
            <strong>Task Editor</strong> - displays details of selected task
          </li>
        </ol>
        <GuideArticleSubsection title="Top Bar">
          <p>From the top bar, you can:</p>
          <ul className="guide__list">
            <li className="guide__item">
              Use the <strong>Search Bar</strong> to easily find tasks by name,
              keywords, tags, and project, taking advantage of auto-suggestions
              that will appear as you type to help you narrow down your search
              more quickly.
            </li>
            <li className="guide__item">
              Access your <strong>Workspace Settings</strong>,{' '}
              <strong>Account Settings</strong>, and{' '}
              <strong>Profile Settings</strong>.
            </li>
            <li className="guide__item">
              Switch between your Workspaces and/or create a new one.
            </li>
          </ul>
        </GuideArticleSubsection>
        <GuideArticleSubsection title="Sidebar">
          <p>From the sidebar, you can:</p>
          <ul className="guide__list">
            <li className="guide__item">
              Access your <strong>Homepage</strong>, <strong>My Tasks</strong>,{' '}
              <strong>Projects</strong>, and <strong>Inbox</strong>
            </li>
            <li className="guide__item">
              Access your <strong>Workspace Settings</strong>
            </li>
            <li className="guide__item">
              View your workspace <strong>Team</strong> and see who's online
            </li>
            <li className="guide__item">Access the Workspace Guide</li>
          </ul>
        </GuideArticleSubsection>
        <GuideArticleSubsection title="Header">
          <p>From the header, you can:</p>
          <ul className="guide__list">
            <li className="guide__item">
              Access additional actions and views for the project or page
            </li>
            <li className="guide__item">
              Customize your project settings. Switch between layouts, filter
              tasks by completion status, and/or sort tasks by due date,
              project, or when you plan on completing them
            </li>
            <li className="guide__item">View and manage project members</li>
          </ul>
        </GuideArticleSubsection>
        <GuideArticleSubsection title="Main Pane">
          <p>
            The main pane holds the main content of the page, which can be a
            list of tasks, overview of a project, search results, or a
            collection of projects
          </p>
        </GuideArticleSubsection>
        <GuideArticleSubsection title="Task Editor">
          <p>
            The task editor, which appears as a modal or side panel, depending
            on the type of page and/or project layout preferences, allows you to
            view and edit the details of the task currently selected in the main
            pane.
          </p>
          <p>From the task editor, you can:</p>
          <ul className="guide__list">
            <li className="guide__item">
              Mark the task complete or incomplete
            </li>
            <li className="guide__item">Edit the task's name</li>
            <li className="guide__item">
              Break up the task into smaller subtasks
            </li>
            <li className="guide__item">Set a due date</li>
            <li className="guide__item">
              Assign the task to yourself or to your teammate(s)
            </li>
            <li className="guide__item">
              Identify which project and list the task belongs to and move the
              task to a different list
            </li>
            <li className="guide__item">
              Add a description in rich text to give the task more context
            </li>
            <li className="guide__item">
              Post and view comments related to the task
            </li>
          </ul>
        </GuideArticleSubsection>
      </div>
    </GuideArticleSection>
    <GuideArticleSection title="Homepage" id="homepage">
      <div className="guide__article-section-wrapper">
        <p className="guide__article-section-intro">
          Your Homepage, which serves as an entry point to your projects and
          tasks in your active workspace, is comprised of the following
          sections:
        </p>
        <GuideArticleSubsection title="Tasks due soon">
          <p>
            View and access all tasks assigned to you that are due within the
            next 5 days and sorted in chronological order
          </p>
        </GuideArticleSubsection>
        <GuideArticleSubsection title="Notifications">
          <p>
            View and manage your active notifications. Respond to workspace
            invites and stay informed when a teammate @mentions you in a task
            comment.
          </p>
        </GuideArticleSubsection>
        <GuideArticleSubsection title="My Projects">
          <p>
            View and access all projects in the selected workspace, where you
            are listed as a member
          </p>
        </GuideArticleSubsection>
      </div>
    </GuideArticleSection>
    <GuideArticleSection title="My Tasks" id="my-tasks" />
    <GuideArticleSection title="Search" id="search" />
  </GuideArticle>
);
export default Fundamentals;
