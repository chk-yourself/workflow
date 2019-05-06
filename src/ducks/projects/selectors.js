import { getTasksArray } from '../tasks/selectors';

export const getProjectsById = state => {
  return state.projectsById;
};

export const getProjectsArray = (state, userId) => {
  const { projectsById } = state;
  if (!projectsById) return [];
  const projects = Object.keys(projectsById).map(
    projectId => projectsById[projectId]
  );
  return userId
    ? projects.filter(project => project.memberIds.includes(userId))
    : projects;
};

export const getProject = (state, projectId) => {
  const { projectsById } = state;
  return projectsById[projectId];
};

export const getProjectTasks = (state, projectId) => {
  const { projectsById } = state;
  if (!projectId || !projectsById) return [];
  const tasks = getTasksArray(state);
  return tasks.filter(task => task.projectId === projectId);
};

/*
export const getProjectTags = (state, projectId) => {
  if (!projectId) return {};
  const { projectsById } = state;
  return projectsById[projectId].tags;
};
*/

export const getProjectTags = (state, projectId) => {
  if (!projectId) return {};
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
  const project = projectsById[projectId];
  return project ? project.isLoaded : {};
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
