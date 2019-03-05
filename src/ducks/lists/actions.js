import * as types from './types';
import firebase from '../../store/firebase';

export const loadListsById = listsById => {
  return {
    type: types.LOAD_LISTS_BY_ID,
    listsById
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

export const updateList = (listId, listData) => {
  return {
    type: types.UPDATE_LIST,
    listId,
    listData
  };
};
