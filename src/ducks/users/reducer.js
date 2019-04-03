import * as types from './types';

const usersById = (state = {}, action) => {
  switch (action.type) {
    case types.LOAD_USERS_BY_ID: {
      const { usersById } = action;
      return {
        ...state,
        ...usersById
      };
    }
    case types.LOAD_USER_DATA: {
      const { user } = action;
      return {
        ...state,
        ...user
      };
    }
    case types.ADD_USER: {
      const { userId, userData } = action;
      return {
        ...state,
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
    default:
      return state;
  }
};

export default usersById;
