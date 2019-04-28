import React from 'react';
import { Main } from '../../components/Main';
import GuidePanel from './GuidePanel';
import './Guide.scss';

const HowTo = () => (
  <Main
    classes={{ main: 'how-to', title: 'how-to__heading' }}
    title="How to..."
  >
    <GuidePanel title="Create a project" />
    <GuidePanel title="Edit a project" />
    <GuidePanel title="Create a task" />
    <GuidePanel title="Edit a task" />
  </Main>
);
export default HowTo;
