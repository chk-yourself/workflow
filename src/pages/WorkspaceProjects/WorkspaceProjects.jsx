import React from 'react';
import { withAuthorization } from '../../components/Session';
import { Main } from '../../components/Main';
import { ProjectGrid } from '../../components/ProjectGrid';

const WorkspaceProjects = ({ openProjectComposer, activeWorkspace }) => (
  <Main
    title={`Projects in ${activeWorkspace.name}`}
    classes={{
      main: 'project-grid__container',
      title: 'project-grid__header'
    }}
  >
    <ProjectGrid openProjectComposer={openProjectComposer} />
  </Main>
);

const condition = (currentUser, activeWorkspace) =>
  !!currentUser && !!activeWorkspace;

export default withAuthorization(condition)(WorkspaceProjects);
