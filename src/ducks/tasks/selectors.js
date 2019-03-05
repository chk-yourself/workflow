export const getTasksById = state => {
  return state.tasksById;
};

export const getListTasks = (state, taskIds) => {
  const { tasksById } = state;
  return taskIds.map(taskId => tasksById[taskId]);
};

export const getSimpleTasks = (state, taskIds) => {
  const { tasksById } = state;
  if (!taskIds) return {};

  return taskIds.reduce((tasks, taskId) => {
    const { name, isCompleted } = tasksById[taskId];
    tasks[taskId] = {
      name,
      isCompleted
    };
    return tasks;
  }, {});
};

export const getTaskTags = (state, ownProps) => {
  if (!ownProps.projectId) return [];
  const { projectsById } = state;
  const { projectId, tags: taskTags } = ownProps;
  const { tags: projectTags } = projectsById[projectId];

  if (!taskTags || !projectTags) return [];
  return taskTags.map(taskTag => projectTags[taskTag]);
};
