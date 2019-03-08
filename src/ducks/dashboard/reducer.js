import * as types from './types';

const INITIAL_STATE = {
  tasksDueSoon: {}
};

const dashboard = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.LOAD_TASKS_DUE_SOON: {
      const { tasksDueSoon } = action;
      return {
        ...state,
        tasksDueSoon
      };
    }
    case types.ADD_TASK_DUE_SOON: {
      const { taskId, taskData } = action;
      return {
        ...state,
        tasksDueSoon: {
          ...state.tasksDueSoon,
          [taskId]: {
            taskId,
            ...taskData
          }
        }
      };
    }
    case types.DELETE_TASK_DUE_SOON: {
      const { taskId } = action;
      const { [taskId]: deletedTask, ...restOfTasks } = state.tasksDueSoon;
      return {
        ...state,
        tasksDueSoon: restOfTasks
      };
    }
    case types.UPDATE_TASK_DUE_SOON: {
      const { taskId, taskData } = action;
      return {
        ...state,
        tasksDueSoon: {
          ...state.tasksDueSoon,
          [taskId]: {
            ...state[taskId],
            ...taskData
          }
        }
      };
    }
    default:
      return state;
  }
};

export default dashboard;
