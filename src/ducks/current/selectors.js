export const getCurrentUserId = state => {
  return state.current.userId;
};

export const getCurrentProjectId = state => {
  return state.current.projectId;
};

export const getCurrentListId = state => {
  return state.current.listId;
};

export const getCurrentTaskId = state => {
  return state.current.taskId;
};

export const getCurrent = state => {
  return state.current;
};

export const getMergedTags = state => {
  const { projectId, userId } = state.current;
  const { projectsById, usersById } = state;
  const { tags: projectTags } = projectsById[projectId];
  const { tags: userTags } = usersById[userId];
  const mergedTags = { ...userTags, ...projectTags };
  return Object.keys(mergedTags).map(tag => mergedTags[tag]);
};
