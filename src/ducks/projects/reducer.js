import * as types from './types';

const projectsById = (state = {}, action) => {
  switch (action.type) {
    case types.LOAD_PROJECTS_BY_ID: {
      const { projectsById } = action;
      return {
        ...state,
        ...projectsById
      };
    }
    case types.LOAD_PROJECT: {
      const { projectId, projectData } = action;
      return {
        ...state,
        [projectId]: {
          projectId,
          ...projectData
        }
      };
    }
    case types.UPDATE_PROJECT: {
      const { projectId, projectData } = action;
      return {
        ...state,
        [projectId]: {
          ...state[projectId],
          ...projectData
        }
      };
    }
    case types.UPDATE_LIST_IDS:
    case types.REORDER_LISTS: {
      const { projectId, listIds } = action;
      return {
        ...state,
        [projectId]: {
          ...state[projectId],
          listIds
        }
      };
    }
    case types.UPDATE_PROJECT_TAGS: {
      const { projectId, tags } = action;
      return {
        ...state,
        [projectId]: {
          ...state[projectId],
          tags: {
            ...tags
          }
        }
      };
    }
    default:
      return state;
  }
};

export default projectsById;
