export const getTasksById = state => {
  return state.tasksById;
};

export const getTasksArray = state => {
  const { tasksById } = state;
  return tasksById
    ? Object.keys(tasksById).map(taskId => tasksById[taskId])
    : [];
};

export const getTasksMatchingQuery = (state, query) => {
  const regExp = new RegExp(`\\b${query}`, 'i');
  return getTasksArray(state).filter(task => {
    const { name, projectName, tags } = task;
    return (
      regExp.test(name) ||
      regExp.test(projectName) ||
      (tags && Object.keys(tags).some(tag => regExp.test(tag)))
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

export const getTaskTags = (state, taskId) => {
  const { tasksById } = state;
  if (!tasksById) return [];
  const task = tasksById[taskId];
  if (!task) return [];
  const { tagIds, tags } = task;
  if (!tagIds || !tags) return [];
  return tagIds.map(tagId => tags[tagId]);
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
      return task.tags && task.tags[tag];
    });
};

export const getTasksByViewFilter = (state, listId) => {
  const { listsById, tasksById } = state;
  const list = listsById[listId];
  const { taskIds } = list;
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
  const list = listId ? listsById[listId] : null;
  const folder =
    folderId && currentUser.folders ? currentUser.folders[folderId] : null;
  const taskIds = list ? list.taskIds : folder ? folder.taskIds : [];
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

export const getAssignees = (state, taskId) => {
  const { tasksById, usersById } = state;
  const task = tasksById[taskId];
  if (!task) return [];
  const { assignedTo } = task;
  return assignedTo.map(userId => usersById[userId]);
};

export const getCompletedSubtasks = (state, taskId) => {
  const { tasksById, subtasksById } = state;
  const task = tasksById[taskId];
  if (!task) return [];
  const { subtaskIds } = task;
  if (!subtaskIds) return [];
  return subtaskIds.filter(subtaskId => {
    const subtask = subtasksById[subtaskId];
    if (subtask) {
      return subtask.isCompleted;
    }
  });
};
