import * as types from './types';
import firebase from '../../store/firebase';

export const setCurrentUser = currentUser => {
  return {
    type: types.SET_CURRENT_USER,
    currentUser
  };
};

export const fetchCurrentUserData = userId => {
  return async dispatch => {
    try {
      const currentUser = await firebase
        .getDocRef(`users/${userId}`)
        .get()
        .then(doc => doc.data());
      dispatch(setCurrentUser(currentUser));
    } catch (error) {
      console.log(error);
    }
  };
};

export const loadFolders = folders => {
  return {
    type: types.LOAD_FOLDERS,
    folders
  };
};

export const fetchFolders = userId => {
  return async dispatch => {
    try {
      const folders = await firebase
        .getDocRef(`users/${userId}`)
        .collection('folders')
        .get()
        .then(snapshot => {
          const foldersById = {};
          snapshot.forEach(doc => {
            foldersById[doc.id] = {
              folderId: doc.id,
              ...doc.data()
            };
          });
          return foldersById;
        });
      dispatch(loadFolders(folders));
    } catch (error) {
      console.log(error);
    }
  };
};

export const addFolder = ({ folderId, folderData }) => {
  return {
    type: types.ADD_FOLDER,
    folderId,
    folderData
  };
};

export const updateFolder = ({ folderId, folderData }) => {
  return {
    type: types.UPDATE_FOLDER,
    folderId,
    folderData
  };
};

export const deleteFolder = folderId => {
  return {
    type: types.DELETE_FOLDER,
    folderId
  };
};

export const reorderFolders = (userId, folderIds) => {
  return {
    type: types.REORDER_FOLDERS,
    userId,
    folderIds
  };
};

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
