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
          const listsById = {};
          snapshot.forEach(doc => {
            listsById[doc.id] = doc.data();
          });
          return listsById;
        });
      dispatch(loadListsById(listsById));
    } catch (error) {
      console.log(error);
    }
  };
};

export const updateListsById = list => {
  return {
    type: types.UPDATE_LISTS_BY_ID,
    list
  };
};
