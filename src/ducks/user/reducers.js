import * as types from './types';

const user = (state = {}, action) => {
  switch (action.type) {
    case types.UPDATE_USER_BOARDS:
      return {
        ...state,
        boardIds: [...action.boardIds]
      };
    case types.LOAD_USER_DATA:
      return {
        ...state,
        ...action.user
      };
    default:
      return state;
  }
};

export default user;
