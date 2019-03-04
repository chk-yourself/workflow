import * as types from './types';
import firebase from '../../store/firebase';

export const loadProjectsById = projectsById => {
  return {
    type: types.LOAD_PROJECTS_BY_ID,
    projectsById
  };
};

export const fetchProjectsById = userId => {
  return async dispatch => {
    try {
      const projectsById = await firebase.db
        .collection('projects')
        .where('memberIds', 'array-contains', userId)
        .get()
        .then(snapshot => {
          const projects = {};
          snapshot.forEach(doc => {
            projects[doc.id] = {
              projectId: doc.id,
              ...doc.data()
            };
          });
          return projects;
        });
      dispatch(loadProjectsById(projectsById));
    } catch (error) {
      console.log(error);
    }
  };
};

export const fetchProject = projectId => {
  return async dispatch => {
    try {
      const projectsById = await firebase.db
        .getProjectDoc(projectId)
        .get()
        .then(doc => {
          const projects = {};
          projects[doc.id] = {
            projectId: doc.id,
            ...doc.data()
          };
          return projects;
        });
      dispatch(loadProjectsById(projectsById));
    } catch (error) {
      console.log(error);
    }
  };
};

export const updateProject = (projectId, projectData) => {
  return {
    type: types.UPDATE_PROJECT,
    projectId,
    projectData
  };
};

export const reorderLists = (projectId, listIds) => {
  return {
    type: types.REORDER_LISTS,
    projectId,
    listIds
  };
};

export const updateListIds = (projectId, listIds) => {
  return {
    type: types.UPDATE_LIST_IDS,
    projectId,
    listIds
  };
};

export const updateProjectTags = (projectId, tags) => {
  return {
    type: types.UPDATE_PROJECT_TAGS,
    projectId,
    tags
  };
};
