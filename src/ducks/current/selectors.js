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

export const getMergedTags = state => {
  const { boardId, userId } = state.current;
  const { boardsById, usersById } = state;
  const { tags: boardTags } = boardsById[boardId];
  const { tags: userTags } = usersById[userId];
  const mergedTags = { ...userTags, ...boardTags };
  return Object.keys(mergedTags).map(tag => mergedTags[tag]);
};
