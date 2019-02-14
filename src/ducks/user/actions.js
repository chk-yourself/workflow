import * as types from './types';
import firebase from '../../store/firebase';

export const updateUserBoards = boardIds => {
  return {
    type: types.UPDATE_USER_BOARDS,
    boardIds
  };
};

export const fetchUserData = userId => {
  return async dispatch => {
    try {
      const user = await firebase
        .getUserDoc(userId)
        .get()
        .then(doc => doc.data());
      dispatch(loadUserData(user));
    } catch (error) {
      console.log(error);
    }
  };
};

export const loadUserData = user => {
  return {
    type: types.LOAD_USER_DATA,
    user
  };
};
