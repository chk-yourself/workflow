import React, { memo } from 'react';
import { Settings } from '../Settings';

const ProjectSettings = ({
  isActive,
  onToggle,
  onClose,
  onSave,
  onChange,
  view,
  sortBy,
  layout
}) => {
  return (
    <Settings
      icon="sliders"
      ariaLabel="Toggle project settings menu"
      isActive={isActive}
      onToggle={onToggle}
      onClose={onClose}
      onSave={onSave}
      classes={{
        wrapper: 'project__settings-wrapper',
        settings: 'project__settings',
        button: 'project__settings-btn'
      }}
      settings={[
        {
          name: 'view',
          label: 'View',
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
          onChange
        },
        {
          name: 'sortBy',
          label: 'Sort By',
          type: 'select',
          options: {
            none: { value: 'none', label: 'None' },
            dueDate: { value: 'dueDate', label: 'Due Date' }
          },
          selected: sortBy,
          onChange
        },
        {
          name: 'layout',
          label: 'Layout',
          type: 'select',
          options: {
            board: { value: 'board', label: 'Board' },
            list: { value: 'list', label: 'List' }
          },
          selected: layout,
          onChange
        }
      ]}
    />
  );
};

export default memo(ProjectSettings);
