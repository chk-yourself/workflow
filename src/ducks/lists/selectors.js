export const getListsById = state => {
  return state.listsById;
};

export const getListsArray = state => {
  const { listsById, boardsById, current } = state;
  const { boardId } = current;
  const board = boardsById[boardId];
  if (!board) return null;
  const { listIds } = board;

  return listIds.map(listId => {
    return {
      listId,
      ...listsById[listId]
    };
  });
};
