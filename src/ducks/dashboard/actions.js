import * as types from './types';
import firebase from '../../store/firebase';

export const loadTasksDueSoon = tasksDueSoon => {
  return {
    type: types.LOAD_TASKS_DUE_SOON,
    tasksDueSoon
  };
};

export const fetchTasksDueWithinDays = (userId, days) => {
  const startingDate = new Date();
  const timeStart = new Date(startingDate.setHours(0, 0, 0, 0));
  const endingDate = new Date(startingDate);
  const timeEnd = new Date(endingDate.setDate(endingDate.getDate() + days));

  return async dispatch => {
    try {
      const tasksDueSoon = await firebase.db
        .collection('tasks')
        .where('assignedTo', 'array-contains', userId)
        .where('dueDate', '<=', timeEnd)
        .orderBy('dueDate', 'asc')
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
      dispatch(loadTasksDueSoon(tasksDueSoon));
    } catch (error) {
      console.log(error);
    }
  };
};

export const addTaskDueSoon = ({ taskId, taskData }) => {
  return {
    type: types.ADD_TASK_DUE_SOON,
    taskId,
    taskData
  };
};

export const deleteTaskDueSoon = taskId => {
  return {
    type: types.DELETE_TASK_DUE_SOON,
    taskId
  };
};

export const updateTaskDueSoon = ({ taskId, taskData }) => {
  return {
    type: types.UPDATE_TASK_DUE_SOON,
    taskId,
    taskData
  };
};
