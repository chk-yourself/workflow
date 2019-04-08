export const getTasksById = state => {
  return state.tasksById;
};

export const getTasksArray = state => {
  const { tasksById } = state;
  return Object.keys(tasksById).map(taskId => tasksById[taskId]);
};

export const getTasksMatchingQuery = (state, query) => {
  const regExp = new RegExp(`\\b${query}`, 'i');
  return getTasksArray(state).filter(task => {
    return (
      regExp.test(task.name) ||
      regExp.test(task.projectName) ||
      (task.tags && task.tags.some(tag => regExp.test(tag)))
    );
  });
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

export const getTasksByViewFilter = (state, taskIds) => {
  const { tasksById } = state;
  return taskIds.reduce(
    (tasksByView, taskId) => {
      const task = tasksById[taskId];
      const { all, completed, active } = tasksByView;
      if (task) {
        return task.isCompleted
          ? {
              active,
              all: [...all, task],
              completed: [...completed, task]
            }
          : {
              completed,
              all: [...all, task],
              active: [...active, task]
            };
      }
      return tasksByView;
    },
    {
      all: [],
      completed: [],
      active: []
    }
  );
};

export const getTaskIdsByViewFilter = (state, { listId, folderId }) => {
  const { tasksById, listsById, currentUser } = state;
  const taskIds = listId
    ? listsById[listId].taskIds
    : currentUser.folders[folderId].taskIds;
  return taskIds.reduce(
    (taskIdsByView, taskId) => {
      const task = tasksById[taskId];
      const { completed, active } = taskIdsByView;
      if (task) {
        return task.isCompleted
          ? {
              ...taskIdsByView,
              completed: [...completed, taskId]
            }
          : {
              ...taskIdsByView,
              active: [...active, taskId]
            };
      }
      return taskIdsByView;
    },
    {
      all: taskIds,
      completed: [],
      active: []
    }
  );
};

export const getSortedTaskIds = (state, taskIds, sortBy) => {
  const { tasksById } = state;
  switch (sortBy) {
    case 'dueDate': {
      return [...taskIds].sort((a, b) => {
        const taskA = tasksById[a];
        const taskB = tasksById[b];
        const dueDateA = taskA.dueDate ? taskA.dueDate.toMillis() : null;
        const dueDateB = taskB.dueDate ? taskB.dueDate.toMillis() : null;
        if (!dueDateA && dueDateB) {
          return 1;
        }
        if (dueDateA && !dueDateB) {
          return -1;
        }
        if (!dueDateA && !dueDateB) {
          return 0;
        }
        return dueDateA - dueDateB;
      });
    }
    default: {
      return taskIds;
    }
  }
};
