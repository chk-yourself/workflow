import * as types from './types';
import firebase from '../../store/firebase';
import { utils } from '../../utils';

export const loadTasksById = tasksById => {
  return {
    type: types.LOAD_TASKS_BY_ID,
    tasksById
  };
};

export const loadUserTasks = (userId, tasksById) => {
  return {
    type: types.LOAD_USER_TASKS,
    userId,
    tasksById
  };
};

export const fetchProjectTasks = projectId => {
  return async dispatch => {
    try {
      const tasksById = await firebase.db
        .collection('tasks')
        .where('projectId', '==', projectId)
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

const handleInitialPayload = async (snapshot) => {
          const tasks = await snapshot.docChanges().map(change => {
            tasks[change.doc.id] = {
              taskId: change.doc.id,
              ...change.doc.data()
            };
          });
          console.log(tasks);
          return tasks;
}



const syncTasks = (snapshot) => {
  snapshot.docChanges().forEach(change => {
    const taskId = change.doc.id;
    const taskData = change.doc.data();
    if (change.type === 'added') {
      console.log('added task');
      return dispatch => {
        dispatch(addTask({ taskId, taskData }));
      }
    } else if (change.type === 'removed') {
      return dispatch => {
        dispatch(deleteTask(taskId));
      }
    } else {
      return dispatch => {
        dispatch(updateTask({ taskId, taskData }));
      }
    }
  });
};

let count = 0;
const handleTaskSubscription = (snapshot) => {
  count++;
  const initialLoad = count === 1;
  const tasks = {};
    if (initialLoad) {
      console.log('is initial load');

      snapshot.docChanges().forEach(change => {
        tasks[change.doc.id] = {
          taskId: change.doc.id,
          ...change.doc.data()
        };
      });
      console.log(tasks);
      return tasks;
    } else {
      snapshot.docChanges().forEach(change => {
        const taskId = change.doc.id;
        const taskData = change.doc.data();
        if (change.type === 'added') {
          console.log('added task');
          return dispatch => {
            dispatch(addTask({ taskId, taskData }));
          }
        } else if (change.type === 'removed') {
          return dispatch => {
            dispatch(deleteTask(taskId));
          }
        } else {
          return dispatch => {
            dispatch(updateTask({ taskId, taskData }));
          }
        }
      });
    }
}

/*const handleTaskSubscription = utils.firstThen(handleInitialPayload, syncTasks);*/

export const syncUserTasks = userId => {
  return async dispatch => {
    try {
      const tasksById = await firebase.db
        .collection('tasks')
        .where('assignedTo', 'array-contains', userId)
        .onSnapshot(handleTaskSubscription);
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

export const updateTasksById = task => {
  return {
    type: types.UPDATE_TASKS_BY_ID,
    task
  };
};

export const addTag = (taskId, tag) => {
  return {
    type: types.ADD_TAG,
    taskId,
    tag
  };
};
