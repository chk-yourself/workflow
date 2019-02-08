import * as types from './types';

const listsById = (state = {}, action) => {
  switch (action.type) {
    case types.LOAD_LISTS_BY_ID:
      return {
        ...state,
        ...action.listsById
      };
    case types.UPDATE_LISTS_BY_ID:
      return {
        ...state,
        ...action.list
      };
    default:
      return state;
  }
};

export default listsById;
