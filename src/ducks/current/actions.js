import * as types from './types';
import firebase from '../../store/firebase';

export const selectUser = userId => {
  return {
    type: types.SELECT_USER,
    userId
  };
};

export const selectProject = projectId => {
  return {
    type: types.SELECT_PROJECT,
    projectId
  };
};

export const selectList = listId => {
  return {
    type: types.SELECT_LIST,
    listId
  };
};

export const selectTask = taskId => {
  return {
    type: types.SELECT_TASK,
    taskId
  };
};
