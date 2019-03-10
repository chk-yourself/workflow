import * as types from './types';
import firebase from '../../store/firebase';

export const setAuthUser = authUser => {
  return {
    type: types.SET_AUTH_USER,
    authUser
  };
};

export const fetchAuthUserData = userId => {
  return async dispatch => {
    try {
      const authUser = await firebase
        .getDocRef(`users/${userId}`)
        .get()
        .then(doc => doc.data());
      dispatch(setAuthUser(authUser));
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
