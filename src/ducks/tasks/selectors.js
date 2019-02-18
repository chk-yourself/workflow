export const getTasksById = state => {
  const { tasksById } = state;
  return tasksById;
};

export const getTasksArray = (state, taskIds) => {
  const { tasksById } = state;
  if (!taskIds) return [];

  return taskIds.map(taskId => {
    return tasksById[taskId];
  });
};
