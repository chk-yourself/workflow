import * as types from './types';

const authUser = (state = null, action) => {
  switch (action.type) {
    case types.SET_AUTH_USER: {
      const { authUser } = action;
      return authUser;
    }
    case types.LOAD_FOLDERS: {
      const { folders } = action;
      return {
        ...state,
        folders
      };
    }
    case types.ADD_FOLDER: {
      const { folderId, folderData } = action;
      return {
        ...state,
        folders: {
          ...state.folders,
          [folderId]: {
            folderId,
            ...folderData
          }
        }
      };
    }
    case types.DELETE_FOLDER: {
      const { folderId } = action;
      const { [folderId]: deletedFolder, ...restOfFolders } = state.folders;
      return {
        ...state,
        folders: restOfFolders
      };
    }
    case types.UPDATE_FOLDER: {
      const { folderId, folderData } = action;
      return {
        ...state,
        folders: {
          ...state.folders,
          [folderId]: {
            ...state.folders[folderId],
            ...folderData
          }
        }
      };
    }
    case types.UPDATE_FOLDER_IDS:
    case types.REORDER_FOLDERS: {
      const { folderIds } = action;
      return {
        ...state,
        folderIds
      };
    }
    default:
      return state;
  }
};

export default authUser;
