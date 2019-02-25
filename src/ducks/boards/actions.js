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
          const boards = {};
          snapshot.forEach(doc => {
            boards[doc.id] = {
              boardId: doc.id,
              ...doc.data()
            };
          });
          return boards;
        });
      dispatch(loadBoardsById(boardsById));
    } catch (error) {
      console.log(error);
    }
  };
};

export const updateBoard = (boardId, boardData) => {
  return {
    type: types.UPDATE_BOARD,
    boardId,
    boardData
  };
};

export const reorderLists = (boardId, listIds) => {
  return {
    type: types.REORDER_LISTS,
    boardId,
    listIds
  };
};

export const updateListIds = (boardId, listIds) => {
  return {
    type: types.UPDATE_LIST_IDS,
    boardId,
    listIds
  };
};

export const updateBoardTags = (boardId, tags) => {
  return {
    type: types.UPDATE_BOARD_TAGS,
    boardId,
    tags
  };
};
