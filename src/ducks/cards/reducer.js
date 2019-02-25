import * as types from './types';

const cardsById = (state = {}, action) => {
  switch (action.type) {
    case types.LOAD_CARDS_BY_ID: {
      const { cardsById } = action;
      return {
        ...state,
        ...cardsById
      };
    }
    case types.UPDATE_CARDS_BY_ID: {
      const { card } = action;
      console.log('cards updated');
      return {
        ...state,
        ...card
      };
    }
    case types.ADD_CARD: {
      const { cardId, cardData } = action;
      return {
        ...state,
        [cardId]: {
          cardId,
          ...cardData
        }
      };
    }
    case types.DELETE_CARD: {
      const { cardId } = action;
      const { [cardId]: deletedCard, ...restOfCards } = state;
      return restOfCards;
    }
    case types.UPDATE_CARD: {
      const { cardId, cardData } = action;
      return {
        ...state,
        [cardId]: {
          ...state[cardId],
          ...cardData
        }
      };
    }
    case types.ADD_TAG: {
      const { cardId, tag } = action;
      return {
        ...state,
        [cardId]: {
          ...state[cardId],
          tags: [...state[cardId].tags, tag]
        }
      };
    }
    default:
      return state;
  }
};

export default cardsById;
