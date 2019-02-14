import * as types from './types';

const current = (state = {}, action) => {
  switch (action.type) {
    case types.SELECT_BOARD: {
      const { boardId } = action;
      return {
        ...state,
        boardId
      };
    }
    case types.SELECT_LIST: {
      const { listId } = action;
      return {
        ...state,
        listId
      };
    }
    case types.SELECT_CARD: {
      const { cardId } = action;
      return {
        ...state,
        cardId
      };
    }
    default:
      return state;
  }
};

export { current };
