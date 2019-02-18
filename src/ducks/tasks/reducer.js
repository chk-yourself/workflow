import * as types from './types';

const tasksById = (state = {}, action) => {
  switch (action.type) {
    case types.LOAD_TASKS_BY_ID: {
      const { tasksById } = action;
      return {
        ...state,
        ...tasksById
      };
    }
    case types.ADD_TASK: {
      const { taskId, taskData } = action;
      return {
        ...state,
        [taskId]: {
          taskId,
          ...taskData
        }
      };
    }
    case types.DELETE_TASK: {
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
    default:
      return state;
  }
};

export default tasksById;
