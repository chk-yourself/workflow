import * as types from './types';
import firebase from '../../store/firebase';
import { loadListsById } from '../lists/actions';
import { loadTasksById } from '../tasks/actions';
import { loadSubtasksById } from '../subtasks/actions';

export const loadProjectsById = projectsById => {
  return {
    type: types.LOAD_PROJECTS_BY_ID,
    projectsById
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
              isLoaded: {
                subtasks: false,
                tasks: false,
                lists: false
              },
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

export const fetchProjectLists = async projectId => {
  try {
    const projectLists = await firebase.db
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
    return projectLists;
  } catch (error) {
    console.log(error);
  }
};

export const fetchProjectTasks = async projectId => {
  try {
    const projectTasks = await firebase.db
      .collection('tasks')
      .where('projectId', '==', projectId)
      .get()
      .then(snapshot => {
        const tasks = {};
        snapshot.forEach(doc => {
          tasks[doc.id] = {
            taskId: doc.id,
            ...doc.data()
          };
        });
        return tasks;
      });
    return projectTasks;
  } catch (error) {
    console.log(error);
  }
};

export const fetchProjectSubtasks = async projectId => {
  try {
    const projectSubtasks = await firebase.db
      .collection('subtasks')
      .where('projectId', '==', projectId)
      .get()
      .then(snapshot => {
        const subtasks = {};
        snapshot.forEach(doc => {
          subtasks[doc.id] = {
            subtaskId: doc.id,
            ...doc.data()
          };
        });
        return subtasks;
      });
    return projectSubtasks;
  } catch (error) {
    console.log(error);
  }
};

export const fetchProjectContent = projectId => {
  return async dispatch => {
    try {
      const subtasks = fetchProjectSubtasks(projectId);
      const tasks = fetchProjectTasks(projectId);
      const lists = fetchProjectLists(projectId);
      const project = await Promise.all([subtasks, tasks, lists]);
      dispatch(loadSubtasksById(project[0]));
      dispatch(loadTasksById(project[1]));
      dispatch(loadListsById(project[2]));
    } catch (error) {
      console.log(error);
    }
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
  console.log(projectData);
  return {
    type: types.ADD_PROJECT,
    projectId,
    projectData
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
      firebase.getDocRef('projects', projectId).onSnapshot(snapshot => {
        const projectData = snapshot.data();
        dispatch(updateProject({ projectId, projectData }));
      });
    } catch (error) {
      console.error(error);
    }
  };
};

export const syncUserProjects = userId => {
  return async (dispatch, getState) => {
    try {
      firebase
        .queryCollection('projects', ['memberIds', 'array-contains', userId])
        .onSnapshot(async snapshot => {
          const changes = snapshot.docChanges();

          if (changes.length > 1) {
            const projectsById = {};
            changes.forEach(change => {
              projectsById[change.doc.id] = {
                projectId: change.doc.id,
                ...change.doc.data()
              };
            });
            dispatch(loadProjectsById(projectsById));
          } else {
            changes.forEach(async change => {
              const [projectId, projectData, changeType] = await Promise.all([
                change.doc.id,
                change.doc.data(),
                change.type
              ]);
              if (changeType === 'added') {
                if (projectId in getState().projectsById) return;
                dispatch(addProject({ projectId, projectData }));
                console.log(`Added Project: ${projectData.name}`);
              } else if (changeType === 'removed') {
                dispatch(removeProject(projectId));
                console.log(`Deleted Project: ${projectData.name}`);
              } else {
                dispatch(updateProject({ projectId, projectData }));
                console.log(`Updated Project: ${projectData.name}`);
              }
            });
          }
        });
    } catch (error) {
      console.log(error);
    }
  };
};
