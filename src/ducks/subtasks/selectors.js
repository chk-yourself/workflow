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

export const getActiveSubtasks = (state, subtaskIds) => {
  const subtasks = getSubtasksArray(state, subtaskIds);
  return subtasks.filter(subtask => !subtask.isCompleted);
};

export const getCompletedSubtasks = (state, subtaskIds) => {
  const subtasks = getSubtasksArray(state, subtaskIds);
  return subtasks.filter(subtask => subtask.isCompleted);
};
