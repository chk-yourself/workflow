import * as types from './types';

const current = (state = {}, action) => {
  switch (action.type) {
    case types.SELECT_USER: {
      const { userId } = action;
      return {
        ...state,
        userId
      };
    }
    case types.SELECT_PROJECT: {
      const { projectId } = action;
      return {
        ...state,
        projectId
      };
    }
    case types.SELECT_LIST: {
      const { listId } = action;
      return {
        ...state,
        listId
      };
    }
    case types.SELECT_TASK: {
      const { taskId } = action;
      return {
        ...state,
        taskId
      };
    }
    default:
      return state;
  }
};

export { current };
