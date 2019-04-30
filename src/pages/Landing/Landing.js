import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.scss';
import * as ROUTES from '../../constants/routes';

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
        <div className="landing__feature">Project management</div>
        <div className="landing__feature">Task management</div>
        <div className="landing__feature">Real-time collaboration</div>
      </div>
    </section>
  </main>
);

export default LandingPage;
