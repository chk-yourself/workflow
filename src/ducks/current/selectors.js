export const getCurrentUserId = state => {
  return state.current.userId;
};

export const getCurrentBoardId = state => {
  return state.current.boardId;
};

export const getCurrentListId = state => {
  return state.current.listId;
};

export const getCurrentCardId = state => {
  return state.current.cardId;
};

export const getCurrent = state => {
  return state.current;
};
