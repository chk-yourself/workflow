import React, { memo } from 'react';
import { Settings } from '../../components/Settings';

const TaskSettings = ({
  isVisible,
  onToggle,
  onClose,
  onSave,
  onChange,
  view,
  sortBy
}) => {
  return (
    <Settings
      ariaLabel="Toggle task settings menu"
      icon="sliders"
      isActive={isVisible}
      onToggle={onToggle}
      onClose={onClose}
      onSave={onSave}
      classes={{
        wrapper: 'user-tasks__settings-wrapper',
        settings: 'user-tasks__settings'
      }}
      settings={[
        {
          label: 'View',
          name: 'view',
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
          label: 'Sort By',
          name: 'sortBy',
          type: 'select',
          options: {
            folder: { value: 'folder', label: 'Folder' },
            dueDate: { value: 'dueDate', label: 'Due Date' },
            project: { value: 'project', label: 'Project' }
          },
          selected: sortBy,
          onChange
        }
      ]}
    />
  );
};

export default memo(TaskSettings);
