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

export const addUser = ({ userId, userData }) => {
  return {
    type: types.ADD_USER,
    userId,
    userData
  };
};

export const removeUser = userId => {
  return {
    type: types.REMOVE_USER,
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

export const updateUserStatus = (userId, status) => {
  return {
    type: types.UPDATE_USER_STATUS,
    userId,
    status
  };
};

// Thunks

export const fetchUsersById = () => {
  return async dispatch => {
    try {
      const usersById = await firebase.fs
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

export const syncUsersById = () => {
  return async (dispatch, getState) => {
    try {
      const subscription = await firebase.fs
        .collection('users')
        .onSnapshot(snapshot => {
          const changes = snapshot.docChanges();
          const isInitialLoad =
            snapshot.size === changes.length &&
            changes.every(change => change.type === 'added');

          if (isInitialLoad && changes.length > 1) {
            const users = {};
            changes.forEach(change => {
              const userId = change.doc.id;
              const userData = change.doc.data();
              users[userId] = {
                userId,
                ...userData
              };
            });
            dispatch(loadUsersById(users));
          } else {
            const { usersById } = getState();
            changes.forEach(async change => {
              const [userId, userData, changeType] = await Promise.all([
                change.doc.id,
                change.doc.data(),
                change.type
              ]);
              switch (changeType) {
                case 'added': {
                  if (userId in usersById) return;
                  dispatch(addUser({ userId, userData }));
                  break;
                }
                case 'removed': {
                  if (!(userId in usersById)) return;
                  dispatch(removeUser(userId));
                  break;
                }
                default: {
                  dispatch(updateUser({ userId, userData }));
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

export const syncMembersById = workspaceId => {
  return async (dispatch, getState) => {
    try {
      const subscription = await firebase
        .getDocRef('workspaces', workspaceId)
        .collection('members')
        .onSnapshot(snapshot => {
          const changes = snapshot.docChanges();
          const isInitialLoad =
            snapshot.size === changes.length &&
            changes.every(change => change.type === 'added');

          if (isInitialLoad && changes.length > 1) {
            const users = {};
            changes.forEach(change => {
              const userId = change.doc.id;
              const userData = change.doc.data();
              users[userId] = {
                userId,
                ...userData
              };
            });
            dispatch(loadUsersById(users));
          } else {
            const { usersById } = getState();
            changes.forEach(async change => {
              const [userId, userData, changeType] = await Promise.all([
                change.doc.id,
                change.doc.data(),
                change.type
              ]);
              switch (changeType) {
                case 'added': {
                  console.log(userId);
                  if (userId in usersById) return;
                  dispatch(addUser({ userId, userData }));
                  break;
                }
                case 'removed': {
                  if (!(userId in usersById)) return;
                  dispatch(removeUser(userId));
                  break;
                }
                default: {
                  dispatch(updateUser({ userId, userData }));
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

export const syncUserPresence = () => {
  return async (dispatch, getState) => {
    try {
      const subscription = await firebase.fs
        .collection('status')
        .onSnapshot(snapshot => {
          const changes = snapshot.docChanges();
          changes.forEach(change => {
            const userId = change.doc.id;
            const { state } = change.doc.data();
            if (change.type === 'added') {
              console.log(`User ${userId} is online`);
              // ...
            }
            if (change.type === 'removed') {
              console.log(`User ${userId} is offline.`);
              // ...
            }
            dispatch(updateUserStatus(userId, state));
          });
        });
      return subscription;
    } catch (error) {
      console.error(error);
    }
  };
};
