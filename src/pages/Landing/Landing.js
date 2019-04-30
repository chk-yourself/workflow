import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.scss';
import * as ROUTES from '../../constants/routes';
import { ReactComponent as TodoList } from '../../assets/undraw/todo-list.svg';
import { ReactComponent as WorkChat } from '../../assets/undraw/work-chat.svg';
import { ReactComponent as ScrumBoard } from '../../assets/undraw/scrum-board.svg';

const LandingPage = () => (
  <main className="landing">
    <section className="landing__hero">
      <h1 className="landing__title">Streamline your workflow</h1>
      <p className="landing__intro">
        Workflow is a project management platform, inspired by Asana and Trello,
        and built with React, Redux, and Firebase.{' '}
        <a
          target="_blank"
          className="landing__link"
          href="https://github.com/chk-yourself/workflow"
        >
          View repo →
        </a>
      </p>
      <p className="landing__intro">
        <Link className="landing__link--get-started" to={ROUTES.SIGN_UP}>
          Get started
        </Link>
      </p>
    </section>
    <section className="landing__section">
    <div className="landing__feature">
    <div className="landing__img-wrapper">
        <ScrumBoard />
    </div>
        <div className="landing__feature-about">
        <h2 className="landing__feature-name">Project management</h2>
        <p className="landing__feature-desc">Plan your projects using mobile-friendly, drag-and-drop kanban boards or lists. Enable access for select workspace members, switch between layouts, and set view filters and sort rules to organize your tasks the way you see fit.</p>
      </div>
      </div>
      <div className="landing__feature">
      <div className="landing__img-wrapper">
      <TodoList />
      </div>
        <div className="landing__feature-about">
        <h2 className="landing__feature-name">Task management</h2>
        <p className="landing__feature-desc">Set due dates, organize tasks with color-coded tag labels, add assignees, notes, subtasks, and comments.</p>
        </div>
      </div>
      <div className="landing__feature">
      <div className="landing__img-wrapper">
    <WorkChat />
    </div>
        <div className="landing__feature-about">
        <h2 className="landing__feature-name">Real-time collaboration</h2>
        <p className="landing__feature-desc">Collaborate with your team and track your project's progress in real-time.</p>
        </div>
      </div>
    </section>
  </main>
);

export default LandingPage;
