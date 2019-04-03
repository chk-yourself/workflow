import * as types from './types';
import firebase from '../../store/firebase';
import { setProjectLoadedState } from '../projects/actions';
import {
  loadAssignedTasks,
  addAssignedTask,
  removeAssignedTask
} from '../currentUser/actions';

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

export const setTaskLoadedState = (taskId, key) => {
  return {
    type: types.SET_TASK_LOADED_STATE,
    taskId,
    key
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
        projectId,
        dueDate
      } = getStore().tasksById[taskId];
      const { userId } = getStore().currentUser;
      await firebase.deleteTask({
        taskId,
        listId,
        assignedTo,
        folders,
        subtaskIds,
        commentIds,
        dueDate,
        projectId
      });
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
              isLoaded: {
                subtasks: false,
                comments: false
              },
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
        .onSnapshot(snapshot => {
          const changes = snapshot.docChanges();
          const isInitialLoad =
            snapshot.size === changes.length &&
            changes.every(change => change.type === 'added');

          if (isInitialLoad && changes.length > 1) {
            const tasksById = {};
            changes.forEach(change => {
              const taskId = change.doc.id;
              const taskData = change.doc.data();
              tasksById[taskId] = {
                isLoaded: {
                  subtasks: false,
                  comments: false
                },
                taskId,
                ...taskData
              };
            });
            dispatch(loadTasksById(tasksById));
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
          if (isInitialLoad) {
            dispatch(setProjectLoadedState(projectId, 'tasks'));
          }
        });
      return subscription;
    } catch (error) {
      console.log(error);
    }
  };
};

export const syncUserProjectTasks = ({ userId, projectId }) => {
  return async (dispatch, getState) => {
    try {
      const subscription = await firebase
        .queryCollection('tasks', ['projectId', '==', projectId])
        .onSnapshot(snapshot => {
          const changes = snapshot.docChanges();
          const isInitialLoad =
            snapshot.size === changes.length &&
            changes.every(change => change.type === 'added');

          if (isInitialLoad && changes.length > 1) {
            const tasksById = {};
            let assignedTasks = [];
            changes.forEach(change => {
              const taskId = change.doc.id;
              const taskData = change.doc.data();
              const { subtaskIds, commentIds } = taskData;
              tasksById[taskId] = {
                isLoaded: {
                  subtasks: subtaskIds.length === 0,
                  comments: commentIds.length === 0
                },
                taskId,
                ...taskData
              };
              if (taskData.assignedTo.includes(userId)) {
                assignedTasks = assignedTasks.concat(taskId);
              }
            });
            dispatch(loadTasksById(tasksById));
            dispatch(loadAssignedTasks(assignedTasks));
          } else {
            const { tasksById, currentUser } = getState();
            const { assignedTasks } = currentUser;
            changes.forEach(async change => {
              const [taskId, taskData, changeType] = await Promise.all([
                change.doc.id,
                change.doc.data(),
                change.type
              ]);

              const isAssignedToUser = taskData.assignedTo.includes(userId);
              const isMarkedAsAssigned = assignedTasks.includes(taskId);
              if (changeType === 'added') {
                if (taskId in tasksById) return;
                dispatch(addTask({ taskId, taskData }));
                console.log(`Task added: ${taskData.name}`);
                if (isAssignedToUser) {
                  dispatch(addAssignedTask(taskId));
                }
              } else if (changeType === 'removed') {
                if (taskId in tasksById === false) return;
                const { listId } = taskData;
                if (isAssignedToUser) {
                  dispatch(removeAssignedTask(taskId));
                }
                dispatch(removeTask({ taskId, listId }));
                console.log(`Deleted Task: ${taskData.name}`);
              } else {
                if (!isAssignedToUser && isMarkedAsAssigned) {
                  dispatch(removeAssignedTask(taskId));
                }
                dispatch(updateTask({ taskId, taskData }));
                console.log(`Updated Task: ${taskData.name}`);
                if (isAssignedToUser && !isMarkedAsAssigned) {
                  dispatch(addAssignedTask(taskId));
                }
              }
            });
          }
          if (isInitialLoad) {
            dispatch(setProjectLoadedState(projectId, 'tasks'));
          }
        });
      return subscription;
    } catch (error) {
      console.log(error);
    }
  };
};

export const syncUserMiscTasks = userId => {
  return async (dispatch, getState) => {
    try {
      const subscription = await firebase
        .queryCollection('tasks', ['ownerId', '==', userId])
        .where('projectId', '==', null)
        .onSnapshot(snapshot => {
          const changes = snapshot.docChanges();
          const isInitialLoad =
            snapshot.size === changes.length &&
            changes.every(change => change.type === 'added');

          if (isInitialLoad && changes.length > 1) {
            const tasksById = {};
            changes.forEach(change => {
              tasksById[change.doc.id] = {
                taskId: change.doc.id,
                isLoaded: {
                  subtasks: false,
                  comments: false
                },
                ...change.doc.data()
              };
            });
            dispatch(loadTasksById(tasksById));
            dispatch(loadAssignedTasks(Object.keys(tasksById)));
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
                dispatch(addAssignedTask(taskId));
                console.log(`Task added: ${taskData.name}`);
              } else if (changeType === 'removed') {
                if (taskId in tasksById === false) return;
                const { listId } = taskData;
                dispatch(removeAssignedTask(taskId));
                dispatch(removeTask({ taskId, listId }));
                console.log(`Task removed: ${taskData.name}`);
              } else {
                dispatch(updateTask({ taskId, taskData }));
                console.log(`Task updated: ${taskData.name}`);
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

export const syncTaggedTasks = ({ projectId, tag }) => {
  return async (dispatch, getState) => {
    try {
      const subscription = await firebase
        .queryCollection('tasks', ['projectId', '==', projectId])
        .where('tags', 'array-contains', tag)
        .onSnapshot(snapshot => {
          const changes = snapshot.docChanges();
          const isInitialLoad =
            snapshot.size === changes.length &&
            changes.every(change => change.type === 'added');

          if (isInitialLoad && changes.length > 1) {
            const tasksById = {};
            changes.forEach(change => {
              tasksById[change.doc.id] = {
                taskId: change.doc.id,
                isLoaded: {
                  subtasks: false,
                  comments: false
                },
                ...change.doc.data()
              };
            });
            dispatch(loadTasksById(tasksById));
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
                console.log(`Removed Task: ${taskData.name}`);
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
