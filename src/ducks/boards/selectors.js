export const getBoardsById = state => {
  return state.boardsById;
};

export const getBoardsArray = state => {
  const { boardsById } = state;
  return Object.keys(boardsById).map(boardId => {
    return {
      boardId,
      ...boardsById[boardId]
    };
  });
};
