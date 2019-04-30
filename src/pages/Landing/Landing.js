import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.scss';
import * as ROUTES from '../../constants/routes';
import { ReactComponent as TodoList } from '../../assets/undraw/todo-list.svg';
import { ReactComponent as WorkChat } from '../../assets/undraw/work-chat.svg';
import { ReactComponent as ScrumBoard } from '../../assets/undraw/scrum-board.svg';

const LandingPage = () => (
  <main className="landing">
    <section className="landing__section landing__hero">
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
      <div className="landing__features">
        <div className="landing__feature">
        <ScrumBoard />
        Project management
        </div>
        <div className="landing__feature">
          <TodoList />
          Task management
        </div>
        <div className="landing__feature">
        <WorkChat />
        Real-time collaboration
        </div>
      </div>
    </section>
  </main>
);

export default LandingPage;
