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
    case types.ADD_PROJECT: {
      const { projectId, projectData } = action;
      const { listIds } = projectData;
      const listCount = listIds.length;
      return {
        ...state,
        [projectId]: {
          projectId,
          isLoaded: {
            subtasks: listCount === 0,
            tasks: listCount === 0,
            lists: listCount === 0
          },
          ...projectData
        }
      };
    }
    case types.REMOVE_PROJECT: {
      const { projectId } = action;
      const { [projectId]: deletedProject, ...restOfProjects } = state;
      return restOfProjects;
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
    case types.SET_PROJECT_LOADED_STATE: {
      const { projectId, key } = action;
      return {
        ...state,
        [projectId]: {
          ...state[projectId],
          isLoaded: {
            ...state[projectId].isLoaded,
            [key]: true
          }
        }
      };
    }
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
