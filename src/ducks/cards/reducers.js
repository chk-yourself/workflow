import * as types from './types';

const cardsById = (state = {}, action) => {
  switch (action.type) {
    case types.LOAD_CARDS_BY_ID:
      const { cardsById } = action;
      return {
        ...state,
        ...cardsById
      };
    case types.UPDATE_CARDS_BY_ID:
      const { card } = action;
      return {
        ...state,
        ...card
      };
    default:
      return state;
  }
};

export default cardsById;
