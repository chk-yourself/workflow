import * as types from './types';
import { RESET_ACTIVE_WORKSPACE } from '../activeWorkspace/types';

const INITIAL_STATE = null;

const listsById = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.LOAD_LISTS_BY_ID: {
      const { listsById } = action;
      return {
        ...(state && state),
        ...listsById
      };
    }
    case types.UPDATE_LIST: {
      const { listId, listData } = action;
      return {
        ...state,
        [listId]: {
          ...state[listId],
          ...listData
        }
      };
    }
    case types.ADD_LIST: {
      const { listId, listData } = action;
      return {
        ...(state && state),
        [listId]: {
          listId,
          isLoaded: true,
          ...listData
        }
      };
    }
    case types.REMOVE_LIST: {
      const { listId } = action;
      const { [listId]: deletedList, ...restOfLists } = state;
      return restOfLists;
    }
    case RESET_ACTIVE_WORKSPACE: {
      return INITIAL_STATE;
    }
    default:
      return state;
  }
};

export default listsById;
