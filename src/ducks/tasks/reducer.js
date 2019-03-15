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
    case types.LOAD_PROJECT_TASKS: {
      const { tasks } = action;
      return {
        ...state,
        ...tasks
      };
    }
    case types.UPDATE_TASKS_BY_ID: {
      const { task } = action;
      console.log('tasks updated');
      return {
        ...state,
        ...task
      };
    }
    case types.ADD_TASK: {
      const { taskId, taskData } = action;
      return {
        ...state,
        [taskId]: {
          taskId,
          isLoaded: {
            subtasks: false,
            comments: false
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
    default:
      return state;
  }
};

export default tasksById;
