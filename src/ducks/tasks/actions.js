import * as types from './types';
import firebase from '../../store/firebase';

export const loadTasksById = tasksById => {
  return {
    type: types.LOAD_TASKS_BY_ID,
    tasksById
  };
};

export const fetchTasksById = () => {
  return async dispatch => {
    try {
      const tasksById = await firebase.db
        .collection('tasks')
        .get()
        .then(snapshot => {
          const tasks = {};
          snapshot.forEach(doc => {
            tasks[doc.id] = {
              taskId: doc.id,
              ...doc.data()
            };
          });
          return tasks;
        });
      dispatch(loadTasksById(tasksById));
    } catch (error) {
      console.log(error);
    }
  };
};

export const updateTasksById = task => {
  return {
    type: types.UPDATE_TASKS_BY_ID,
    task
  };
};

export const fetchCardTasks = boardId => {
  return async dispatch => {
    try {
      const tasksById = await firebase.db
        .collection('tasks')
        .where('boardId', '==', boardId)
        .get()
        .then(snapshot => {
          const tasks = {};
          snapshot.forEach(doc => {
            tasks[doc.id] = {
              taskId: doc.id,
              ...doc.data()
            };
          });
          return tasks;
        });
      dispatch(loadTasksById(tasksById));
    } catch (error) {
      console.log(error);
    }
  };
};

export const fetchUserTasks = userId => {
  return async dispatch => {
    try {
      const tasksById = await firebase.db
        .collection('tasks')
        .where('assignedTo', 'array-contains', userId)
        .get()
        .then(snapshot => {
          const tasks = {};
          snapshot.forEach(doc => {
            tasks[doc.id] = {
              taskId: doc.id,
              ...doc.data()
            };
          });
          return tasks;
        });
      dispatch(loadTasksById(tasksById));
    } catch (error) {
      console.log(error);
    }
  };
};

export const addTask = ({ taskId, taskData }) => {
  return {
    type: types.ADD_TASK,
    taskId,
    taskData
  };
};

export const deleteTask = taskId => {
  return {
    type: types.DELETE_TASK,
    taskId
  };
};

export const updateTask = ({ taskId, taskData }) => {
  return {
    type: types.UPDATE_TASK,
    taskId,
    taskData
  };
};