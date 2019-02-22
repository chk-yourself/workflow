import * as types from './types';

const subtasksById = (state = {}, action) => {
  switch (action.type) {
    case types.LOAD_SUBTASKS_BY_ID: {
      const { subtasksById } = action;
      return {
        ...state,
        ...subtasksById
      };
    }
    case types.ADD_SUBTASK: {
      const { subtaskId, subtaskData } = action;
      return {
        ...state,
        [subtaskId]: {
          subtaskId,
          ...subtaskData
        }
      };
    }
    case types.DELETE_SUBTASK: {
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
    default:
      return state;
  }
};

export default subtasksById;
