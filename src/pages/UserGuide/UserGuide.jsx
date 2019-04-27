import React from 'react';
import { Main } from '../../components/Main';
import UserGuidePanel from './UserGuidePanel';
import './UserGuide.scss';

const UserGuide = () => (
  <Main
    classes={{ main: 'user-guide', title: 'user-guide__heading' }}
    title="Workflow Guide"
  />
);
export default UserGuide;
