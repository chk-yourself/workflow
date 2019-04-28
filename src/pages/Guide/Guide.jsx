import React from 'react';
import { withRouter, Switch, Route, Link } from 'react-router-dom';
import { Main } from '../../components/Main';
import * as ROUTES from '../../constants/routes';
import Features from './Features';
import HowTo from './HowTo';
import Fundamentals from './Fundamentals';
import { Icon } from '../../components/Icon';
import './Guide.scss';

const GuideTile = ({ link, title, color, icon }) => (
  <li className={`guide__tile guide__tile--${color}`}>
    <Link className="guide__section-link" to={link}>
      <span className="guide__icon-wrapper">
        <Icon name={icon} />
      </span>
      {title}
    </Link>
  </li>
);

const Guide = () => (
  <Switch>
    <Route
      exact
      path={ROUTES.GUIDE}
      render={() => (
        <Main
          classes={{ main: 'guide', title: 'guide__heading' }}
          title="Getting started with Workflow"
        >
          <p className="guide__intro">
            Learn the basics of using Workflow to manage your projects.
          </p>
          <ul className="guide__grid">
            <GuideTile
              color="primary"
              title="Features"
              link={ROUTES.FEATURES}
              icon="star"
            />
            <GuideTile
              color="secondary"
              title="Fundamentals"
              link={ROUTES.FUNDAMENTALS}
              icon="book-open"
            />
            <GuideTile
              color="tertiary"
              title="How to..."
              link={ROUTES.HOW_TO}
              icon="crosshair"
            />
          </ul>
        </Main>
      )}
    />
    <Route path={ROUTES.HOW_TO} component={HowTo} />
    <Route path={ROUTES.FEATURES} component={Features} />
    <Route path={ROUTES.FUNDAMENTALS} component={Fundamentals} />
  </Switch>
);
export default withRouter(Guide);
