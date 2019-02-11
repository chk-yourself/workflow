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
    case types.UPDATE_LISTS_BY_ID: {
      const { list } = action;
      return {
        ...state,
        ...list
      };
    }
    default:
      return state;
  }
};

export default listsById;
