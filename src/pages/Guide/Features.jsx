import React from 'react';
import GuideArticle from './GuideArticle';
import './Features.scss';

const Feature = ({ title, children }) => (
  <section className="features__section">
    <h2 className="features__section-title">{title}</h2>
    <div className="guide__article-section-wrapper">{children}</div>
  </section>
);

const Features = () => (
  <GuideArticle title="Features" icon="triangle" color="primary">
    <p className="guide__article-intro">
      Workflow is a project management app, inspired by Asana and Trello. Built with
      React, Redux, and Firebase, Workflow allows users to create shared projects as
      mobile-friendly, drag-and-drop Kanban boards and todo lists, and collaborate in
      real-time to manage their tasks.
    </p>
    <Feature title="Project and task management">
      <ul className="guide__list">
        <li className="guide__item">
          <strong>Workspaces:</strong> Organize your projects by the people you work with.
          Workspaces allow you to create teams for collaborating on projects and tasks.
        </li>
        <li className="guide__item">
          <strong>Projects:</strong> Organize your work into shared projects as
          mobile-friendly, drag-and-drop lists or kanban boards. Enable access for select
          workspace members, switch between layouts, and set view filters and sort rules
          to organize your tasks the way you see fit.
        </li>
        <li className="guide__item">
          <strong>Lists:</strong> Organize related tasks into lists.
        </li>
        <li className="guide__item">
          <strong>Tasks:</strong> Break work into manageable pieces
        </li>
        <li className="guide__item">
          <strong>Subtasks:</strong> Break up tasks into smaller steps.
        </li>
        <li className="guide__item">
          <strong>Rich text:</strong> Use rich text to organize your thoughts and clarify
          what you mean.
        </li>
        <li className="guide__item">
          <strong>Due dates:</strong> Set due dates to ensure every task gets completed on
          time.
        </li>
        <li className="guide__item">
          <strong>Task assignees:</strong> Clarify who exactly is responsible for each
          task.
        </li>
        <li className="guide__item">
          <strong>Task tags:</strong> Use custom, color-coded labels to give tasks
          additional context or to categorize them for easy viewing
        </li>
      </ul>
    </Feature>
    <Feature title="Collaboration">
      <ul className="guide__list">
        <li className="guide__item">
          <strong>Notifications:</strong> Receive a notification when another user
          mentions you in a comment, or invites you to a workspace.
        </li>
        <li className="guide__item">
          <strong>Task comments:</strong> Comment directly on a task to clarify exactly
          what needs to be done, and mention teammates to ensure your message is heard by
          your intended audience.
        </li>
        <li className="guide__item">
          <strong>Presence detection:</strong> Keep track of your teammates' online
          statuses.
        </li>
        <li className="guide__item">
          <strong>Likes:</strong> Acknowledge a teammate's comment with a like.
        </li>
      </ul>
    </Feature>
    <Feature title="Views">
      <ul className="guide__list">
        <li className="guide__item">
          <strong>My Tasks:</strong> View all your assigned tasks in one place, and
          organize them by project, due date, or when you plan on completing them.
        </li>
        <li className="guide__item">
          <strong>Search:</strong> Use the search bar to quickly find what you're looking
          for. Search for tasks by keywords, tags, project, or name.
        </li>
        <li className="guide__item">
          <strong>Inbox:</strong> View all your active and archived notifications in one
          place.
        </li>
      </ul>
    </Feature>
  </GuideArticle>
);

export default Features;
