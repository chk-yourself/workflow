export const getListsById = state => {
  return state.listsById;
};

export const getList = (state, listId) => {
  return state.listsById[listId];
};

export const getListName = (state, listId) => {
  if (!listId) return '';
  const { listsById } = state;
  return listsById[listId].name;
};

export const getSelectedProjectLists = state => {
  const { listsById, projectsById, selectedProject } = state;
  const project = projectsById[selectedProject];
  if (!project || !project.listIds) return [];
  const { listIds } = project;

  return listIds.map(listId => listsById[listId]);
};

export const getProjectLists = (state, listIds) => {
  const { listsById } = state;
  if (!listIds) return [];

  return listIds.map(listId => listsById[listId]);
};
