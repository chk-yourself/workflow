import React from 'react';
import { Main } from '../../components/Main';
import GuidePanel from './GuidePanel';
import './Guide.scss';

const Fundamentals = () => (
  <Main
    classes={{ main: 'fundamentals', title: 'fundamentals__heading' }}
    title="Fundamentals"
  >
    <GuidePanel title="Navigating Workflow" />
    <GuidePanel title="Home Page" />
    <GuidePanel title="My Tasks" />
    <GuidePanel title="Search" />
  </Main>
);
export default Fundamentals;
