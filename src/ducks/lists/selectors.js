export const getListsById = state => {
  return state.listsById;
};

export const getUserLists = (state, userId) => {
  const { usersById, listsById } = state;
  
};

export const getListsArray = state => {
  const { listsById, projectsById, current } = state;
  const { projectId } = current;
  const project = projectsById[projectId];
  if (!project) return null;
  const { listIds } = project;

  return listIds.map(listId => {
    return {
      listId,
      ...listsById[listId]
    };
  });
};
