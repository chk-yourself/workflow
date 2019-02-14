import * as types from './types';
import firebase from '../../store/firebase';

export const loadBoardsById = boardsById => {
  return {
    type: types.LOAD_BOARDS_BY_ID,
    boardsById
  };
};

export const fetchBoardsById = userId => {
  return async dispatch => {
    try {
      const boardsById = await firebase.db
        .collection('boards')
        .where('memberIds', 'array-contains', userId)
        .get()
        .then(snapshot => {
          const boardsById = {};
          snapshot.forEach(doc => {
            boardsById[doc.id] = doc.data();
          });
          return boardsById;
        });
      dispatch(loadBoardsById(boardsById));
    } catch (error) {
      console.log(error);
    }
  };
};

export const updateBoardsById = board => {
  return {
    type: types.UPDATE_BOARDS_BY_ID,
    board
  };
};

export const reorderLists = (boardId, listIds) => {
  return {
    type: types.REORDER_LISTS,
    boardId,
    listIds
  };
};
