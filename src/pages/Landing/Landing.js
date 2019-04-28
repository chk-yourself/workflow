import React from 'react';
import { Link } from 'react-router-dom';
import { Main } from '../../components/Main';
import './Landing.scss';
import * as ROUTES from '../../constants/routes';

const LandingPage = () => (
  <Main
    title="Streamline your workflow"
    classes={{ main: 'landing', title: 'landing__title' }}
  >
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
    {/*
    <section className="landing__section">
      <ul className="landing__features">
        <li className="landing__feature">Project management</li>
        <li className="landing__feature">Task management</li>
        <li className="landing__feature">Seamless collaboration</li>
      </ul>
    </section>
    */}
  </Main>
);

export default LandingPage;
