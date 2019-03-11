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

export const deleteList = listId => {
  return {
    type: types.DELETE_LIST,
    listId
  };
};

export const handleListSubscription = projectId => {
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
              dispatch(deleteList(listId));
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
