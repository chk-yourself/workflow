export const getSubtasksById = state => {
  const { subtasksById } = state;
  return subtasksById;
};

export const getSubtasksArray = (state, subtaskIds) => {
  const { subtasksById } = state;
  if (!subtaskIds || !subtasksById) return [];
  let subtasks = [];

  for (let subtaskId of subtaskIds) {
    const subtask = subtasksById[subtaskId];
    if (!subtask) break;
    subtasks = subtasks.concat(subtask);
  }
  
  return subtasks;
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
