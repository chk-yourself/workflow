export const getListsById = state => {
  return state.listsById;
};

export const getListsArray = state => {
  const { listsById } = state;
  return Object.keys(listsById).map(listId => {
    return {
      listId,
      ...listsById[listId]
    };
  });
};
