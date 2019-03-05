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
  const { projectsById } = state;
  return projectsById[projectId].tags;
};
