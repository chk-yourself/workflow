import * as types from './types';
import { RESET_ACTIVE_WORKSPACE } from '../activeWorkspace/types';

const INITIAL_STATE = null;

const projectsById = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.LOAD_PROJECTS_BY_ID: {
      const { projectsById } = action;
      return {
        ...(state && state),
        ...projectsById
      };
    }
    case types.ADD_PROJECT: {
      const { projectId, projectData } = action;
      const { listIds, settings, isDuplicate } = projectData;
      const listCount = listIds.length;
      return {
        ...(state && state),
        [projectId]: {
          projectId,
          isLoaded: {
            subtasks: !isDuplicate && listCount === 0,
            tasks: listCount === 0,
            lists: !isDuplicate && listCount === 0,
            tags: !isDuplicate && listCount === 0
          },
          tempSettings: {
            tasks: { ...settings.tasks }
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
    case types.LOAD_PROJECT_TAGS: {
      const { projectId, tags } = action;
      return {
        ...state,
        [projectId]: {
          ...state[projectId],
          tags
        }
      };
    }
    case types.CREATE_TAG: {
      const { tagId, tagData, projectId } = action;
      if (!projectId) return state;
      return {
        ...state,
        [projectId]: {
          ...state[projectId],
          tags: {
            ...state[projectId].tags,
            [tagId]: tagData
          }
        }
      };
    }
    case types.DELETE_TAG: {
      const { tagId, projectId } = action;
      if (!projectId) return state;
      const { [tagId]: deletedTag, ...restOfTags } = state[projectId].tags;
      return {
        ...state,
        [projectId]: {
          ...state[projectId],
          tags: restOfTags
        }
      };
    }
    case types.UPDATE_TAG: {
      const { tagId, tagData, projectId } = action;
      if (!projectId) return state;
      return {
        ...state,
        [projectId]: {
          ...state[projectId],
          tags: {
            ...state[projectId].tags,
            [tagId]: {
              ...state[projectId].tags[tagId],
              ...tagData
            }
          }
        }
      };
    }
    case types.SET_TEMP_PROJECT_SETTINGS: {
      const { projectId, view, sortBy, layout } = action;
      return {
        ...state,
        [projectId]: {
          ...state[projectId],
          tempSettings: {
            ...state[projectId].tempSettings,
            layout: layout || state[projectId].tempSettings.layout,
            tasks: {
              ...state[projectId].tempSettings.tasks,
              view: view || state[projectId].tempSettings.tasks.view,
              sortBy: sortBy || state[projectId].tempSettings.tasks.sortBy
            }
          }
        }
      };
    }
    case RESET_ACTIVE_WORKSPACE: {
      return INITIAL_STATE;
    }
    default:
      return state;
  }
};

export default projectsById;
