export const getProjectsById = state => {
  return state.projectsById;
};

export const getProjectsArray = state => {
  const { projectsById } = state;
  return projectsById
    ? Object.keys(projectsById).map(projectId => projectsById[projectId])
    : [];
};

export const getProject = (state, projectId) => {
  const { projectsById } = state;
  return projectsById[projectId];
};

export const getProjectTasks = (state, projectId) => {
  const { projectsById, listsById, tasksById } = state;
  if (!projectsById || !listsById || !tasksById) return [];
  const { listIds } = projectsById[projectId];
  return listIds.reduce((tasks, listId) => {
    const list = listsById[listId];
    if (list) {
      const { taskIds } = list;
      return tasks.concat(taskIds.map(taskId => tasksById[taskId]));
    }
    return tasks;
  }, []);
};

/*
export const getProjectTags = (state, projectId) => {
  if (!projectId) return {};
  const { projectsById } = state;
  return projectsById[projectId].tags;
};
*/

export const getProjectTags = (state, projectId) => {
  const tasks = getProjectTasks(state, projectId);
  return tasks.reduce((tags, task) => {
    return {
      ...tags,
      ...(task && task.tags && task.tags)
    };
  }, {});
};

export const getProjectName = (state, projectId) => {
  if (!projectId) return '';
  const { projectsById } = state;
  const project = projectsById[projectId];
  if (!project) return null;
  return project.name;
};

export const getProjectColor = (state, projectId) => {
  if (!projectId) return null;
  const { projectsById } = state;
  const project = projectsById[projectId];
  if (!project) return null;
  return project.color;
};

export const getProjectLoadedState = (state, projectId) => {
  if (!projectId) return '';
  const { projectsById } = state;
  return projectsById[projectId].isLoaded;
};

export const getProjectLists = (state, projectId) => {
  const { projectsById, listsById } = state;
  if (!projectsById || !listsById || !projectId) return [];
  const { listIds } = projectsById[projectId];
  return listIds.map(listId => listsById[listId]);
};

export const getTempProjectSettings = (state, projectId) => {
  const { projectsById } = state;
  const { tempSettings } = projectsById[projectId];
  return tempSettings;
};
