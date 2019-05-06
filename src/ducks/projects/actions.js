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

export const loadProjectTags = ({ projectId, tags }) => {
  return {
    type: types.LOAD_PROJECT_TAGS,
    projectId,
    tags
  };
};

export const createTag = ({ tagId, tagData, projectId }) => {
  return {
    type: types.CREATE_TAG,
    tagId,
    tagData,
    projectId
  };
};

export const updateTag = ({ tagId, tagData, projectId }) => {
  return {
    type: types.UPDATE_TAG,
    tagId,
    tagData,
    projectId
  };
};

export const deleteTag = ({ tagId, projectId }) => {
  return {
    type: types.DELETE_TAG,
    tagId,
    projectId
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

export const syncUserWorkspaceProjects = ({ userId, workspaceId }) => {
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

          if (isInitialLoad) {
            const projects = {};
            changes.forEach(change => {
              const projectId = change.doc.id;
              const projectData = change.doc.data();
              projects[projectId] = {
                projectId,
                isLoaded: {
                  subtasks: projectData.listIds.length === 0,
                  tasks: true,
                  lists: projectData.listIds.length === 0,
                  tags: projectData.listIds.length === 0
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
            changes.forEach(async change => {
              const [projectId, projectData, changeType] = await Promise.all([
                change.doc.id,
                change.doc.data(),
                change.type
              ]);
              const { projectsById } = getState();
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

export const syncWorkspaceProjects = workspaceId => {
  return async (dispatch, getState) => {
    try {
      const subscription = await firebase
        .queryCollection('projects', ['workspaceId', '==', workspaceId])
        .where('settings.isPrivate', '==', false)
        .onSnapshot(async snapshot => {
          const changes = snapshot.docChanges();
          const isInitialLoad =
            snapshot.size === changes.length &&
            changes.every(change => change.type === 'added');

          if (isInitialLoad) {
            const projects = {};
            changes.forEach(change => {
              const { projectsById } = getState();
              const projectId = change.doc.id;
              if (projectsById && projectId in projectsById) return;
              const projectData = change.doc.data();
              projects[projectId] = {
                projectId,
                isLoaded: {
                  subtasks: projectData.listIds.length === 0,
                  tasks: true,
                  lists: projectData.listIds.length === 0,
                  tags: projectData.listIds.length === 0
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
            changes.forEach(async change => {
              const [projectId, projectData, changeType] = await Promise.all([
                change.doc.id,
                change.doc.data(),
                change.type
              ]);
              const { projectsById } = getState();
              if (changeType === 'added') {
                if (projectsById && projectId in projectsById) return;
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

export const syncPrivateProjects = ({ workspaceId, userId }) => {
  return async (dispatch, getState) => {
    try {
      const subscription = await firebase
        .queryCollection('projects', ['workspaceId', '==', workspaceId])
        .where('settings.isPrivate', '==', true)
        .where('ownerId', '==', userId)
        .onSnapshot(async snapshot => {
          const changes = snapshot.docChanges();
          const isInitialLoad =
            snapshot.size === changes.length &&
            changes.every(change => change.type === 'added');

          if (isInitialLoad) {
            const projects = {};
            changes.forEach(change => {
              const { projectsById } = getState();
              const projectId = change.doc.id;
              if (projectsById && projectId in projectsById) return;
              const projectData = change.doc.data();
              projects[projectId] = {
                projectId,
                isLoaded: {
                  subtasks: projectData.listIds.length === 0,
                  tasks: true,
                  lists: projectData.listIds.length === 0,
                  tags: projectData.listIds.length === 0
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
            changes.forEach(async change => {
              const [projectId, projectData, changeType] = await Promise.all([
                change.doc.id,
                change.doc.data(),
                change.type
              ]);
              const { projectsById } = getState();
              if (changeType === 'added') {
                if (projectsById && projectId in projectsById) return;
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

export const syncProjectTags = projectId => {
  return async (dispatch, getState) => {
    try {
      const subscription = await firebase
        .getDocRef('projects', projectId)
        .collection('tags')
        .onSnapshot(async snapshot => {
          const changes = await snapshot.docChanges();
          const isInitialLoad =
            snapshot.size === changes.length &&
            changes.every(change => change.type === 'added');
          if (isInitialLoad) {
            const tags = {};
            snapshot.forEach(doc => {
              tags[doc.id] = doc.data();
            });
            dispatch(loadProjectTags({ tags, projectId }));
            dispatch(setProjectLoadedState(projectId, 'tags'));
          } else {
            changes.forEach(async change => {
              const { projectsById } = getState();
              const [tagId, tagData, changeType] = await Promise.all([
                change.doc.id,
                change.doc.data(),
                change.type
              ]);
              const { tags } = projectsById[projectId];
              if (changeType === 'added') {
                if (tags && tagId in tags) return;
                dispatch(createTag({ tagId, tagData, projectId }));
                console.log('tag added');
              } else if (changeType === 'removed') {
                dispatch(deleteTag({ tagId, projectId }));
              } else if (tagData.count === 0) {
                firebase.deleteTag({ projectId, tagId });
              } else {
                dispatch(updateTag({ tagId, tagData, projectId }));
                console.log(`Updated Tag: ${tagData.name}`);
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
