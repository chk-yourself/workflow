import * as types from './types';
import firebase from '../../store/firebase';

export const selectBoard = boardId => {
  return {
    type: types.SELECT_BOARD,
    boardId
  };
};

export const selectList = listId => {
  return {
    type: types.SELECT_LIST,
    listId
  };
};

export const selectCard = cardId => {
  return {
    types: types.SELECT_CARD,
    cardId
  };
};
