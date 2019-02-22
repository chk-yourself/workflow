export const getSubtasksById = state => {
  const { subtasksById } = state;
  return subtasksById;
};

export const getSubtasksArray = (state, subtaskIds) => {
  const { subtasksById } = state;
  if (!subtaskIds) return [];

  return subtaskIds.map(subtaskId => {
    return subtasksById[subtaskId];
  });
};
