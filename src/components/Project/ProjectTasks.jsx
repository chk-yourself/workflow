import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Toolbar } from '../Toolbar';
import { Button } from '../Button';

const ProjectTasks = () => {
  return (
    <>
      <Toolbar className="project__toolbar">
        {layout === 'list' && (
          <Button
            className="project__btn project__btn--add-list"
            onClick={this.activateListComposer}
            color="primary"
            variant="contained"
            size="sm"
          >
            Add List
          </Button>
        )}
        <MemberAssigner
          placeholder="Add or remove member"
          memberIds={memberIds}
          onSelectMember={this.handleMembership}
          classes={{
            memberAssigner: 'project__member-assigner',
            avatar: 'project__avatar',
            button: 'project__btn--add-member'
          }}
          align="right"
          showOnlineStatus
          isMemberSearchDisabled={isPrivate}
        />
        <Settings
          icon="sliders"
          isActive={isProjectSettingsActive}
          onToggle={this.toggleSettingsMenu}
          onClose={this.closeSettingsMenu}
          onSave={this.saveProjectSettings}
          classes={{
            wrapper: 'project__settings-wrapper',
            settings: 'project__settings',
            button: 'project__settings-btn'
          }}
          settings={[
            {
              name: 'View',
              key: 'view',
              type: 'radio',
              options: {
                active: { value: 'active', label: 'Active Tasks' },
                completed: {
                  value: 'completed',
                  label: 'Completed Tasks'
                },
                all: { value: 'all', label: 'All Tasks' }
              },
              value: view,
              onChange: this.setTempProjectSettings
            },
            {
              name: 'Sort By',
              key: 'sortBy',
              type: 'select',
              options: {
                none: { value: 'none', label: 'None' },
                dueDate: { value: 'dueDate', label: 'Due Date' }
              },
              selected: sortBy,
              onChange: this.setTempProjectSettings
            },
            {
              name: 'Layout',
              key: 'layout',
              type: 'select',
              options: {
                board: { value: 'board', label: 'Board' },
                list: { value: 'list', label: 'List' }
              },
              selected: layout,
              onChange: this.setTempProjectSettings
            }
          ]}
        />
      </Toolbar>
      <Droppable
        droppableId={projectId}
        type={droppableTypes.LIST}
        direction={layout === 'board' ? 'horizontal' : 'vertical'}
      >
        {provided => (
          <div className="project__lists" ref={provided.innerRef}>
            {children}
            {provided.placeholder}
            <ListComposer
              inputRef={this.setInputRef}
              onToggle={this.toggleListComposer}
              isActive={isListComposerActive}
              layout={layout}
              projectId={projectId}
            />
          </div>
        )}
      </Droppable>
    </>
  );
};

export default ProjectTasks;
