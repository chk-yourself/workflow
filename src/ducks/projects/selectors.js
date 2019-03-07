export const getProjectsById = state => {
  return state.projectsById;
};

export const getProjectsArray = state => {
  const { projectsById } = state;
  return Object.keys(projectsById).map(projectId => projectsById[projectId]);
};

export const getProject = (state, projectId) => {
  const { projectsById } = state;
  return projectsById[projectId];
};

export const getProjectTags = (state, projectId) => {
  if (!projectId) return {};
  const { projectsById } = state;
  return projectsById[projectId].tags;
};

export const getProjectName = (state, projectId) => {
  if (!projectId) return '';
  const { projectsById } = state;
  return projectsById[projectId].name;
};

export const getProjectColor = (state, projectId) => {
  if (!projectId) return '';
  const { projectsById } = state;
  return projectsById[projectId].color;
};
