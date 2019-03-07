export const getListsById = state => {
  return state.listsById;
};

export const getListName = (state, listId) => {
  if (!listId) return '';
  const { listsById } = state;
  return listsById[listId].name;
};

export const getUserLists = (state, userId) => {
  const { usersById, listsById } = state;
  const { defaultLists, listIds } = usersById[userId];
  return [
    ...Object.keys(defaultLists).map(defaultKey => ({
      listId: null,
      defaultKey,
      ...defaultLists[defaultKey],
      isDefault: true
    })),
    ...listIds.map(listId => listsById[listId])
  ];
};

export const getListsArray = state => {
  const { listsById, projectsById, current } = state;
  const { projectId } = current;
  const project = projectsById[projectId];
  if (!project) return null;
  const { listIds } = project;

  return listIds.map(listId => listsById[listId]);
};
