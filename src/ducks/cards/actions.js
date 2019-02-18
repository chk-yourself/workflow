import * as types from './types';
import firebase from '../../store/firebase';

export const loadCardsById = cardsById => {
  return {
    type: types.LOAD_CARDS_BY_ID,
    cardsById
  };
};

export const fetchCardsById = boardId => {
  return async dispatch => {
    try {
      const cardsById = await firebase.db
        .collection('cards')
        .where('boardId', '==', boardId)
        .get()
        .then(snapshot => {
          const cards = {};
          snapshot.forEach(doc => {
            cards[doc.id] = {
              cardId: doc.id,
              ...doc.data()
            };
          });
          return cards;
        });
      dispatch(loadCardsById(cardsById));
    } catch (error) {
      console.log(error);
    }
  };
};

export const updateCardsById = card => {
  return {
    type: types.UPDATE_CARDS_BY_ID,
    card
  };
};

