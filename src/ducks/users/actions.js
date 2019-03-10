import * as types from './types';
import firebase from '../../store/firebase';

export const loadUserData = user => {
  return {
    type: types.LOAD_USER_DATA,
    user
  };
};

export const loadUsersById = usersById => {
  return {
    type: types.LOAD_USERS_BY_ID,
    usersById
  };
};

export const fetchUsersById = () => {
  return async dispatch => {
    try {
      const usersById = await firebase.db
        .collection('users')
        .get()
        .then(snapshot => {
          const users = {};
          snapshot.forEach(doc => {
            users[doc.id] = {
              userId: doc.id,
              ...doc.data()
            };
          });
          return users;
        });
      dispatch(loadUsersById(usersById));
    } catch (error) {
      console.log(error);
    }
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

export const addUser = ({ userId, userData }) => {
  return {
    type: types.ADD_USER,
    userId,
    userData
  };
};

export const deleteUser = userId => {
  return {
    type: types.DELETE_USER,
    userId
  };
};

export const updateUser = ({ userId, userData }) => {
  return {
    type: types.UPDATE_USER,
    userId,
    userData
  };
};
