import React from 'react';
import { withRouter, Switch, Route, Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import Features from './Features';
import HowTo from './HowTo';
import Fundamentals from './Fundamentals';
import { Icon } from '../../components/Icon';
import './Guide.scss';

const GuideTile = ({ link, title, description, color, icon }) => (
  <li className={`guide__tile guide__tile--${color}`}>
    <Link className="guide__tile-link" to={link}>
      <span className={`guide__icon-wrapper guide__icon-wrapper--${color}`}>
        <Icon name={icon} />
      </span>
      <span className="guide__tile-content">
        <span className="guide__tile-title">{title}</span>
        <span className="guide__tile-desc">{description}</span>
      </span>
    </Link>
    <Icon className="guide__icon--arrow" name="arrow-up-right" />
  </li>
);

const Guide = () => (
  <main className="guide">
    <Switch>
      <Route
        exact
        path={ROUTES.GUIDE}
        render={() => (
          <>
            <h1 className="guide__title">Workflow Guide</h1>
            <p className="guide__intro">
              Learn the basics of using Workflow to manage your projects.
            </p>
            <ul className="guide__grid">
              <GuideTile
                color="primary"
                title="Features"
                link={ROUTES.FEATURES}
                icon="triangle"
                description="Explore Workflow's core features"
              />
              <GuideTile
                color="secondary"
                title="Fundamentals"
                link={ROUTES.FUNDAMENTALS}
                icon="square"
                description="Get to know Workflow's interface"
              />
              <GuideTile
                color="tertiary"
                title="How to..."
                link={ROUTES.HOW_TO}
                icon="circle"
                description="Learn how to perform common tasks"
              />
            </ul>
          </>
        )}
      />
      <Route path={ROUTES.HOW_TO} component={HowTo} />
      <Route path={ROUTES.FEATURES} component={Features} />
      <Route path={ROUTES.FUNDAMENTALS} component={Fundamentals} />
    </Switch>
  </main>
);
export default withRouter(Guide);
