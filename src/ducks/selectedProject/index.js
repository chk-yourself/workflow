import { RESET_ACTIVE_WORKSPACE } from '../activeWorkspace/types';

export const SELECT_PROJECT = 'SELECT_PROJECT';

export const selectProject = projectId => {
  return {
    type: SELECT_PROJECT,
    projectId
  };
};

const INITIAL_STATE = null;

export const selectedProject = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SELECT_PROJECT:
      return action.projectId;
    case RESET_ACTIVE_WORKSPACE:
      return INITIAL_STATE;
    default:
      return state;
  }
};

export const getSelectedProjectId = state => state.selectedProject;

export const getSelectedProject = state => {
  const { selectedProject: projectId, projectsById } = state;
  return projectsById[projectId];
};
