import * as types from './types';
import firebase from '../../store/firebase';
import { setProjectLoadedState } from '../projects/actions';

export const loadTasksById = tasksById => {
  return {
    type: types.LOAD_TASKS_BY_ID,
    tasksById
  };
};

export const loadProjectTasks = (projectId, tasks) => {
  return {
    type: types.LOAD_PROJECT_TASKS,
    projectId,
    tasks
  };
};

export const loadUserTasks = (userId, tasksById) => {
  return {
    type: types.LOAD_USER_TASKS,
    userId,
    tasksById
  };
};

export const addTask = ({ taskId, taskData }) => {
  return {
    type: types.ADD_TASK,
    taskId,
    taskData
  };
};

export const removeTask = ({ taskId, listId }) => {
  console.log(taskId, ' removed');
  return {
    type: types.REMOVE_TASK,
    taskId,
    listId
  };
};

export const updateTask = ({ taskId, taskData }) => {
  return {
    type: types.UPDATE_TASK,
    taskId,
    taskData
  };
};

export const updateTasksById = task => {
  return {
    type: types.UPDATE_TASKS_BY_ID,
    task
  };
};

export const addTag = (taskId, tag) => {
  return {
    type: types.ADD_TAG,
    taskId,
    tag
  };
};

export const removeTag = ({ taskId, name }) => {
  return {
    type: types.REMOVE_TAG,
    taskId,
    name
  };
};

// Thunks

export const removeTaskTag = ({ taskId, name, userId, projectId }) => {
  return async (dispatch, getState) => {
    try {
      const { currentUser, projectsById } = getState();
      const { tags: userTags } = currentUser;
      const projectTags = projectId ? projectsById[projectId].tags : {};
      const isProjectTag = projectTags && name in projectTags;
      const isUserTag = userTags && name in userTags;
      const projectCount = isProjectTag ? projectTags[name].count - 1 : null;
      const userCount = isUserTag ? userTags[name].count - 1 : null;

      await firebase.removeTag({
        taskId,
        name,
        userId,
        userCount,
        projectId,
        projectCount
      });
      dispatch(removeTag({ taskId, name }));
    } catch (error) {
      console.error(error);
    }
  };
};

export const deleteTask = ({ taskId, listId = null }) => {
  return async (dispatch, getStore) => {
    try {
      const {
        folders,
        subtaskIds,
        commentIds,
        assignedTo,
        tags,
        projectId
      } = getStore().tasksById[taskId];
      const { userId } = getStore().currentUser;
      await firebase.deleteTask({
        taskId,
        listId,
        assignedTo,
        folders,
        subtaskIds,
        commentIds
      });
      dispatch(removeTask({ taskId, listId }));
      if (tags && tags.length > 0) {
        tags.forEach(name => {
          dispatch(removeTaskTag({ taskId: null, name, userId, projectId }));
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
};

export const fetchProjectTasks = projectId => {
  return async dispatch => {
    try {
      const tasksById = await firebase.db
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
      dispatch(loadTasksById(tasksById));
    } catch (error) {
      console.log(error);
    }
  };
};

export const syncProjectTasks = projectId => {
  return async (dispatch, getState) => {
    try {
      const subscription = await firebase
        .queryCollection('tasks', ['projectId', '==', projectId])
        .onSnapshot(async snapshot => {
          const changes = snapshot.docChanges();

          if (snapshot.size === changes.length || changes.length > 1) {
            const tasksById = {};
            changes.forEach(change => {
              tasksById[change.doc.id] = {
                taskId: change.doc.id,
                ...change.doc.data()
              };
            });
            dispatch(loadTasksById(tasksById));
            dispatch(setProjectLoadedState(projectId, 'tasks'));
          } else {
            changes.forEach(async change => {
              const [taskId, taskData, changeType] = await Promise.all([
                change.doc.id,
                change.doc.data(),
                change.type
              ]);
              const { tasksById } = getState();
              if (changeType === 'added') {
                if (taskId in tasksById) return;
                dispatch(addTask({ taskId, taskData }));
                console.log(`Task added: ${taskData.name}`);
              } else if (changeType === 'removed') {
                if (taskId in tasksById === false) return;
                const { listId } = taskData;
                dispatch(removeTask({ taskId, listId }));
                console.log(`Deleted Task: ${taskData.name}`);
              } else {
                dispatch(updateTask({ taskId, taskData }));
                console.log(`Updated Task: ${taskData.name}`);
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
