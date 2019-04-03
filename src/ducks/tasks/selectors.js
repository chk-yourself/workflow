export const getTasksById = state => {
  return state.tasksById;
};

export const getTasksArray = state => {
  const { tasksById } = state;
  return Object.keys(tasksById).map(taskId => tasksById[taskId]);
};

export const getTask = (state, taskId) => {
  return state.tasksById[taskId];
};

export const getListTasks = (state, taskIds) => {
  const { tasksById } = state;
  let tasks = [];
  taskIds.forEach(taskId => {
    const task = tasksById[taskId];
    if (!task) return;
    tasks = tasks.concat(task);
  });
  return tasks;
};

export const getFolderTasks = (state, taskIds) => {
  const { tasksById } = state;
  let tasks = [];
  taskIds.forEach(taskId => {
    const task = tasksById[taskId];
    if (!task) return;
    tasks = tasks.concat(task);
  });
  return tasks;
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
  const { projectId, tags: taskTags } = ownProps;
  const { projectsById, currentUser } = state;
  if (!taskTags || taskTags.length === 0) return [];
  if (projectId && projectId in projectsById) {
    const { tags: projectTags } = projectsById[projectId];
    return taskTags.map(taskTag => projectTags[taskTag]);
  }
  if (currentUser && 'tags' in currentUser) {
    const { tags: userTags } = currentUser;
    return taskTags.map(taskTag => userTags[taskTag]);
  }
  return [];
};

export const getTaskLoadedState = (state, taskId) => {
  const { tasksById } = state;
  const task = tasksById[taskId];
  if (!task) return {};
  return task.isLoaded;
};

export const getTaggedTasks = (state, tag) => {
  const { tasksById } = state;
  return Object.keys(tasksById)
    .map(taskId => tasksById[taskId])
    .filter(task => {
      return task.tags && task.tags.includes(tag);
    });
};
