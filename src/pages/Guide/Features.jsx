import React from 'react';
import { Main } from '../../components/Main';
import GuidePanel from './GuidePanel';
import './Guide.scss';

const Features = () => (
  <Main
    classes={{ main: 'features', title: 'features__heading' }}
    title="Features"
  >
    <GuidePanel title="Create a project" />
    <GuidePanel title="Edit a project" />
    <GuidePanel title="Create a task" />
    <GuidePanel title="Edit a task" />
  </Main>
);
export default Features;
