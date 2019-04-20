import * as types from './types';
import { RESET_ACTIVE_WORKSPACE } from '../activeWorkspace/types';

const INITIAL_STATE = null;

const tasksById = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.LOAD_TASKS_BY_ID: {
      const { tasksById } = action;
      return {
        ...(state && state),
        ...tasksById
      };
    }
    case types.ADD_TASK: {
      const { taskId, taskData } = action;
      return {
        ...(state && state),
        [taskId]: {
          taskId,
          isLoaded: {
            subtasks: true,
            comments: true
          },
          ...taskData
        }
      };
    }
    case types.REMOVE_TASK: {
      const { taskId } = action;
      const { [taskId]: deletedTask, ...restOfTasks } = state;
      return restOfTasks;
    }
    case types.UPDATE_TASK: {
      const { taskId, taskData } = action;
      return {
        ...state,
        [taskId]: {
          ...state[taskId],
          ...taskData
        }
      };
    }
    case types.ADD_TAG: {
      const { taskId, tag } = action;
      return {
        ...state,
        [taskId]: {
          ...state[taskId],
          tags: [...state[taskId].tags, tag]
        }
      };
    }
    case types.REMOVE_TAG: {
      const { taskId, name } = action;
      if (!taskId || !(taskId in state)) return state;
      return {
        ...state,
        [taskId]: {
          ...state[taskId],
          tags: state[taskId].tags.filter(tag => tag !== name)
        }
      };
    }
    case types.SET_TASK_LOADED_STATE: {
      const { taskId, key } = action;
      return {
        ...state,
        [taskId]: {
          ...state[taskId],
          isLoaded: {
            ...state[taskId].isLoaded,
            [key]: true
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

export default tasksById;
