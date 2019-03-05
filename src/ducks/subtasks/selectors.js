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

export const getSimpleSubtasks = (state, subtaskIds) => {
  const { subtasksById } = state;
  if (!subtaskIds) return {};

  return subtaskIds.reduce((subtasks, subtaskId) => {
    const { name, isCompleted } = subtasksById[subtaskId];
        subtasks[subtaskId] = {
          name,
          isCompleted
        };
        return subtasks;
      }, {});
  };

export const getActiveSubtasks = (state, subtaskIds) => {
  const subtasks = getSubtasksArray(state, subtaskIds);
  return subtasks.filter(subtask => !subtask.isCompleted);
};

export const getCompletedSubtasks = (state, subtaskIds) => {
  const subtasks = getSubtasksArray(state, subtaskIds);
  return subtasks.filter(subtask => subtask.isCompleted);
};
