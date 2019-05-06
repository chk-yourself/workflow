import React from 'react';
import { withAuthorization } from '../../components/Session';
import { Main } from '../../components/Main';
import { ProjectGrid } from '../../components/ProjectGrid';
import { TabsContainer } from '../../components/Tabs';
import './Projects.scss';

const Projects = ({
  openProjectComposer,
  currentUser,
  activeWorkspace,
  selectedTabIndex
}) => (
  <Main
    title={`Projects in ${activeWorkspace.name}`}
    classes={{
      main: 'projects',
      title: 'projects__header'
    }}
  >
    <TabsContainer
      selectedIndex={selectedTabIndex}
      classes={{
        panel: 'projects__panel',
        tabs: 'projects__tabs',
        tab: 'projects__tab',
        header: 'projects__tabs-header',
        container: 'projects__tabs-container'
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

Projects.defaultProps = {
  selectedTabIndex: 0
};

const condition = (currentUser, activeWorkspace) =>
  !!currentUser && !!activeWorkspace;

export default withAuthorization(condition)(Projects);
