import * as types from './types';

const boardsById = (state = {}, action) => {
  switch (action.type) {
    case types.LOAD_BOARDS_BY_ID: {
      const { boardsById } = action;
      return {
        ...state,
        ...boardsById
      };
    }
    case types.UPDATE_BOARDS_BY_ID: {
      const { boardId, boardData } = action;
      return {
        ...state,
        [boardId]: {
          ...state[boardId],
          ...boardData
        }
      };
    }
    case types.UPDATE_LIST_IDS:
    case types.REORDER_LISTS: {
      const { boardId, listIds } = action;
      return {
        ...state,
        [boardId]: {
          ...state[boardId],
          listIds
        }
      };
    }
    case types.UPDATE_BOARD_TAGS: {
      const { boardId, tags } = action;
      return {
        ...state,
        [boardId]: {
          ...state[boardId],
          tags
        }
      };
    }
    default:
      return state;
  }
};

export default boardsById;
