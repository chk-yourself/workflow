import * as types from './types';
import firebase from '../../store/firebase';
import {
  loadTasksById,
  addTask,
  removeTask,
  updateTask
} from '../tasks/actions';
import { updateUser } from '../users/actions';

export const setCurrentUser = currentUser => {
  return {
    type: types.SET_CURRENT_USER,
    currentUser
  };
};

export const setTempTaskSettings = ({ view, sortBy }) => {
  return {
    type: types.SET_TEMP_TASK_SETTINGS,
    view,
    sortBy
  };
};

export const loadUserTags = tags => {
  return {
    type: types.LOAD_USER_TAGS,
    tags
  };
};

export const loadAssignedTasks = assignedTasks => {
  return {
    type: types.LOAD_ASSIGNED_TASKS,
    assignedTasks
  };
};


export const addAssignedTask = taskId => {
  return {
    type: types.ADD_ASSIGNED_TASK,
    taskId
  };
};

export const removeAssignedTask = taskId => {
  return {
    type: types.REMOVE_ASSIGNED_TASK,
    taskId
  };
};

export const fetchCurrentUserData = userId => {
  return async dispatch => {
    try {
      const currentUser = await firebase
        .getDocRef('users', userId)
        .get()
        .then(doc => doc.data());
      dispatch(setCurrentUser(currentUser));
    } catch (error) {
      console.log(error);
    }
  };
};

