import * as types from './types';

const boardsById = (state = {}, action) => {
  switch (action.type) {
    case types.LOAD_BOARDS_BY_ID:
      const { boardsById } = action;
      return {
        ...state,
        ...boardsById
      };
    case types.UPDATE_BOARDS_BY_ID:
      const { board } = action;
      return {
        ...state,
        ...board
      };
    default:
      return state;
  }
};

export default boardsById;
