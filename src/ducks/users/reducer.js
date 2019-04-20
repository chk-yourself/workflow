import * as types from './types';
import { RESET_ACTIVE_WORKSPACE } from '../activeWorkspace/types';

const INITIAL_STATE = null;

const usersById = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.LOAD_USERS_BY_ID: {
      const { usersById } = action;
      return {
        ...(state && state),
        ...usersById
      };
    }
    case types.LOAD_USER_DATA: {
      const { user } = action;
      return {
        ...(state && state),
        ...user
      };
    }
    case types.ADD_USER: {
      const { userId, userData } = action;
      return {
        ...(state && state),
        [userId]: {
          userId,
          ...userData
        }
      };
    }
    case types.REMOVE_USER: {
      const { userId } = action;
      const { [userId]: deletedUser, ...restOfUsers } = state;
      return restOfUsers;
    }
    case types.UPDATE_USER: {
      const { userId, userData } = action;
      return {
        ...state,
        [userId]: {
          ...state[userId],
          ...userData
        }
      };
    }
    case types.UPDATE_USER_STATUS: {
      const { userId, status } = action;
      return {
        ...state,
        [userId]: {
          ...state[userId],
          isOnline: status === 'online'
        }
      };
    }
    case types.REORDER_FOLDERS: {
      const { userId, folderIds } = action;
      return {
        ...state,
        [userId]: {
          ...state[userId],
          folderIds
        }
      };
    }
    case RESET_ACTIVE_WORKSPACE: {
      return INITIAL_STATE;
    }
    default:
      return state;
  }
};

export default usersById;
