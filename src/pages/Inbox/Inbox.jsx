import React from 'react';
import { connect } from 'react-redux';
import { withAuthorization } from '../../components/Session';
import { getSelectedTask } from '../../ducks/selectedTask';
import { Main } from '../../components/Main';
import { TaskEditor } from '../../components/TaskEditor';
import { Tabs } from '../../components/Tabs';
import { Notifications } from '../../components/Notifications';
import './Inbox.scss';

const Inbox = ({ selectedTask }) => {
  const isTaskEditorOpen = !!selectedTask;
  return (
    <Main
      title="Inbox"
      classes={{
        main: `inbox ${isTaskEditorOpen ? 'show-task-editor' : ''}`,
        title: 'inbox__title'
      }}
    >
      <div className="inbox__wrapper">
        <Tabs
          classes={{
            panel: 'inbox__panel',
            tabs: 'inbox__tabs',
            header: 'inbox__tabs-header'
          }}
          tabs={[
            {
              id: 'tabActivity',
              panelId: 'panelActivity',
              label: 'Activity',
              content: <Notifications isActive />
            },
            {
              id: 'tabArchive',
              panelId: 'panelArchive',
              label: 'Archive',
              content: <Notifications isActive={false} />
            }
          ]}
        />
        {isTaskEditorOpen && (
          <TaskEditor {...selectedTask} layout="list" key={selectedTask.taskId} />
        )}
      </div>
    </Main>
  );
};

const mapStateToProps = state => {
  return {
    selectedTask: getSelectedTask(state)
  };
};

const condition = (currentUser, activeWorkspace) => !!currentUser && !!activeWorkspace;

export default withAuthorization(condition)(connect(mapStateToProps)(Inbox));