export const fetchUserTags = userId => {
  return async dispatch => {
    try {
      const userTags = await firebase
        .getDocRef('users', userId)
        .collection('tags')
        .get()
        .then(snapshot => {
          const tags = {};
          snapshot.forEach(doc => {
            tags[doc.id] = doc.data();
          });
          return tags;
        });
      dispatch(loadUserTags(userTags));
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
        .getDocRef('users', userId)
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

export const removeFolder = folderId => {
  return {
    type: types.REMOVE_FOLDER,
    folderId
  };
};

export const deleteFolder = ({userId, folderId}) => {
  return async dispatch => {
    try {
      await firebase.getDocRef('users', userId, 'folders', folderId).delete();
      dispatch(removeFolder(folderId));
    } catch (error) {
      console.error(error);
    }
  }
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

export const createTag = ({ tagId, tagData }) => {
  return {
    type: types.CREATE_TAG,
    tagId,
    tagData
  };
};

export const updateTag = ({ tagId, tagData }) => {
  return {
    type: types.UPDATE_TAG,
    tagId,
    tagData
  };
};

export const deleteTag = name => {
  return {
    type: types.DELETE_TAG,
    name
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

export const syncTasksDueWithinDays = (userId, days) => {
  const startingDate = new Date();
  const timeStart = new Date(startingDate.setHours(0, 0, 0, 0));
  const endingDate = new Date(startingDate);
  const timeEnd = new Date(endingDate.setDate(endingDate.getDate() + days));

  return async dispatch => {
    try {
      const subscription = await firebase.db
        .collection('tasks')
        .where('assignedTo', 'array-contains', userId)
        .where('dueDate', '<=', timeEnd)
        .orderBy('dueDate', 'asc')
        .onSnapshot(async snapshot => {
          const changes = snapshot.docChanges();
          const isInitialLoad = changes.every(change => change.type === 'added');
          
          if (isInitialLoad) {
            const tasks = {};
          changes.forEach(change => {
            const taskId = change.doc.id;
            const taskData = change.doc.data();
            const { subtaskIds, commentIds } = taskData;
            tasks[taskId] = {
              isLoaded: {
                subtasks: subtaskIds.length === 0,
                comments: commentIds.length === 0
              },
              taskId,
              ...taskData
            };
          });
          dispatch(loadTasksDueSoon(tasks));
          dispatch(loadTasksById(tasks));
          } else {
            changes.forEach(change => {
              const taskId = change.doc.id;
              const taskData = change.doc.data();
              if (change.type === 'added') {
                dispatch(addTaskDueSoon({ taskId, taskData }));
              } else if (change.type === 'removed') {
                dispatch(removeTaskDueSoon(taskId));
              } else {
                dispatch(updateTaskDueSoon({ taskId, taskData }));
              }
            });
          }
        });
      return subscription;
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

export const removeTaskDueSoon = taskId => {
  return {
    type: types.REMOVE_TASK_DUE_SOON,
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

export const syncFolders = userId => {
  return async (dispatch, getState) => {
    try {
      const subscription = await firebase
        .getDocRef('users', userId)
        .collection('folders')
        .onSnapshot(async snapshot => {
          const changes = snapshot.docChanges();
          const isInitialLoad = changes.every(change => change.type === 'added');
          if (isInitialLoad) {
            const foldersById = {};
            snapshot.forEach(doc => {
            foldersById[doc.id] = {
              folderId: doc.id,
              ...doc.data()
            };
          });
            await dispatch(loadFolders(foldersById));
          } else {
            changes.forEach(async change => {
              const [folderId, folderData, changeType] = await Promise.all([
                change.doc.id,
                change.doc.data(),
                change.type
              ]);
              const { folders } = getState().currentUser;
              if (changeType === 'added') {
                if (folderId in folders) return;
                dispatch(addFolder({ folderId, folderData }));
                console.log('folder added');
              } else if (changeType === 'removed') {
                if (!change.doc.exists && folderId in folders) {
                  dispatch(removeFolder(folderId));
                }
              } else {
                if (folderData.taskIds.length === 0 && !['0', '1', '2', '3', '4', '5'].includes(folderId)) {
                  dispatch(deleteFolder({userId, folderId}));
                } else {
                  dispatch(updateFolder({ folderId, folderData }));
                  console.log(`Updated Folder: ${folderData.name}`);
                }
              }
            });
          }
        });
      return subscription;
    } catch (error) {
      console.log(error);
    }
  };
};

/*
export const createTag = ({ userId, taskId, name }) => {
  return async (dispatch, getState) => {
    try {
      await firebase.addTag({ taskId, userId, name, projectId, color, projectCount, userCount});
            const { tags } = getState().currentUser;
           if (changeType === 'added') {
             console.log(tags);
              dispatch(addTag({ tagId, tagData }));
              console.log('tag added');
            } else if (changeType === 'removed') {
              dispatch(removeTag(tagId));
            } else {
              dispatch(updateTag({ tagId, tagData }));
              console.log(`Updated Tag: ${tagData.name}`);
            }
          });
        });
    } catch (error) {
      console.log(error);
    }
  };
};
*/


export const syncUserTags = userId => {
  return async (dispatch, getState) => {
    try {
      const subscription = await firebase
        .getDocRef('users', userId)
        .collection('tags')
        .onSnapshot(async snapshot => {
          const changes = await snapshot.docChanges();
          const isInitialLoad = changes.every(change => change.type === 'added');
          if (isInitialLoad) {
            const tags = {};
            snapshot.forEach(doc => {
              tags[doc.id] = doc.data();
            });
            await dispatch(loadUserTags(tags));
          } else {
          changes.forEach(async change => {
            const [tagId, tagData, changeType] = await Promise.all([
              change.doc.id,
              change.doc.data(),
              change.type
            ]);
            const { tags } = getState().currentUser;
           if (changeType === 'added') {
              if (tagId in tags) return;
              console.log( tagId, tagData);
              dispatch(createTag({ tagId, tagData }));
              console.log('tag added');
            } else if (changeType === 'removed') {
              dispatch(deleteTag(tagId));
            } else {
              dispatch(updateTag({ tagId, tagData }));
              console.log(`Updated Tag: ${tagData.name}`);
            }
          });
        };
      });
        return subscription;
    } catch (error) {
      console.log(error);
    }
  };
  };

export const syncUserTasks = userId => {
  return async (dispatch, getState) => {
    try {
      const subscription = await firebase
        .queryCollection('tasks', ['assignedTo', 'array-contains', userId])
        .onSnapshot(async snapshot => {
          const changes = snapshot.docChanges();
          const isInitialLoad = changes.every(change => change.type === 'added');
          if (isInitialLoad && changes.length > 1) {
            const tasksById = {};
            changes.forEach(change => {
            const taskId = change.doc.id;
            const taskData = change.doc.data();
            const { subtaskIds, commentIds } = taskData;
            tasksById[taskId] = {
              isLoaded: {
                subtasks: subtaskIds.length === 0,
                comments: commentIds.length === 0
              },
              taskId,
              ...taskData
            };
          });
            dispatch(loadTasksById(tasksById));
            dispatch(loadAssignedTasks(Object.keys(tasksById)));
          } else {
            changes.forEach(async change => {
              const [taskId, taskData, changeType] = await Promise.all([
                change.doc.id,
                change.doc.data(),
                change.type
              ]);
              if (changeType === 'added') {
                if (!(taskId in getState().tasksById)) {
                  dispatch(addTask({ taskId, taskData }));
                }
                dispatch(addAssignedTask(taskId));
                console.log('task added');
              } else if (changeType === 'removed') {
                const { listId } = taskData;
                dispatch(removeAssignedTask(taskId));
                if (taskId in getState().tasksById && !change.doc.exists) {
                  dispatch(removeTask({ taskId, listId }));
                }
              } else {
                dispatch(updateTask({ taskId, taskData }));
                console.log(`Updated Task: ${taskData.name}`);
              }
            });
          }
        });
        return subscription;
    } catch (error) {
      console.log(error);
    }
  };
};

export const syncCurrentUserData = userId => {
  return async (dispatch, getState) => {
    try {
      const subscription = await firebase.getDocRef('users', userId).onSnapshot(snapshot => {
        const userData = snapshot.data() || null;
        if (userData) {
          userData.tempSettings = {
            tasks: {...userData.settings.tasks}
          };
        }
        if (!getState().currentUser) {
          dispatch(setCurrentUser(userData));
        } else {
          dispatch(updateUser({ userId, userData }));
        }
      });
      return subscription;
    } catch (error) {
      console.error(error);
    }
  }
}