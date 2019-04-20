import { RESET_ACTIVE_WORKSPACE } from '../activeWorkspace/types';

export const SELECT_TASK = 'SELECT_TASK';

export const selectTask = taskId => {
  return {
    type: SELECT_TASK,
    taskId
  };
};

const INITIAL_STATE = null;

export const selectedTask = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SELECT_TASK:
      return action.taskId;
    case RESET_ACTIVE_WORKSPACE:
      return INITIAL_STATE;
    default:
      return state;
  }
};

export const getSelectedTaskId = state => state.selectedTask;

export const getSelectedTask = state => {
  const { selectedTask: taskId, tasksById } = state;
  if (!tasksById || !taskId) return null;
  return tasksById[taskId];
};
