export const getTasksById = state => {
  return state.tasksById;
};

export const getListTasks = (state, taskIds) => {
  const { tasksById } = state;
  return taskIds.map(taskId => tasksById[taskId]);
};

export const getUserTasks = (state, userId) => {
  const { usersById } = state;
  if (!usersById) return [];
  const { tasksById } = usersById[userId];
  if (!tasksById) return [];
  return Object.keys(tasksById).map(taskId => tasksById[taskId]);
};

export const getTaskTags = (state, ownProps) => {
  const { projectsById } = state;
  const { projectId, tags: taskTags } = ownProps;
  const { tags: projectTags } = projectsById[projectId];

  if (!taskTags || !projectTags) return [];
  return taskTags.map(taskTag => projectTags[taskTag]);
};
