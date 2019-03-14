import * as types from './types';
import { ADD_LIST, REMOVE_LIST } from '../lists/types';

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
      return {
        ...state,
        [projectId]: {
          projectId,
          isLoaded: {
            subtasks: false,
            tasks: false,
            lists: false
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
    case ADD_LIST: {
      const { listId, listData } = action;
      const { projectId } = listData;
      return {
        ...state,
        [projectId]: {
          ...state[projectId],
          listIds: [...state[projectId].listIds, listId]
        }
      };
    }
    case REMOVE_LIST: {
      const { listId, projectId } = action;
      return {
        ...state,
        [projectId]: {
          ...state[projectId],
          listIds: state[projectId].listIds.filter(id => id !== listId)
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
