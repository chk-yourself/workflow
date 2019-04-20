import * as types from './types';
import firebase from '../../store/firebase';
import {
  removeTask,
  removeTaskTag,
  setTaskLoadedState
} from '../tasks/actions';
import { setProjectLoadedState } from '../projects/actions';

export const loadListsById = listsById => {
  return {
    type: types.LOAD_LISTS_BY_ID,
    listsById
  };
};

export const updateList = ({ listId, listData }) => {
  return {
    type: types.UPDATE_LIST,
    listId,
    listData
  };
};

export const addList = ({ listId, listData }) => {
  return {
    type: types.ADD_LIST,
    listId,
    listData
  };
};

export const removeList = ({ listId, projectId }) => {
  return {
    type: types.REMOVE_LIST,
    listId,
    projectId
  };
};

// Thunks

// TODO: remove tags
export const deleteList = ({ listId, projectId }) => {
  return async (dispatch, getStore) => {
    try {
      const batch = firebase.createBatch();
      const listRef = firebase.getDocRef('lists', listId);
      const projectRef = firebase.getDocRef('projects', projectId);
      const { taskIds } = getStore().listsById[listId];
      const { tasksById } = getStore();
      // Delete list
      batch.delete(listRef);

      // Remove list id from project
      firebase.updateBatch(batch, projectRef, {
        listIds: firebase.removeFromArray(listId)
      });

      return batch
        .commit()
        .then(() => {
          if (taskIds.length > 0) {
            taskIds.forEach(async taskId => {
              const {
                assignedTo,
                folders,
                subtaskIds,
                commentIds,
                tags,
                projectId,
                dueDate,
                workspaceId
              } = tasksById[taskId];
              await firebase.deleteTask({
                taskId,
                assignedTo,
                folders,
                subtaskIds,
                commentIds,
                projectId,
                dueDate,
                workspaceId
              });
            });
          }
        })
        .catch(error => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  };
};

export const fetchListsById = projectId => {
  return async dispatch => {
    try {
      const listsById = await firebase.fs
        .collection('lists')
        .where('projectId', '==', projectId)
        .get()
        .then(snapshot => {
          const lists = {};
          snapshot.forEach(doc => {
            lists[doc.id] = {
              listId: doc.id,
              ...doc.data()
            };
          });
          return lists;
        });
      dispatch(loadListsById(listsById));
    } catch (error) {
      console.log(error);
    }
  };
};

export const fetchUserLists = userId => {
  return async dispatch => {
    try {
      const listsById = await firebase.fs
        .collection('lists')
        .where('userId', '==', userId)
        .get()
        .then(snapshot => {
          const lists = {};
          snapshot.forEach(doc => {
            lists[doc.id] = {
              listId: doc.id,
              ...doc.data()
            };
          });
          return lists;
        });
      dispatch(loadListsById(listsById));
    } catch (error) {
      console.log(error);
    }
  };
};

export const syncProjectLists = projectId => {
  return async (dispatch, getState) => {
    try {
      const subscription = await firebase
        .queryCollection('lists', ['projectId', '==', projectId])
        .onSnapshot(snapshot => {
          const changes = snapshot.docChanges();
          const { projectsById } = getState();
          const project = projectsById[projectId];
          const isInitialLoad =
            snapshot.size === changes.length &&
            changes.every(change => change.type === 'added');
          if (isInitialLoad) {
            const listsById = {};
            changes.forEach(change => {
              const listId = change.doc.id;
              const listData = change.doc.data();
              const { taskIds } = listData;
              listsById[listId] = {
                listId,
                ...listData
              };
              taskIds.forEach(taskId =>
                dispatch(setTaskLoadedState(taskId, 'subtasks'))
              );
            });
            dispatch(loadListsById(listsById));
            if (!project.isLoaded.lists) {
              dispatch(setProjectLoadedState(projectId, 'lists'));
            }
          } else {
            changes.forEach(async change => {
              const { listsById } = getState();
              const [listId, listData, changeType] = await Promise.all([
                change.doc.id,
                change.doc.data(),
                change.type
              ]);
              if (changeType === 'added') {
                if (listsById && listId in listsById) return;
                dispatch(addList({ listId, listData }));
                console.log(`List added: ${listData.name}`);
              } else if (changeType === 'removed') {
                if (!(listId in listsById)) return;
                dispatch(removeList({ listId, projectId }));
                console.log(`List deleted: ${listData.name}`);
              } else {
                dispatch(updateList({ listId, listData }));
                console.log(`List updated: ${listData.name}`);
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

export const createList = ({ projectId, name }) => {
  return async dispatch => {
    try {
      firebase.addList({ projectId, name });
    } catch (error) {
      console.log(error);
    }
  };
};
