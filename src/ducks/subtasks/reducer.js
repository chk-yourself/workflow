import * as types from './types';
import { RESET_ACTIVE_WORKSPACE } from '../activeWorkspace/types';

const INITIAL_STATE = null;

const subtasksById = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.LOAD_SUBTASKS_BY_ID: {
      const { subtasksById } = action;
      return {
        ...(state && state),
        ...subtasksById
      };
    }
    case types.ADD_SUBTASK: {
      const { subtaskId, subtaskData } = action;
      return {
        ...(state && state),
        [subtaskId]: {
          subtaskId,
          isLoaded: true,
          ...subtaskData
        }
      };
    }
    case types.REMOVE_SUBTASK: {
      const { subtaskId } = action;
      const { [subtaskId]: deletedSubtask, ...restOfSubtasks } = state;
      return restOfSubtasks;
    }
    case types.UPDATE_SUBTASK: {
      const { subtaskId, subtaskData } = action;
      return {
        ...state,
        [subtaskId]: {
          ...state[subtaskId],
          ...subtaskData
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

export default subtasksById;
