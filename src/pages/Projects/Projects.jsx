import React from 'react';
import { withAuthorization } from '../../components/Session';
import { Main } from '../../components/Main';
import { ProjectGrid } from '../../components/ProjectGrid';
import { Tabs } from '../../components/Tabs';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import './Projects.scss';

const Projects = ({
  openProjectComposer,
  currentUser,
  activeWorkspace,
  selectedTabIndex
}) => {
  useDocumentTitle(`${activeWorkspace.name} Projects - Workflow`);
  return (
    <Main
      title={`Projects in ${activeWorkspace.name}`}
      classes={{
        main: 'projects',
        title: 'projects__header'
      }}
    >
      <Tabs
        selectedIndex={selectedTabIndex}
        classes={{
          panel: 'projects__panel',
          tablist: 'projects__tablist',
          tab: 'projects__tab',
          header: 'projects__tabs-header',
          tabs: 'project__tabs'
        }}
        tabs={[
          {
            id: 'tabMyProjects',
            panelId: 'panelMyProjects',
            label: 'My Projects',
            content: (
              <ProjectGrid
                userId={currentUser.userId}
                openProjectComposer={openProjectComposer}
              />
            )
          },
          {
            id: 'tabAllProjects',
            panelId: 'panelAllProjects',
            label: 'All Projects',
            content: <ProjectGrid openProjectComposer={openProjectComposer} />
          }
        ]}
      />
    </Main>
  );
};

Projects.defaultProps = {
  selectedTabIndex: 0
};

const condition = (currentUser, activeWorkspace) => !!currentUser && !!activeWorkspace;

export default withAuthorization(condition)(Projects);
