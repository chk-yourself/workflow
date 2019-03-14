import * as types from './types';
import firebase from '../../store/firebase';
import { removeTask, removeTaskTag } from '../tasks/actions';

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
  console.log(listId, listData);
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
          dispatch(removeList({ listId, projectId }));
          if (taskIds.length > 0) {
            taskIds.forEach(async taskId => {
              const { assignedTo, folders, subtaskIds, commentIds, tags } = tasksById[
                taskId
              ];
              await firebase.deleteTask({
                taskId,
                assignedTo,
                folders,
                subtaskIds,
                commentIds
              });
              dispatch(removeTask({ taskId, listId: null }));
              console.log({ tags });
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
      const listsById = await firebase.db
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
      const listsById = await firebase.db
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
      firebase.db
        .collection('lists')
        .where('projectId', '==', projectId)
        .onSnapshot(async querySnapshot => {
          querySnapshot.docChanges().forEach(async change => {
            const [listId, listData, changeType] = await Promise.all([
              change.doc.id,
              change.doc.data(),
              change.type
            ]);
            if (changeType === 'added') {
              if (listId in getState().listsById) return;
              dispatch(addList({ listId, listData }));
              console.log('list added');
            } else if (changeType === 'removed') {
              dispatch(deleteList({ listId, projectId }));
            } else {
              dispatch(updateList({ listId, listData }));
              console.log(`Updated List: ${listData.name}`);
            }
          });
        });
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
