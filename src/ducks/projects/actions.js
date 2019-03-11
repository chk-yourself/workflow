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

export const fetchProjectDetails = async projectId => {
  try {
    const project = await firebase.getDocRef(`projects/${projectId}`).get();
    return {
      projectId,
      ...project.data()
    };
  } catch (error) {
    console.log(error);
  }
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
