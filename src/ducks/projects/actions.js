import * as types from './types';
import firebase from '../../store/firebase';
import { loadListsById } from '../lists/actions';

export const loadProjectsById = projectsById => {
  return {
    type: types.LOAD_PROJECTS_BY_ID,
    projectsById
  };
};

export const setTempProjectSettings = ({ projectId, view, sortBy, layout }) => {
  return {
    type: types.SET_TEMP_PROJECT_SETTINGS,
    projectId,
    view,
    sortBy,
    layout
  };
};

export const setProjectLoadedState = (projectId, key) => {
  return {
    type: types.SET_PROJECT_LOADED_STATE,
    projectId,
    key
  };
};

export const loadProject = (projectId, projectData) => {
  return {
    type: types.LOAD_PROJECT,
    projectId,
    projectData
  };
};

export const updateProject = ({ projectId, projectData }) => {
  return {
    type: types.UPDATE_PROJECT,
    projectId,
    projectData
  };
};

export const addProject = ({ projectId, projectData }) => {
  return {
    type: types.ADD_PROJECT,
    projectId,
    projectData: {
      tempSettings: {
        layout: projectData.settings.layout,
        tasks: {
          ...projectData.settings.tasks
        }
      },
      ...projectData
    }
  };
};

export const removeProject = projectId => {
  return {
    type: types.REMOVE_PROJECT,
    projectId
  };
};

export const reorderLists = (projectId, listIds) => {
  return {
    type: types.REORDER_LISTS,
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

export const syncProject = projectId => {
  return async dispatch => {
    try {
      const subscription = await firebase
        .getDocRef('projects', projectId)
        .onSnapshot(snapshot => {
          const projectData = snapshot.data();
          dispatch(updateProject({ projectId, projectData }));
        });
      return subscription;
    } catch (error) {
      console.error(error);
    }
  };
};

export const syncUserWorkspaceProjects = ({userId, workspaceId}) => {
  return async (dispatch, getState) => {
    try {
      const subscription = await firebase
        .queryCollection('projects', ['memberIds', 'array-contains', userId])
        .where('workspaceId', '==', workspaceId)
        .onSnapshot(async snapshot => {
          const changes = snapshot.docChanges();
          const isInitialLoad =
            snapshot.size === changes.length &&
            changes.every(change => change.type === 'added');

          if (isInitialLoad && changes.length > 1) {
            const projects = {};
            changes.forEach(change => {
              const projectId = change.doc.id;
              const projectData = change.doc.data();
              projects[projectId] = {
                projectId,
                isLoaded: {
                  subtasks: projectData.listIds.length === 0,
                  tasks: true,
                  lists: projectData.listIds.length === 0
                },
                tempSettings: {
                  layout: projectData.settings.layout,
                  tasks: { ...projectData.settings.tasks }
                },
                ...projectData
              };
            });
            dispatch(loadProjectsById(projects));
          } else {
            const { projectsById } = getState();
            changes.forEach(async change => {
              const [projectId, projectData, changeType] = await Promise.all([
                change.doc.id,
                change.doc.data(),
                change.type
              ]);
              if (changeType === 'added') {
                if (projectId in projectsById) return;
                dispatch(addProject({ projectId, projectData }));
                console.log(`Added Project: ${projectData.name}`);
              } else if (changeType === 'removed') {
                if (!(projectId in projectsById)) return;
                dispatch(removeProject(projectId));
                console.log(`Deleted Project: ${projectData.name}`);
              } else {
                dispatch(updateProject({ projectId, projectData }));
                console.log(`Updated Project: ${projectData.name}`);
              }
            });
          }
        });
      return subscription;
    } catch (error) {
      console.log(error);
    }
  };
};


export const fetchProjectLists = projectId => {
  return async dispatch => {
    try {
      const projectLists = await firebase.fs
        .collection('lists')
        .where('projectId', '==', projectId)
        .get()
        .then(snapshot => {
          const lists = {};
          snapshot.forEach(doc => {
            lists[doc.id] = {
              listId: doc.id,
              ...doc.data()
            };
          });
          return lists;
        });
      dispatch(loadListsById(projectLists));
    } catch (error) {
      console.log(error);
    }
  };
};
