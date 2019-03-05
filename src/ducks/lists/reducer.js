import * as types from './types';

const listsById = (state = {}, action) => {
  switch (action.type) {
    case types.LOAD_LISTS_BY_ID: {
      const { listsById } = action;
      return {
        ...state,
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
    default:
      return state;
  }
};

export default listsById;
