export const getSubtasksById = state => {
  const { subtasksById } = state;
  return subtasksById;
};

export const getSubtasksArray = (state, subtaskIds) => {
  const { subtasksById } = state;
  if (!subtaskIds) return [];
  let subtasks = [];

  for (let subtaskId of subtaskIds) {
    const subtask = subtasksById[subtaskId];
    if (!subtask) break;
    subtasks = subtasks.concat(subtask);
  }
  
  return subtasks;
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
  if (subtasks.includes(undefined)) return [];
  return subtasks.filter(subtask => subtask.isCompleted);
};
