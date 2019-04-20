import * as types from './types';
import firebase from '../../store/firebase';
import { setProjectLoadedState } from '../projects/actions';
import { setTaskLoadedState } from '../tasks/actions';

export const loadSubtasksById = subtasksById => {
  return {
    type: types.LOAD_SUBTASKS_BY_ID,
    subtasksById
  };
};

export const addSubtask = ({ subtaskId, subtaskData }) => {
  return {
    type: types.ADD_SUBTASK,
    subtaskId,
    subtaskData
  };
};

export const removeSubtask = ({ subtaskId, taskId }) => {
  return {
    type: types.REMOVE_SUBTASK,
    subtaskId,
    taskId
  };
};

export const updateSubtask = ({ subtaskId, subtaskData }) => {
  return {
    type: types.UPDATE_SUBTASK,
    subtaskId,
    subtaskData
  };
};

// Thunks

export const syncTaskSubtasks = taskId => {
  return async (dispatch, getState) => {
    try {
      const subscription = await firebase.fs
        .collection('subtasks')
        .where('taskId', '==', taskId)
        .onSnapshot(snapshot => {
          const changes = snapshot.docChanges();
          const { tasksById } = getState();
          const task = tasksById[taskId];
          const isInitialLoad =
            snapshot.size === changes.length &&
            changes.every(change => change.type === 'added');
          if (isInitialLoad) {
            const subtasks = {};
            if (changes.length > 0) {
              changes.forEach(change => {
                const { subtasksById } = getState();
                const subtaskId = change.doc.id;
                if (subtasksById && subtaskId in subtasksById) return;
                const subtaskData = change.doc.data();
                subtasks[subtaskId] = {
                  subtaskId,
                  ...subtaskData
                };
              });
              dispatch(loadSubtasksById(subtasks));
            }
            if (!task.isLoaded.subtasks) {
              dispatch(setTaskLoadedState(taskId, 'subtasks'));
            }
          } else {
            changes.forEach(async change => {
              const [subtaskId, subtaskData, changeType] = await Promise.all([
                change.doc.id,
                change.doc.data(),
                change.type
              ]);
              const { subtasksById } = getState();
              if (changeType === 'added') {
                if (subtasksById && subtaskId in subtasksById) return;
                dispatch(addSubtask({ subtaskId, subtaskData }));
                console.log(`Subtask added: ${subtaskData.name}`);
              } else if (changeType === 'removed') {
                if (!(subtaskId in subtasksById)) return;
                dispatch(removeSubtask({ subtaskId, taskId }));
                console.log(`Subtask removed: ${subtaskData.name}`);
              } else {
                dispatch(updateSubtask({ subtaskId, subtaskData }));
                console.log(`Subtask modified: ${subtaskData.name}`);
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

export const fetchUserSubtasks = userId => {
  return async dispatch => {
    try {
      const subtasksById = await firebase.fs
        .collection('subtasks')
        .where('assignedTo', 'array-contains', userId)
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
      dispatch(loadSubtasksById(subtasksById));
    } catch (error) {
      console.log(error);
    }
  };
};

export const syncProjectSubtasks = projectId => {
  return async (dispatch, getState) => {
    try {
      const subscription = await firebase
        .queryCollection('subtasks', ['projectId', '==', projectId])
        .onSnapshot(snapshot => {
          const changes = snapshot.docChanges();
          const { projectsById } = getState();
          const project = projectsById[projectId];
          const isInitialLoad =
            snapshot.size === changes.length &&
            changes.every(change => change.type === 'added');
          if (isInitialLoad) {
            const subtasksById = {};
            changes.forEach(change => {
              const subtaskId = change.doc.id;
              const subtaskData = change.doc.data();
              subtasksById[change.doc.id] = {
                subtaskId,
                ...subtaskData
              };
            });
            dispatch(loadSubtasksById(subtasksById));
            if (!project.isLoaded.subtasks) {
              dispatch(setProjectLoadedState(projectId, 'subtasks'));
            }
          } else {
            changes.forEach(async change => {
              const [subtaskId, subtaskData, changeType] = await Promise.all([
                change.doc.id,
                change.doc.data(),
                change.type
              ]);
              const { subtasksById } = getState();
              if (changeType === 'added') {
                if (subtasksById && subtaskId in subtasksById) return;
                dispatch(addSubtask({ subtaskId, subtaskData }));
                console.log(`Subtask added: ${subtaskData.name}`);
              } else if (changeType === 'removed') {
                if (!(subtaskId in subtasksById)) return;
                const { taskId } = subtaskData;
                dispatch(removeSubtask({ subtaskId, taskId }));
                console.log(`Subtask deleted: ${subtaskData.name}`);
              } else {
                dispatch(updateSubtask({ subtaskId, subtaskData }));
                console.log(`Subtask updated: ${subtaskData.name}`);
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
