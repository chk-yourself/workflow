import React from 'react';
import { Main } from '../../components/Main';
import './Features.scss';

const Feature = ({ title, children }) => (
  <section className="features__section">
    <h2 className="features__subheading">{title}</h2>
    {children}
  </section>
);

const Features = () => (
  <Main
    classes={{ main: 'features', title: 'features__heading' }}
    title="Workflow Features"
  >
    <Feature title="Project and task management">
      <ul className="features__list">
        <li className="features__item">
          <strong>Projects:</strong> Organize your work into shared projects as
          mobile-friendly, drag-and-drop lists or kanban boards.
        </li>
        <li className="features__item">
          <strong>Tasks:</strong> Set due dates, organize tasks with color-coded
          tag labels, add assignees, notes, subtasks, and comments.
        </li>
        <li className="features__item">
          <strong>Subtasks:</strong> Break up tasks into smaller steps.
        </li>
      </ul>
    </Feature>
    <Feature title="Collaboration">
      <ul className="features__list">
        <li className="features__item">
          <strong>Notifications:</strong> Receive a notification when another
          user mentions you in a comment, or invites you to a workspace.
        </li>
        <li className="features__item">
          <strong>Task comments:</strong> Comment directly on a task to clarify
          exactly what needs to be done, and mention teammates to ensure your
          message is heard by your intended audience.
        </li>
        <li className="features__item">
          <strong>Rich text:</strong> Use rich text to organize your thoughts
          and clarify what you mean.
        </li>
        <li className="features__item">
          <strong>Presence detection:</strong> Keep track of your teammates'
          online statuses.
        </li>
        <li className="features__item">
          <strong>Likes:</strong> Acknowledge a teammate's comment with a like.
        </li>
      </ul>
    </Feature>
    <Feature title="Views">
      <ul className="features__list">
        <li className="features__item">
          <strong>My Tasks:</strong> View all your assigned tasks in one place,
          and organize them by project, due date, or when you plan on completing
          them.
        </li>
        <li className="features__item">
          <strong>Search:</strong> Quickly find what you're looking for with our
          smart suggestions.
        </li>
      </ul>
    </Feature>
  </Main>
);
export default Features;
